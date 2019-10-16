
import python_pg_utility as ppu
import inspect
from datetime import datetime as dt
from datetime import timedelta as td
import code
import os

users_rows = [
  {'id': 0,
   'user_name':' lihsing-lung',
   'full_name': 'Li-Hsing Lung',
   'photo_link':       'https://media.licdn.com/dms/image/C4E03AQFZuKnltRJvLw/profile-displayphoto-shrink_200_200/0?e=1575504000&v=beta&t=emev1QeLoHJMtRaJAijqS1VKIhcBC0QlUptC0Ks6psM',
   'summary': '''Hey, my name is Li-Hsing Lung. I love building products and doing impactful work.

      Below are some of my views on team culture and how I've found myself to be most productive on a team. I hope we're a good match for working together!'''
   },
   {'id': 1,
    'user_name': 'michael-duplessis',
    'full_name': 'Michael Duplessis',
    'photo_link': 'https://lh3.googleusercontent.com/a-/AAuE7mCLZpb1dbmKdKDOmoto2-05ezGG7i4pNnO3p4M=s384-cc',
    'summary': ''},
  {'id': 2,
   'user_name': 'tito-mbagwu',
   'full_name': 'Tito Mbagwu',
   'photo_link': '',
   'summary': ''},
  {'id': 3,
   'user_name': 'CoverStory',
   'full_name': 'CoverStory',
   'photo_link': '',
   'summary': ''},
]

comment_rows  = [ 
    {'id'         : 0,  
     'question_id': 0,
     'content'    : 'comments are fucing dumb, read teh codez',    
     'type'       : 'meta',
     'author_id'  : 0,
     'parent_id'  : 0,   
     'created_at' : dt.utcnow(), 
     'up_vote'    : 69,     
     'down_vote'  : 1},
         { 'id'         : 1,  
          'question_id': 0,
          'content'    : 'is all decurem lost in this world???',    
          'type'       : 'meta',
          'author_id'  : 1,
          'parent_id'  : 0,   
          'created_at' : dt.utcnow() + td(seconds=500),
          'up_vote'    : 2,    
          'down_vote'  : 800},
             { 'id'         : 2,  
              'question_id': 0,
              'content'    : 'bitch stfu, get rich or dy tryin',    
              'type'       : 'meta',
              'author_id'  : 2,
              'parent_id'  : 1,   
              'created_at' : dt.utcnow() + td(seconds=600),
              'up_vote'    : 0 ,   
              'down_vote'  : 1},
   {'id'         : 3,  
     'question_id': 0,
     'content'    : 'i luv comments, but they dont luv me. anyone know any hot singles in the area?',    
     'type'       : 'meta',
     'author_id'  : 2,
     'parent_id'  : 3,   
     'created_at' : dt.utcnow()+td(seconds=100), 
     'up_vote'    : 2 ,    
     'down_vote'  : 50},
]

question_rows = [
 {'id': 0,
  'title': 'What is your preferred method of documenting code?',
  'description': '',
  'tags': ['coordination'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 20,
  'down_vote': 4
 },
 {'id': 1,
  'title': 'How often do you read about new technologies and paradigms?',
  'description': 'What are some specific technologies you’ve read about and how production-ready do you think they are?',
  'tags': ['technical'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 69,
  'down_vote': 420,
 },
 {'id': 2,
  'title': 'How do you like to handle technical debt?',
  'description': 'How do you keep yourself productive?',
  'tags': ['technical'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 0,
  'down_vote': 1
 },
 {'id': 3,
  'title': 'What is your favorite programming language?',
  'description': 'Pick your favorite language, explain why you love it!',
  'tags': ['technical'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 10,
  'down_vote': 4
 },
 {'id': 4,
  'title': 'How important is consistent code style to you?',
  'description': 'Would you invest in linting tools? Would you block code merges because of style issues?',
  'tags': ['coordination'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 90,
  'down_vote': 5
 },
 {'id': 5,
  'title': "Take some time to read up on Kotlin's built in nullabilty operators, !! and ?.",
  'description': 'When should you use !! and ?. Give some interesting edge cases',
  'tags': ['technical'],
  'response_count': 0,
  'meta_count': 0, 
  'up_vote': 30,
  'down_vote': 2
 },
]

def build_and_populate_tables(env='test'):
    conn = ppu.conn_retry(ppu.get_sql_db(env))
    cur = conn.cursor()


    def get_user_tb_req():
        return """
            CREATE TABLE IF NOT EXISTS users
              (id         int PRIMARY KEY,
               user_name  varchar UNIQUE,
               full_name  varchar,
               photo_link varchar,
               summary    varchar,
               is_deleted boolean
               )
            """
  
    def get_question_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS questions
                 (id              int PRIMARY KEY,
                  title           varchar,
                  description     varchar,
                  tags            varchar Array,
                  response_count  int,
                  meta_count      int,
                  up_vote         int,
                  down_vote       int,
                  is_deleted      boolean)
               """
    def get_comment_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS comments
                 (id              int PRIMARY KEY,
                  content         varchar,
                  type            comment_type,
                  author_id       int REFERENCES users (id),
                  question_id     int REFERENCES questions (id),
                  parent_id       int REFERENCES comments (id),
                  created_at      timestamp,
                  up_vote         int,
                  down_vote       int,
                  is_deleted      boolean)
               """
    def get_user_activity_tb_req():
        return """ 
                CREATE TABLE IF NOT EXISTS user_activity
                (id           int PRIMARY KEY,
                 user_id      int REFERENCES users (id),
                 action       user_action_type,
                 subject_id   int,  
                 subject_type allowed_subject_types,
                )
               """

    tables = [
      {'table_name': 'questions',
       'columns': ['id', 'title', 'description', 'tags', 'response_count', 'meta_count', 'up_vote', 'down_vote'],
       'pkeys': ['id'],
       'hard_coded_rows': question_rows
       },

      {'table_name': 'users',
       'columns': ['id', 'user_name', 'full_name', 'photo_link', 'summary'],
       'pkeys': ['id'],
       'hard_coded_rows':  users_rows,
       },
      {'table_name': 'comments',
       'columns': ['id','content','type','author_id','question_id','parent_id','created_at','up_vote','down_vote'],
       'pkeys': ['id'],
       'hard_coded_rows': comment_rows
       },
    ]

    # Define tables
    enum_map = {
        'comment_type'         : {'response', 'meta'},
        'user_action_type'     : {'up_vote', 'down_vote', 'flag'},
        'allowed_subject_types': {'comments', 'questions'}
    }
    ppu.build_enum_types(conn, enum_map)
    for req in [get_user_tb_req(), get_question_tb_req(), get_comment_tb_req()]:
        cur.execute(req)
    conn.commit()

    # build temp tables for upsert
    for tb_control in tables:
        tb = tb_control['table_name']
        cur.execute("CREATE TEMP TABLE temp_%s AS SELECT * FROM %s WHERE False" % (tb,tb))
        ppu.bulk_insert(cur=cur,
                        table_name=f'temp_{tb}',
                        columns=tb_control['columns'],
                        rows=[[row[c] for c in tb_control['columns']]
                               for row in tb_control['hard_coded_rows']])
        ppu.pkey_upsert(cur=cur,
                        perm_table=tb,
                        temp_table=f'temp_{tb}',
                        pkeys=tb_control['pkeys'],
                        all_cols=tb_control['columns'])
    conn.commit()

    # now do the comment counts
    cur.execute(""" SELECT question_id, type, SUM(1)
                    FROM comments 
                    GROUP BY question_id, type """)
    cnts = cur.fetchall()
    cur.execute("CREATE TEMP TABLE temp_cnt (qid int, type varchar, cnt int) ")
    ppu.bulk_insert(cur=cur,
                    table_name='temp_cnt',
                    columns=['qid', 'type', 'cnt'],
                    rows=cnts)
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
    # build_and_populate_tables('production')
    conn = ppu.conn_retry(ppu.get_sql_db(env='dev'))
    py_interact(locals())














