
import python_pg_utility as ppu
import inspect
from datetime import datetime as dt
from datetime import timedelta as td
import code
import csv
import os
import json
import pprint as pp
import hard_coded_seed_data as hcsd
import random

"""
source venv/bin/activate
"""
id_alphabet = [c for c in 'abcdefghijklmnopqrstuvwxyz1234567890']
def id_gen():
    return ''.join(random.choice(id_alphabet) for _ in range(12))

def pprint(obj):
    pp.sorted = lambda x, key=None: x
    pp.pprint(obj, width=100)

def build_and_populate_tables(env='test'):
    conn = ppu.conn_retry(ppu.get_sql_db(env))
    cur = conn.cursor()


    def get_user_tb_req():
        return """
            CREATE TABLE IF NOT EXISTS users
              (id              varchar(12) PRIMARY KEY,
               user_name       varchar UNIQUE,
               full_name       varchar,
               email           varchar,
               salt_password   varchar,
               photo_link      varchar,
               summary         varchar,
               created_at      timestamp default current_timestamp,
               is_deleted      boolean
               )
            """
  
    def get_question_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS questions
                 (id              varchar(12) PRIMARY KEY,
                  author_id       varchar(12) REFERENCES users (id),
                  title           varchar,
                  description     varchar,
                  tags            varchar Array,
                  response_count  int,
                  meta_count      int,
                  up_vote         int,
                  down_vote       int,
                  created_at      timestamp default current_timestamp,
                  is_deleted      boolean)
               """
    def get_comment_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS comments
                 (id              varchar(12) PRIMARY KEY,
                  content         varchar,
                  type            comment_type,
                  author_id       varchar(12) REFERENCES users (id),
                  author_name     varchar, 
                  question_id     varchar(12) REFERENCES questions (id),
                  parent_id       varchar(12) REFERENCES comments (id),
                  up_vote         int,
                  down_vote       int,
                  created_at      timestamp default current_timestamp,
                  is_deleted      boolean)
               """
    def get_votes_tb_req():
        return """ 
                CREATE TABLE IF NOT EXISTS votes
                (id           varchar(12) PRIMARY KEY,
                 user_id      varchar(12) REFERENCES users (id),
                 action       vote_options_type,
                 subject_id   bigint,  
                 subject_type allowed_subject_types,
                 created_at  timestamp default current_timestamp)
               """

    tables = [
      {'table_name': 'users',
       'columns': ['id', 'user_name', 'full_name', 'email', 'salt_password', 'photo_link', 'summary'],
       'pkeys': ['id'],
       'hard_coded_rows':  hcsd.users_rows,
       },
      {'table_name': 'questions',
       'columns': ['id', 'author_id', 'title', 'description', 'tags', 'response_count', 'meta_count', 'up_vote', 'down_vote'],
       'pkeys': ['id'],
       'hard_coded_rows': hcsd.question_rows
       },


      {'table_name': 'comments',
       'columns': ['id','content','type','author_id','author_name', 'question_id','parent_id','created_at','up_vote','down_vote'],
       'pkeys': ['id'],
       'hard_coded_rows': hcsd.comment_rows
       },
      {'table_name': 'votes',
       'columns': [
                'id',           
                'user_id',      
                'action',       
                'subject_id',   
                'subject_type'], 
       'pkeys': ['id'],
       'hard_coded_rows': hcsd.vote_rows
       },
    ]
    # Define tables
    enum_map = {
        'comment_type'         : {'response', 'meta'},
        'vote_options_type'    : {'up_vote', 'down_vote'},
        'allowed_subject_types': {'comments', 'questions'}
    }
    ppu.build_enum_types(conn, enum_map)
    for req in [get_user_tb_req(), get_question_tb_req(), get_comment_tb_req(), get_votes_tb_req()]:
        cur.execute(req)
    conn.commit()

    # build temp tables for upsert
    for tb_control in tables:
        tb = tb_control['table_name']
        cur.execute("CREATE TEMP TABLE temp_%s AS SELECT * FROM %s WHERE False" % (tb,tb))
        ppu.bulk_insert(cur=cur,
                        table_name=f'temp_{tb}',
                        columns=tb_control['columns'],
                        rows=[[row.get(c) for c in tb_control['columns']]
                               for row in tb_control['hard_coded_rows']])
        ppu.pkey_upsert(cur=cur,
                        perm_table=tb,
                        temp_table=f'temp_{tb}',
                        pkeys=tb_control['pkeys'],
                        all_cols=tb_control['columns'])
    conn.commit()

    recompute_counts(cur, conn)
    
    # dedundantly storing author name 
    # in comments to save a query 
    recompute_author_names(cur, conn)

def recompute_author_names(cur, conn):
    cur.execute("""
      UPDATE comments
      SET author_name = users.user_name
      FROM users 
      WHERE comments.author_id = users.id
      """)
    conn.commit()

def recompute_counts(cur, conn):

    cur.execute("SELECT id FROM questions")
    all_q_ids = set(qid for (qid,) in cur)
    all_tups = {}
    for q in all_q_ids:
        all_tups[(q, 'meta_count')] = 0
        all_tups[(q, 'response_count')] = 0

    cur.execute(""" SELECT question_id, type, SUM(1)
                    FROM comments 
                    GROUP BY question_id, type """)
    cnts = cur.fetchall()

    for q, t, cnt in cnts:
        all_tups[(q,t)] = cnt

    rows = [(q,t,c) for (q,t), c in all_tups.items()]
    ps([r for r in rows if r[2] > 0])

    cur.execute("CREATE TEMP TABLE temp_cnt (qid varchar, type varchar, cnt int) ")
    ppu.bulk_insert(cur=cur,
                    table_name='temp_cnt',
                    columns=['qid', 'type', 'cnt'],
                    rows=rows)
    cur.execute(""" 
      UPDATE questions
      SET response_count = cnt
      FROM temp_cnt
      WHERE temp_cnt.qid = questions.id
        AND temp_cnt.type = 'response';
      UPDATE questions
      SET meta_count = cnt
      FROM temp_cnt
      WHERE temp_cnt.qid = questions.id
        AND temp_cnt.type = 'meta'
      """)
    conn.commit()
    cur.execute("DROP TABLE   temp_cnt;")


def temp_map_to_tags(cur, conn):
    tb_tags = {
        'technical'     :   ['technical'], 
        'Misc': ['fun'], 
        'coordination': ['fit'], 
        'SWE - Technical': ['technical'], 
        'Team Coordination': ['fit'], 
        'Misc - Technical': ['technical'], 
        'SWE - Team Process': ['technical', 'fut'], 
        'Personal Motivations': ['motivation']}
    
    cur.execute(" SELECT id, tags FROM questions ")
    temp = []
    for qid, tags in cur:
        if not tags:
          continue
        all_t = set(tags)
        for t in tags:
          for nt in tb_tags.get(t, []):
            all_t.add(nt)
        temp.append((qid, list(all_t)))
    if temp:
      cur.execute("CREATE TEMP TABLE temp_tags (qid varchar, new_tags varchar[]) ")
      ppu.bulk_insert(cur=cur,
                      table_name='temp_tags',
                      columns=['qid', 'new_tags'],
                      rows=temp)
      cur.execute(""" 
        UPDATE questions
        SET tags = new_tags
        FROM temp_tags
        WHERE temp_tags.qid = questions.id
        """)
      conn.commit()
      cur.execute("DROP TABLE temp_tags;")






def py_interact(f_locals):  
    def clear():
        print(chr(27) + "[2J")
        os.system('cls' if os.name == 'nt' else 'clear')

    frame = inspect.currentframe().f_back
    module = frame.f_globals['__file__']
    banner = 'Interacting at %s:%d' % (module, frame.f_lineno)

    f_globals = dict(frame.f_globals.items())
    context = f_globals.copy()
    context.update(f_locals)
    context.update(locals())
    code.interact(banner=banner, local=context)

def ps(rows, order_on_idxs=[0], truncate_to=45):
    pg_r_print(rows, order_on_idxs=order_on_idxs, truncate_to=truncate_to)

def pg_r_print(rows, order_on_idxs=[0], truncate_to=45):
    if type(order_on_idxs) != list:
      order_on_idxs = [order_on_idxs]
    ppu.print_order_sql_rows(rows, cols_to_sort=order_on_idxs, siz=truncate_to)

if __name__ == '__main__':
    # build_and_populate_tables('dev')
    conn = ppu.conn_retry(ppu.get_sql_db(env='dev'))
    cur = conn.cursor()
    py_interact(locals())














