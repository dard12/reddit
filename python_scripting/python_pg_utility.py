
import psycopg2 as pg
from numbers import Number
import traceback
from datetime import datetime
import getpass
import time
import sys
import os
import io

POSTGRES_COPY_COL_DELIMITER = chr(127)
POSTGRES_COPY_NULL_AS = r'\N'

# abstract this into some standard environ variable handling
PROD_ARGS = {
    'name': 'postgres',
    'user': 'postgres',
    'password': '',
    'host': 'minidb.cpoebeflfeyk.us-east-1.rds.amazonaws.com'
}

class PostgresDB(object):
    def __init__(self, name=None, user=None, password=None, host=None,
                 port=None, droppable=False, ssl=True):
        self.name = name
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.droppable = droppable

        if ssl and ssl is not True:
            assert ssl in ['disable', 'allow', 'prefer', 'require', 'verify-ca',
                           'verify-full']
            self.sslmode = ssl

        elif ssl is True:
            self.sslmode = 'require'
        else:
            self.sslmode = 'disable'

    def connection(self):
        return pg.connect(database=self.name,
                          user=self.user,
                          password=self.password,
                          host=self.host,
                          port=self.port,
                          sslmode=self.sslmode)

def get_sql_db(env):
    """ Gets the sql db object.
    Returns:
        DatabaseConfig Object
    """
    if env == 'test':
        sql_db = PostgresDB(name     =getpass.getuser(),
                            user     =getpass.getuser(),
                            password ='',
                            host     ='localhost',
                            port     =5432,
                            droppable=True,
                            ssl=False)

    elif env == 'production':
        sql_db = PostgresDB(name     =PROD_ARGS['name'],
                            user     =PROD_ARGS['user'],
                            password =PROD_ARGS['password'],
                            host     =PROD_ARGS['host'],
                            port     =5432,
                            droppable=False)
    else:
        raise Exception('Wrong env variables passed in dbc')

    return sql_db




################################################################################
#                                                                              #
#                              MISC HELPERS                                    #
#                                                                              #
################################################################################
def conn_retry(database, seconds=30):
    """ Safely tries connecting to the database, and if we fail, retries until
        15 seconds has elapsed. Then either returns the connection if one is
        attained, or raises an error if not
    Args:
        database: DatabaseConfig object we wish to connect to
        seconds: defaults to 30, but number of seconds we'll try to connect for
    Returns:
        psycopg2 Connection instance, or raises an error
    """
    now = time.time()
    while time.time() < (now + seconds):
        try:
            conn = database.connection()
            return conn
        except:
            print(traceback.format_exc())
            time.sleep(2)

    db_type = type(database).__name__

    raise Exception("Unable to connect to " + db_type + " database: " +
                    str(database.name))

def kill_all_connections(database):
    """
        If you want to kill all connection on this database, call this command
        ARGS:
            database: DatabaseConfig object that we can connect to
        RETURNS: None
    """
    if not database.droppable:
        raise Exception("Can't kill connections on this db")

    conn = conn_retry(database)
    cur = conn.cursor()

    kill_req = ("""
        SELECT pg_terminate_backend(pg_stat_activity.pid) as pid
        FROM pg_stat_activity
        WHERE pid <> pg_backend_pid()
    """)

    cur.execute(kill_req)
    conn.commit()
    conn.close()


def drop_everything(database):
    """ When we want to reset everything, we can call this command
    Args:
        database: DatabaseConfig object that we can connect to
    Returns: None, but drops all tables, functions, views in public schema
    """
    if not database.droppable:
        raise Exception("Can't drop this table")
    conn = conn_retry(database)
    cur = conn.cursor()
    cur.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
    conn.commit()
    cur.close()
    conn.close()


def bulk_insert(cur, table_name, columns, rows):
    """ Inserts a large amount of rows into table
    Args:
        conn: open psycopg2 connection into database we are inserting into
        table_name: string name of the table we're inserting into
        columns: String[], list of columns we insert into
        rows: tuple[], list of rows we insert, each row must match column order
    Returns:
        None, but uploads rows into the given table
    """
    sio = io.StringIO()
    for row in rows:
        assert len(row) == len(columns)
        sio.write(make_copyable(row=row,
                                delimiter=POSTGRES_COPY_COL_DELIMITER,
                                null_as=POSTGRES_COPY_NULL_AS) + '\n')
    sio.seek(0)
    cur.copy_from(file=sio,
                  table=table_name,
                  sep=POSTGRES_COPY_COL_DELIMITER,
                  columns=columns)

def sanitize(element):
    """ Cleans up some strings so we delimit properly """
    return element.replace(r'\N', '\\N')\
                  .replace('\n', '\\n')\
                  .replace(POSTGRES_COPY_COL_DELIMITER, '\\'+POSTGRES_COPY_COL_DELIMITER)

def make_copyable(row, delimiter, null_as):
    """ Makes a row into a tab separated string that can be inserted correctly
        into a table using copy_from
        NOTE: This works for data types:
              varchar, int, real, timestamptz, boolean, NULL

    Args:
    row: list of elements that compose a row that we want to insert into a
         sql table
    delimiter: the string used to delimit columns
    Returns: '\t' separated string that we can copy_from insert

    """
    new_row = []
    for element in row:

        if element is None:
            new_row.append(null_as) # default NULL character

        elif isinstance(element, (Number)):
            new_row.append(sanitize(str(element)))

        elif isinstance(element, str):
            new_row.append(sanitize(str(element)))

        elif isinstance(element, bytes):
            new_row.append(sanitize(str(element, 'utf-8')))

        elif isinstance(element, datetime):
            new_row.append(sanitize(str(element)))

        elif isinstance(element, bool):
            new_row.append(str(element).lower())

        elif isinstance(element, list):
            new_row.append('{' + ', '.join('"' + str(i) + '"' for i in element) + '}')

        ########################################################################
        #                        UNSUPPORTED TYPES                             #
        elif isinstance(element, dict):
            print(element, row)
            raise Exception("NO LONGER SUPPORTING THIS DATA TYPE")
        ########################################################################

        else:
            raise Exception("INVALID TYPE")
    return delimiter.join(new_row)



def pkey_upsert(cur, perm_table, temp_table, pkeys, all_cols):
    """ Little helper does a standard pkey upsert, then insert
        Doesnt commit

    """
    non_pkey_cols = [_ for _ in all_cols if _ not in pkeys]

    pkey_eq = ' AND '.join('%s.%s = TEMP.%s' % (perm_table, k, k) for k in pkeys)

    non_pkey_setter = ','.join('%s = TEMP.%s' % (c, c) for c in all_cols if c not in pkeys)


    step_1_q = (""" UPDATE %s
                    SET %s
                    FROM %s TEMP
                    WHERE (%s)
                """ % (perm_table,
                       non_pkey_setter,
                       temp_table,
                       pkey_eq))

    cur.execute(step_1_q)



    step_2_q = (""" INSERT INTO %s (%s)
                    SELECT %s
                    FROM %s TEMP
                    WHERE NOT EXISTS (SELECT 1
                                      FROM %s
                                      WHERE %s)
                """  % (perm_table,
                        ', '.join(all_cols),
                        ', '.join(all_cols),
                        temp_table,
                        perm_table,
                        pkey_eq))

    cur.execute(step_2_q)
