
import python_pg_utility as ppu
import inspect
import code
import os


demo_users_rows = [
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

demo_video_rows = [
  {'id'         : 0,
   'user_id'    : 0,
   'question_id': 0,
   'video_link' : '',
  },
  {'id'         : 1,
   'user_id'    : 0,
   'question_id': 1,
   'video_link' : 'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/interview-new-tech.mp4',
  },
  {'id'         : 2,
   'user_id'    : 0,
   'question_id': 2,
   'video_link' : 'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/interview-productivity.mp4',
  },
  {'id'         : 3,
   'user_id'    : 0,
   'question_id': 0,
   'video_link' : 'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/ricky/commenting_code.mp4',
  },
  {'id'         : 4,
   'user_id'    : 2,
   'question_id': 3,
   'video_link' : 'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/fav_programming_lang.mp4',
  },
  {'id'         : 5,
   'user_id'    : 2,
   'question_id': 4,
   'video_link' : 'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/linting.mp4',
   },
  {'id'         : 6,
   'user_id'    : 2,
   'question_id': 5,
   'video_link' :  'https://coverstory-videos.s3.us-east-2.amazonaws.com/candidate/tito/kotlin_nullability.mp4',

   }

]

demo_question_rows = [
 {'id': 0,
  'title': 'What is your preferred method of documenting code?',
  'description': '',
  'tags': ['coordination'],
 },
 {'id': 1,
  'title': 'How often do you read about new technologies and paradigms?',
  'description': 'What are some specific technologies you’ve read about and how production-ready do you think they are?',
  'tags': ['technical'],
 },
 {'id': 2,
  'title': 'How do you like to handle technical debt?',
  'description': 'How do you keep yourself productive?',
  'tags': ['technical'],
 },
 {'id': 3,
  'title': 'What is your favorite programming language?',
  'description': 'Pick your favorite language, explain why you love it!',
  'tags': ['technical'],
 },
 {'id': 4,
  'title': 'How important is consistent code style to you?',
  'description': 'Would you invest in linting tools? Would you block code merges because of style issues?',
  'tags': ['coordination'],
 },
 {'id': 5,
  'title': "Take some time to read up on Kotlin's built in nullabilty operators, !! and ?.",
  'description': 'When should you use !! and ?. Give some interesting edge cases',
  'tags': ['technical'],
 },
]

def build_and_populate_tables(env='test'):
    conn = ppu.conn_retry(ppu.get_sql_db(env))
    cur = conn.cursor()

    def get_user_tb_req():
        return """
            CREATE TABLE IF NOT EXISTS user_profiles
              (id         int PRIMARY KEY,
               user_name  varchar UNIQUE,
               full_name  varchar,
               photo_link varchar,
               summary    varchar)
            """

    def get_video_tb_req():
        return """ CREATE TABLE IF NOT EXISTS videos
                 (id            int PRIMARY KEY,
                  user_id       int REFERENCES user_profiles (id),
                  question_id   int REFERENCES question_bank (id),
                  video_link    varchar)
               """

    def get_question_tb_req():
        return """
               CREATE TABLE IF NOT EXISTS question_bank
                 (id          int PRIMARY KEY,
                  title       varchar,
                  description varchar,
                  tags        varchar Array)
               """
    tables = [
      {'table_name': 'question_bank',
       'columns': ['id', 'title', 'description', 'tags'],
       'pkeys': ['id'],
       'hard_coded_rows': demo_question_rows
       },

      {'table_name': 'user_profiles',
       'columns': ['id', 'user_name', 'photo_link', 'summary'],
       'pkeys': ['id'],
       'hard_coded_rows':  demo_users_rows,
       },

      {'table_name': 'videos',
       'columns': ['id', 'user_id',  'question_id', 'video_link'],
       'pkeys': ['id'],
       'hard_coded_rows': demo_video_rows
       },
    ]

    # Define tables
    for req in [get_question_tb_req(), get_user_tb_req(), get_video_tb_req()]:
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

if __name__ == '__main__':
    #build_and_populate_tables('test')
    conn = ppu.conn_retry(ppu.get_sql_db(env='production'))
    py_interact(locals())














