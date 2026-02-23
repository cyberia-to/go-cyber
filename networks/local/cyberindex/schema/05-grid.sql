CREATE TABLE routes
(
    id                  SERIAL PRIMARY KEY,
    source              TEXT                        NOT NULL REFERENCES account (address),
    destination         TEXT                        NOT NULL REFERENCES account (address),
    alias               VARCHAR(64)                 NOT NULL,
    value               COIN[]                      NOT NULL DEFAULT '{}',
    timestamp           TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    height              BIGINT                      NOT NULL REFERENCES block (height),
    transaction_hash    TEXT                        NOT NULL
);