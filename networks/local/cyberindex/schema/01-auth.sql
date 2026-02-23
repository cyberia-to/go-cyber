CREATE TABLE account
(
    address TEXT NOT NULL PRIMARY KEY
);

/* ---- Moved from bank.sql for vesting account usage ---- */
CREATE TYPE COIN AS
(
    denom  TEXT,
    amount TEXT
);

/* ---- AUTH/ VESTING ACCOUNT ---- */
CREATE TABLE vesting_account
(
    id                  SERIAL                          PRIMARY KEY NOT NULL,
    type                TEXT                            NOT NULL,
    address             TEXT                            NOT NULL REFERENCES account (address),
    original_vesting    COIN[]                          NOT NULL DEFAULT '{}',
    end_time            TIMESTAMP WITHOUT TIME ZONE     NOT NULL,
    start_time          TIMESTAMP WITHOUT TIME ZONE
);
/* ---- start_time can be empty on DelayedVestingAccount ---- */

CREATE UNIQUE INDEX vesting_account_address_idx ON vesting_account (address);


CREATE TABLE vesting_period
(
    vesting_account_id  BIGINT  NOT NULL REFERENCES vesting_account (id),
    period_order        BIGINT  NOT NULL,
    length              BIGINT  NOT NULL,
    amount              COIN[]  NOT NULL DEFAULT '{}'
);