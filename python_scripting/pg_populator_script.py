
import python_pg_utility as ppu
import tags
import inspect
from datetime import datetime as dt
from datetime import timedelta as td
import code
import csv
import os
import json
import pprint as pp

import random

"""
source venv/bin/activate
psql -h minidb.cpoebeflfeyk.us-east-1.rds.amazonaws.com -d postgres  -U postgres -p 5432
pkill -f node


ALTER TABLE users     ADD COLUMN updated_at timestamp DEFAULT current_timestamp;
ALTER TABLE questions ADD COLUMN updated_at timestamp DEFAULT current_timestamp;
ALTER TABLE comments  ADD COLUMN updated_at timestamp DEFAULT current_timestamp;
ALTER TABLE votes     ADD COLUMN updated_at timestamp DEFAULT current_timestamp;

CREATE TRIGGER update_at_users     BEFORE UPDATE ON users     FOR EACH ROW EXECUTE PROCEDURE update_at_trigger();
CREATE TRIGGER update_at_questions BEFORE UPDATE ON questions FOR EACH ROW EXECUTE PROCEDURE update_at_trigger();
CREATE TRIGGER update_at_comments  BEFORE UPDATE ON comments  FOR EACH ROW EXECUTE PROCEDURE update_at_trigger();
CREATE TRIGGER update_at_votes     BEFORE UPDATE ON votes     FOR EACH ROW EXECUTE PROCEDURE update_at_trigger();

ALTER TABLE comments ADD COLUMN is_edited boolean   DEFAULT false;
ALTER TABLE comments ADD COLUMN is_answer boolean GENERATED ALWAYS AS (id = parent_id) STORED;
ALTER TABLE questions ADD COLUMN last_commented_at timestamp;


ALTER TABLE questions ADD COLUMN up_votes int DEFAULT 0;
ALTER TABLE questions ADD COLUMN down_votes int DEFAULT 0;
ALTER TABLE comments  ADD COLUMN up_votes int DEFAULT 0;
ALTER TABLE comments  ADD COLUMN down_votes int DEFAULT 0;

ALTER TABLE tags ADD COLUMN priority int DEFAULT 0;


UPDATE comments SET is_answer = (parent_id = id) and type = 'response'

CREATE INDEX i_questions_  ON questions  (available);

"""
id_alphabet = [c for c in 'abcdefghijklmnopqrstuvwxyz1234567890']
def id_gen():
    return ''.join(random.choice(id_alphabet) for _ in range(12))

def pprint(obj):
    pp.sorted = lambda x, key=None: x
    pp.pprint(obj, width=100)

def run(commands):
    conn = ppu.conn_retry(ppu.get_sql_db('dev'))
    cur = conn.cursor()
    for command in commands:
      cur.execute(command)
    conn.commit()

def get_tags_tb_req():
  return """
            CREATE TABLE IF NOT EXISTS tags
            (id           varchar PRIMARY KEY,
             display_name varchar
            )
            """

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
               created_at      timestamp DEFAULT current_timestamp,
               updated_at      timestamp DEFAULT current_timestamp,
               is_deleted      boolean
               )
            """
  
    def get_question_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS questions
                 (id                varchar(12) PRIMARY KEY,
                  author_id         varchar(12) REFERENCES users (id),
                  title             varchar,
                  description       varchar,
                  tags              varchar Array,
                  response_count    int,
                  meta_count        int,
                  up_votes          int       DEFAULT 0,
                  down_votes        int       DEFAULT 0,
                  last_commented_at timestamp DEFAULT current_timestamp,
                  last_comment_id   varchar(12) REFERENCES comments (id),
                  created_at        timestamp   DEFAULT current_timestamp,
                  updated_at        timestamp   DEFAULT current_timestamp,
                  is_deleted        boolean)
                  
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
                  up_votes        int       DEFAULT 0,
                  down_votes      int       DEFAULT 0,
                  is_edited       boolean   DEFAULT false,
                  is_answer
                  created_at      timestamp DEFAULT current_timestamp,
                  updated_at      timestamp DEFAULT current_timestamp,
                  is_deleted      boolean)
               """
    def get_question_votes_tb_req():
        return """
                CREATE TABLE IF NOT EXISTS question_votes
                (id           varchar(12) PRIMARY KEY,
                 user_id      varchar(12) REFERENCES users (id),
                 question_id  varchar(12) REFERENCES questions (id),
                 vote_type    vote_options_type,
                 created_at   timestamp DEFAULT current_timestamp,
                 updated_at   timestamp DEFAULT current_timestamp)
               """
    def get_comment_votes_tb_req():
      return """
                CREATE TABLE IF NOT EXISTS comment_votes
                (id           varchar(12) PRIMARY KEY,
                 user_id      varchar(12) REFERENCES users (id),
                 comment_id   varchar(12) REFERENCES comments (id),
                 question_id  varchar(12) REFERENCES questions (id),
                 vote_type    vote_options_type,
                 created_at   timestamp DEFAULT current_timestamp,
                 updated_at   timestamp DEFAULT current_timestamp)
               """

    # tables = [
    #   {'table_name': 'users',
    #    'columns': ['id', 'user_name', 'full_name', 'email', 'salt_password', 'photo_link', 'summary'],
    #    'pkeys': ['id'],
    #    'hard_coded_rows':  hcsd.users_rows,
    #    },
    #   {'table_name': 'questions',
    #    'columns': ['id', 'author_id', 'title', 'description', 'tags', 'response_count', 'meta_count', 'up_vote', 'down_vote'],
    #    'pkeys': ['id'],
    #    'hard_coded_rows': hcsd.question_rows
    #    },


    #   {'table_name': 'comments',
    #    'columns': ['id','content','type','author_id','author_name', 'question_id','parent_id','created_at','up_vote','down_vote'],
    #    'pkeys': ['id'],
    #    'hard_coded_rows': hcsd.comment_rows
    #    },
    #   {'table_name': 'votes',
    #    'columns': [
    #             'id',           
    #             'user_id',      
    #             'action',       
    #             'subject_id',   
    #             'subject_type'], 
    #    'pkeys': ['id'],
    #    'hard_coded_rows': hcsd.vote_rows
    #    },
    # ]
    # Define tables
    enum_map = {
        'comment_type'         : {'response', 'meta'},
        'vote_options_type'    : {'up_vote', 'down_vote'},
        'allowed_subject_types': {'comments', 'questions'}
    }
    ppu.build_enum_types(conn, enum_map)
    for req in [get_user_tb_req(), get_question_tb_req(), get_comment_tb_req(), get_question_votes_tb_req(), get_comment_votes_tb_req(), get_tags_tb_req()]:
        cur.execute(req)
    conn.commit()
    create_updated_at_trigger_function(conn)
    create_multi_word_like_sum_function(conn)

    # build temp tables for upsert
    tables = []
    for tb_control in tables:
        tb = tb_control['table_name']
        # cur.execute("CREATE TEMP TABLE temp_%s AS SELECT * FROM %s WHERE False" % (tb,tb))
        # ppu.bulk_insert(cur=cur,
        #                 table_name=f'temp_{tb}',
        #                 columns=tb_control['columns'],
        #                 rows=[[row.get(c) for c in tb_control['columns']]
        #                        for row in tb_control['hard_coded_rows']])
        # ppu.pkey_upsert(cur=cur,
        #                 perm_table=tb,
        #                 temp_table=f'temp_{tb}',
        #                 pkeys=tb_control['pkeys'],
        #                 all_cols=tb_control['columns'])
        # add updated_at trigger
        updated_at_trigger_req = f"""
          CREATE TRIGGER update_at_{tb} BEFORE UPDATE ON {tb} FOR EACH ROW EXECUTE PROCEDURE  update_at_trigger();
        """
        cur.execute(updated_at_trigger_req)
        conn.commit()
        


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

def recompute_tag_counts(cur, conn):
    cur.execute("DROP TABLE IF EXISTS tag_cnt_temp;")
    cur.execute(""" CREATE TEMP TABLE tag_cnt_temp AS (
      SELECT tag AS tag, COUNT(1) as cnt
      FROM (SELECT UNNEST(tags) as tag FROM questions) AS t
      GROUP BY tag)          
       """)
    cur.execute("""
      UPDATE tags 
      SET count = temp.cnt
      FROM tag_cnt_temp as temp
      WHERE tags.id = temp.tag
      """)    
    conn.commit()


def recompute_counts(cur, conn):

    cur.execute("SELECT id FROM questions")
    all_q_ids = set(qid for (qid,) in cur)
    all_tups = {}
    for q in all_q_ids:
        all_tups[(q, 'meta')] = 0
        all_tups[(q, 'response')] = 0

    cur.execute(""" SELECT question_id, type, SUM(1)
                    FROM comments 
                    GROUP BY question_id, type """)
    cnts = cur.fetchall()

    for q, t, cnt in cnts:
        all_tups[(q,t)] = cnt

    rows = [(q,t,c) for (q,t), c in all_tups.items()]
    ps([r for r in rows if r[2] > 0])

    cur.execute("DROP TABLE IF EXISTS temp_cnt;")
    cur.execute("CREATE TEMP TABLE temp_cnt (qid varchar, type varchar, cnt int) ")
    ppu.bulk_insert(cur=cur,
                    table_name='temp_cnt',
                    columns=['qid', 'type', 'cnt'],
                    rows=rows)
    cur.execute(""" 
      UPDATE questions
      SET response_count = cnt
      FROM temp_cnt
      WHERE questions.id = temp_cnt.qid
        AND temp_cnt.type = 'response';
      UPDATE questions
      SET meta_count = cnt
      FROM temp_cnt
      WHERE questions.id = temp_cnt.qid 
        AND temp_cnt.type = 'meta'
      """)
    conn.commit()
    cur.execute("DROP TABLE   temp_cnt;")

def recompute_question_last_comments(conn):
    cur.execute("CREATE TEMP TABLE temp_last_coms (qid varchar, last_c_id varchar, last_c_time timestamp) ")
    cur.execute("INSERT INTO temp_last_coms(qid) SELECT id FROM questions")
    cur.execute(""" UPDATE temp_last_coms
                    SET last_c_time = B.mtime
                    FROM (SELECT question_id, MAX(created_at) as mtime
                           FROM comments 
                           GROUP BY question_id) AS B
                    WHERE temp_last_coms.qid = B.question_id
                """)
    cur.execute(""" UPDATE temp_last_coms
                    SET last_c_id = id
                    FROM comments
                    WHERE temp_last_coms.qid = comments.question_id
                      AND comments.created_at = temp_last_coms.last_c_time
                """)
    cur.execute("SELECT * FROM temp_last_coms")
    rr=cur.fetchall()
    ps(rr)
    cur.execute(""" UPDATE questions
                    SET last_commented_at = temp_last_coms.last_c_time,
                        last_comment_id   = temp_last_coms.last_c_id
                    FROM temp_last_coms
                    WHERE questions.id =  temp_last_coms.qid  """)
    conn.commit()




def temp_map_to_tags(cur, conn):
    tb_tags = {
      'design': 'design', 
      'motivation': 'personal motivation', 
      'Team Coordination': 'team process', 
      'misc': 'fun', 
      'Misc': 'fun', 
      'Personal Motivations': 'personal motivation', 
      'management': 'management', 
      'coordination': 'technical', 
      'fit': False, 
      'SWE - Team Process': 'team process', 
      'Misc - Technical': 'software engineering', 
      'devops': 'devops', 
      'technical': 'software engineering', 
      'fun': 'fun', 
      'SWE - Technical': 'software engineering'
    }
    cur.execute(" SELECT id, tags, title FROM questions ")
    temp = []
    for qid, tags, title in cur: 
        if not tags:
          continue

        new_tags = set(tb_tags[t] for t in tags if tb_tags[t])
        print(qid)
        print(new_tags)
        print(tags)
        print('')
    #       for nt in tb_tags.get(t, []):
    #         all_t.add(nt)
        temp.append((qid, list(new_tags)))
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

def create_updated_at_trigger_function(conn):
  req = """
    CREATE OR REPLACE FUNCTION update_at_trigger() 
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW; 
    END;
    $$ language 'plpgsql';
    """
  cur = conn.cursor()
  cur.execute(req)
  conn.commit()

def create_multi_word_like_sum_function(conn):
    req = """
    CREATE OR REPLACE FUNCTION like_count(
      varchar_col varchar,
      words varchar array
    ) 
    RETURNS NUMERIC AS $$
    DECLARE
        num_words INTEGER := array_length(words, 1);
        match_cnt INTEGER := 0 ; 
    BEGIN   
        FOR counter IN 1..num_words LOOP
            IF (position(words[counter] in varchar_col) > 0) THEN
               match_cnt := match_cnt + 1;
            END IF;
        END LOOP ; 
        RETURN match_cnt; 
    END;
    $$ language 'plpgsql';
    """
    cur = conn.cursor()
    cur.execute(req)
    conn.commit()

def populate_tags(conn):
  ppu.bulk_insert(conn.cursor(), "tags", ["id", "display_name"], tags.tags)
  conn.commit()


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


def save_tables():
    conn = ppu.conn_retry(ppu.get_sql_db(env='dev'))
    cur = conn.cursor() 
    cur.execute(""" 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema='public'
      """)
    tbs = [t for t, in cur]
    now = str(dt.utcnow())[:10].replace('-', '_')
    schema = f'snapshot_{now}'
    cur.execute(f"CREATE SCHEMA {schema}")
    for t in tbs:
        print(f"{schema}.{t}")
        cur.execute(f"CREATE TABLE {schema}.{t} AS (SELECT * FROM {t})")
    conn.commit()


if __name__ == '__main__':
    ##build_and_populate_tables('dev')
    conn = ppu.conn_retry(ppu.get_sql_db(env='dev'))
    cur = conn.cursor()
    py_interact(locals())












