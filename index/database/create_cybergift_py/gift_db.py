import pandas as pd
import ast
import sqlalchemy
from sqlalchemy import create_engine

from tqdm import tqdm


POSTGRES_USER = 'cyber'
POSTGRESS_PASSWORD = ''
POSTGRES_PORT = 5432
POSTGRES_DB_NAME = 'cyberindex'



def chunker(seq, size):
    return (seq[pos:pos + size] for pos in range(0, len(seq), size))


def insert_with_progress(df):
    engine = create_engine(f'postgresql://{POSTGRES_USER}:{POSTGRESS_PASSWORD}@localhost:{POSTGRES_PORT}/{POSTGRES_DB_NAME}')
    chunksize = int(len(df) / 500)
    with tqdm(total=len(df)) as pbar:
        for i, cdf in enumerate(chunker(df, chunksize)):
            replace = "replace" if i == 0 else "append"
            cdf.to_sql(name="cyber_gift_proofs", con=engine, if_exists=replace, dtype={'details': sqlalchemy.types.JSON})
            pbar.update(chunksize)
            tqdm._instances.clear()


df = pd.read_csv('./cyber_gift_proofs.csv')
df = df.set_index('address')
insert_with_progress(df)