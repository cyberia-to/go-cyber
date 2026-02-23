CREATE TABLE investmints
(
    id                  SERIAL PRIMARY KEY,
    neuron              TEXT                        NOT NULL REFERENCES account (address),
    amount              COIN                        NOT NULL,
    resource            TEXT                        NOT NULL,
    length              BIGINT                      NOT NULL,
    timestamp           TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    height              BIGINT                      NOT NULL REFERENCES block (height),
    transaction_hash    TEXT                        NOT NULL
);