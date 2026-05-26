# cyberindex

Index for Cyber's networks

Supported:
1. blocks and precommits
2. transactions and messages
3. validators and their uptime
4. accounts and their balances
5. cyberlinks and particles
6. resources and supply
7. grid routes
8. wasm contracts
9. advanced views for analytics

cyberindex run selected indexers from BDJuno, see schemas and registrar.go

Run:
```
cyberindex start
```

Example configuration in sample_config.yaml
```
cp sample_config.yaml ~/.cyberindex/config.yaml
``` 

To run in Docker fill `.env`, then:

```
make docker
```

Thanks for supporting Cosmos's ecosystem development:
- Fission Labs [Juno](https://github.com/fissionlabsio/juno),
- Desmos Labs [Juno](https://github.com/desmos-labs/juno) 
- Forbole [BDJuno](https://github.com/forbole/bdjuno) 
- Juno Community [Wasmx](https://github.com/disperze/wasmx)

## Analytics views

If you want to add analytics views to you index:

Download genesis account states:

```bash
wget -O database/schema/genesis.csv https://gateway.ipfs.cybernode.ai/ipfs/QmWxvLnFZDJUrjTjNDt4BfanzncdbzTMfSQmkNAACQ8ZaF
```

Initiate the additional views and tables:

```bash
source .env && \
docker exec -ti cyberindex_postgres psql -f /root/schema/views.sql -d $POSTGRES_DB_NAME -U $POSTGRES_USER_NAME
```

Copy genesis and cyber_gift from csv to table:

```bash
docker exec -ti cyberindex_postgres psql -c "\copy genesis FROM /root/schema/genesis.csv with csv HEADER" -d $POSTGRES_DB_NAME -U $POSTGRES_USER_NAME
```

Add cronjob to refresh tables for stats:

```bash
    croncmd="docker exec -t cyberindex_postgres psql -c \"REFRESH MATERIALIZED VIEW CONCURRENTLY txs_ranked\" -d $POSTGRES_DB_NAME -U $POSTGRES_USER_NAME"
    cronjob="*/5 * * * * $croncmd"
    ( crontab -l | grep -v -F "$croncmd" ; echo "$cronjob" ) | crontab -
```

## Cybergift table with proofs

If you want to add cybergift table with proofs:

Download cybergift with proofs file:

```bash
wget -O database/schema/cyber_gift_proofs.csv https://gateway.ipfs.cybernode.ai/ipfs/QmVvMuFN3EmMdowYuhBnLcZZLtbGDtF4a7fZFiNK627gPZ
```

Initiate the `cyber_gift_proofs` table:

```bash
docker exec -ti cyberindex_postgres psql -f /root/schema/cyber_gift.sql -d $POSTGRES_DB_NAME -U $POSTGRES_USER_NAME
```

Go to `./database/schema/` folder.

Open `gift_db.py` file and fill global variables according to your set up

Install `requirenments.txt`

```bash
pip3 install -r requirenments.txt
```

Run script:

```bash
python3 gift_db.py
````

Wait util progress is 100%, after you may query gift info frop postgres directrly or over GrpahQL.