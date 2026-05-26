CREATE TABLE cyber_gift_proofs
(
    address TEXT NOT NULL,
    amount BIGINT NOT NULL,
    proof VARCHAR[] NOT NULL,
    details JSONB[] NOT NULL
);

CREATE INDEX cyber_gift_proofs_index ON cyber_gift_proofs (address);