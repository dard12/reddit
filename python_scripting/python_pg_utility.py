
import psycopg2 as pg
from numbers import Number
import traceback
from datetime import datetime
from environs import Env
import getpass
import time
import sys
import os
import io

POSTGRES_COPY_COL_DELIMITER = chr(127)
POSTGRES_COPY_NULL_AS = r'\N'

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

    elif env == 'dev':
        env = Env()
        env_path = os.path.realpath('..') + '/envs/dev.env'
        env.read_env(env_path)  
        name = env("PG_DB_NAME")  
        pw = env('PG_USER_PASSWORD')
        user = env('PG_USER')
        host = env('PG_HOST')
        sql_db = PostgresDB(name     =name,
                            user     =user,
                            password =pw,
                            host     =host,
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



def print_sql_rows(rows, max_col_size=30, seperate=None, atleast=None,
                   print_row_num=True):
    """ prints rows excellified """
    if not rows:
        return

    if len({len(row) for row in rows}) > 1:
        padded_rows = []
        maxi = max(len(r) for r in rows)
        for row in rows:
            if len(row) < maxi:
                new_row = row + ['' for _ in range(maxi - len(row))]
                padded_rows.append(new_row)
            else:
                padded_rows.append(row)
        rows = padded_rows

    if seperate is not None:
        new_rows = []
        rows.sort(key=lambda x: x[seperate])
        last = None
        for row in rows:
            if row[seperate] != last:
                new_rows.append(['' for _ in range(len(rows[0]))])
                last = row[seperate]
            new_rows.append(row)
        rows = new_rows

    maxies = [0 for _ in range(len(rows[0]))]
    for row in rows:
        for i, elem in enumerate(row):
            maxies[i] = max(maxies[i], len(str(elem)))

    s = ''
    buff_up = 0
    for m in maxies:
        if atleast:
            buff_up = max(min(max_col_size, m), atleast)
        s += ' %' + str(max(min(m, max_col_size), buff_up)) + 's |'

    if print_row_num:
        s = '%4s |' + s
    for idx, row in enumerate(rows):

        trimed = []
        for ind, elem in enumerate(row):
            cut_off = min(maxies[ind], max_col_size)
            padded_elem = str(elem)[:cut_off]

            if len(padded_elem) < cut_off:
                padded_elem += ' ' * (cut_off - len(padded_elem))
            trimed.append(padded_elem)

        if print_row_num:
            trimed = tuple([idx] + list(trimed))
        print(s % trimed)

def print_order_sql_rows(rows, cols_to_sort=[0], siz=45, sort_lambda=None):
    if not isinstance(cols_to_sort, list):
        cols_to_sort = [cols_to_sort]
    for i in range(len(cols_to_sort)):
        idx = cols_to_sort[-(i + 1)]
        typ_cnt = {type(r[idx]): 0 for r in rows}
        for r in rows:
            typ_cnt[type(r[idx])] += 1
        maj_type = sorted([(t,c) for t,c in typ_cnt.items()], key=lambda x:-x[1])[0][0]
        swap = {int: -1,
                float: -1,
                str: '',
                bool: False,
                list: [],
                datetime: datetime(1970, 1,1)}[maj_type]
        for r_idx, r in enumerate(rows):
            if type(r[idx]) != maj_type:
                r_l = list(r)
                r_l[idx] = swap
                rows[r_idx] = tuple(r_l)
        rows.sort(key=lambda x:x[idx])
    if sort_lambda:
        rows.sort(key=sort_lambda)
    print_sql_rows(rows, siz)



def build_enum_types(conn, enum_map):
    """ TO safely add 'enum types', i.e. value constriants on a column. i.e.
        gender columns must be one of ['male', 'female'] 
    """
    cur = conn.cursor()
    cur.execute(""" 
        SELECT pg_type.typname AS enumtype, 
               pg_enum.enumlabel AS enumlabel
        FROM pg_type 
        JOIN pg_enum 
          ON pg_enum.enumtypid = pg_type.oid;""")
    res = list(cur)
    exis_enum_map = {}
    for type_name, value in res:
        exis_enum_map.setdefault(type_name, set())
        exis_enum_map[type_name].add(value)

    to_build = {}
    for type_name, values in enum_map.items():
        if type_name in exis_enum_map:
            assert values == exis_enum_map[type_name], f"delete {type_name}, re-run build_enum_types"
        else:
            to_build[type_name] = values
    for type_name, vals in to_build.items(): 
        str_vals = ','.join("'%s'" % v for v in vals)
        cur.execute(f"CREATE TYPE {type_name} AS ENUM ({str_vals});")
    conn.commit()

