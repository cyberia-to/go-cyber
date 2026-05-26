CREATE OR REPLACE VIEW _transaction as (
    SELECT *,
    involved_accounts_addresses[1] subject1,
    involved_accounts_addresses[2] subject2
    FROM (
        SELECT *
        FROM transaction
        LEFT JOIN (
            SELECT
                transaction_hash,
                index,
                type,
                value,
                involved_accounts_addresses
            FROM message
        ) as msg ON transaction.hash = msg.transaction_hash
    ) _tx
);

CREATE OR REPLACE VIEW _uptime_temp AS (
    SELECT 
        t.validator_address,
        count(t.validator_address) AS pre_commits
    FROM (
        SELECT 
            temp.validator_address,
            temp.height,
            temp.rank
            FROM ( 
                SELECT 
                    pre_commit.validator_address,
                    pre_commit.height,
                    rank() OVER (PARTITION BY pre_commit.validator_address, pre_commit.height ORDER BY pre_commit.height DESC) AS rank
                FROM pre_commit
            ) temp
            WHERE (
                temp.height >= (SELECT max(block.height) AS max
                   FROM block) - 50000 AND temp.rank = 1)
    ) t
  GROUP BY t.validator_address
);

CREATE OR REPLACE VIEW uptime AS (
    SELECT
        consensus_address,
        consensus_pubkey,
        _uptime_temp.pre_commits,
        cast(_uptime_temp.pre_commits as decimal) / 50000 AS uptime
    FROM
        validator
    LEFT JOIN _uptime_temp ON validator.consensus_address = _uptime_temp.validator_address
);

CREATE TABLE genesis_accounts
(
    id INT NOT NULL,
    address TEXT   NOT NULL PRIMARY KEY,
    balance   BIGINT NOT NULL
);


CREATE MATERIALIZED VIEW txs_ranked AS (
    SELECT 
        DISTINCT ON (rank, neuron) *
    FROM (
        SELECT
        date_trunc('week' , block.timestamp) :: date AS week,
        _temp.height,
        rank() over(PARTITION BY neuron ORDER BY _temp.height) AS rank,
        neuron,
        type
        FROM (
            SELECT
                height,
                neuron,
                type
            FROM (
                SELECT
                    hash,
                    (logs -> 1 -> 'events' -> 0 -> 'attributes' -> 0 ->> 'value') AS neuron,
                    'ibc_receive' :: TEXT AS type
                FROM transaction
                WHERE messages -> 1 ->> '@type' =  '/ibc.core.channel.v1.MsgRecvPacket'
                UNION
                SELECT
                    hash,
                    messages -> 0 ->> 'sender' AS neuron,
                    'ibc_send' :: TEXT AS type
                FROM transaction
                WHERE messages -> 0 ->> '@type' =  '/ibc.applications.transfer.v1.MsgTransfer'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'from_address' AS neuron,
                    'send' AS type
                FROM message
                WHERE type = 'cosmos.bank.v1beta1.MsgSend'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'to_address' AS neuron,
                    'receive' AS type
                FROM message
                WHERE type = 'cosmos.bank.v1beta1.MsgSend'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'delegator_address' AS neuron,
                    type
                FROM message
                WHERE type = 'cosmos.staking.v1beta1.MsgDelegate'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'neuron' AS neuron,
                    type
                FROM message
                WHERE type = 'cyber.graph.v1beta1.MsgCyberlink'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'neuron' AS neuron,
                    type
                FROM message
                WHERE type = 'cyber.resources.v1beta1.MsgInvestmint'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'delegator_address' AS neuron,
                    type
                FROM message
                WHERE type = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
                UNION
                SELECT
                    transaction_hash,
                    value ->> 'swap_requester_address' AS neuron,
                    type
                FROM message
                WHERE type = 'tendermint.liquidity.v1beta1.MsgSwapWithinBatch'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'delegator_address' AS neuron,
                    type
                FROM message
                WHERE type = 'cosmos.staking.v1beta1.MsgBeginRedelegate'
                UNION
                SELECT 
                    transaction_hash,
                    value ->> 'delegator_address' AS neuron,
                    type
                FROM message
                WHERE type = 'cosmos.staking.v1beta1.MsgUndelegate'
            ) temp
            LEFT JOIN transaction on transaction.hash = temp.hash
        ) _temp
        LEFT JOIN block on block.height = _temp.height
        ORDER BY height
    ) t
);

CREATE UNIQUE INDEX txs_ranked_index ON txs_ranked (rank, neuron);

CREATE OR REPLACE VIEW genesis_neurons_activation AS (
    SELECT
        'activated' AS neurons,
        count(*) :: float / 559 * 100 AS count
    FROM genesis_accounts
    WHERE address in (
        SELECT neuron
        FROM txs_ranked
    )
    UNION
    SELECT
        'not_activated' AS neurons,
        100 - count(*) :: float / 559 * 100 AS count
    FROM genesis_accounts
    WHERE address in (
        SELECT neuron
        FROM txs_ranked
    )
);

CREATE OR REPLACE VIEW first_neuron_activation AS (
    SELECT
        week,
        count(*) AS neuron_activation
    FROM (
        SELECT *
        FROM txs_ranked
        WHERE
            rank = 1
    ) t
    GROUP BY week
);

CREATE OR REPLACE VIEW first_hero_hired AS (
    SELECT
        week,
        count(*) AS hero_hired
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'cosmos.staking.v1beta1.MsgDelegate'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW first_investmint AS (
    SELECT
        week,
        count(*) AS investmint
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'cyber.resources.v1beta1.MsgInvestmint'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW first_cyberlink AS (
    SELECT
        week,
        count(*) AS cyberlink
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'cyber.graph.v1beta1.MsgCyberlink'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW first_10_cyberlink AS (
    SELECT
        week,
        count(*) AS cyberlink_10
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM (
                    SELECT rank() OVER(PARTITION BY neuron, type ORDER BY height) AS link_rank, *
                    FROM txs_ranked
                    WHERE type = 'cyber.graph.v1beta1.MsgCyberlink'
                ) ranked_links
                WHERE link_rank = 10
                ORDER BY height
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW first_100_cyberlink AS (
    SELECT
        week,
        count(*) AS cyberlink_100
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM (
                    SELECT rank() OVER(PARTITION BY neuron, type ORDER BY height) AS link_rank, *
                    FROM txs_ranked
                    WHERE type = 'cyber.graph.v1beta1.MsgCyberlink'
                ) ranked_links
                WHERE link_rank = 100
                ORDER BY height
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW first_swap AS (
    SELECT
        week,
        count(*) AS swap
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank = 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'tendermint.liquidity.v1beta1.MsgSwapWithinBatch'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) hero_hired
    GROUP BY week
    ORDER BY week
);

CREATE OR REPLACE VIEW week_undelegation AS (
    SELECT
        week,
        count(*) AS undelegation
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank != 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'cosmos.staking.v1beta1.MsgUndelegate'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) undelegation
    GROUP BY week
    ORDER BY week ASC
);

CREATE OR REPLACE VIEW week_redelegation AS (
    SELECT
        week,
        count(*) AS redelegation
    FROM (
        SELECT DISTINCT ON (neuron, type) *
        FROM (
            SELECT
                t.week,
                t.height,
                t.neuron,
                t.type
            FROM (
                SELECT 
                    txs_ranked.week,
                    txs_ranked.neuron
                FROM txs_ranked
                WHERE rank != 1
            ) _t
            INNER JOIN (
                SELECT *
                FROM txs_ranked
                WHERE type = 'cosmos.staking.v1beta1.MsgBeginRedelegate'
            ) t ON _t.week = t.week AND _t.neuron = t.neuron
            WHERE _t.neuron is not Null
            ORDER BY height
        ) __t
        WHERE type is not Null
    ) redelegation
    GROUP BY week
    ORDER BY week ASC
);

CREATE OR REPLACE VIEW cyb_cohort AS (
    SELECT
        week,
        neuron_activation AS neurons_activated,
        hero_hired :: float / neuron_activation :: float * 100 AS hero_hired_percent,
        COALESCE(investmint, 0) :: float / neuron_activation :: float * 100 AS investmint_percent,
        COALESCE(cyberlink, 0) :: float / neuron_activation :: float * 100 AS cyberlink_percent,
        COALESCE(cyberlink_10, 0) :: float / neuron_activation :: float * 100 AS cyberlink_10_percent,
        COALESCE(cyberlink_100, 0) :: float / neuron_activation :: float * 100 AS cyberlink_100_percent,
        COALESCE(swap, 0) :: float / neuron_activation :: float * 100 AS swap_percent,
        COALESCE(undelegation, 0) :: float / neuron_activation :: float * 100 AS undelegation_percent,
        COALESCE(redelegation, 0) :: float / neuron_activation :: float * 100 AS redelegation_percent
    FROM (
        SELECT
            first_neuron_activation.week,
            first_neuron_activation.neuron_activation,
            first_hero_hired.hero_hired,
            first_investmint.investmint,
            first_cyberlink.cyberlink,
            first_10_cyberlink.cyberlink_10,
            first_100_cyberlink.cyberlink_100,
            first_swap.swap,
            week_undelegation.undelegation,
            week_redelegation.redelegation
        FROM first_neuron_activation
        LEFT JOIN first_hero_hired ON first_neuron_activation.week = first_hero_hired.week
        LEFT JOIN first_investmint ON first_neuron_activation.week = first_investmint.week
        LEFT JOIN first_cyberlink ON first_neuron_activation.week = first_cyberlink.week
        LEFT JOIN first_10_cyberlink ON first_neuron_activation.week = first_10_cyberlink.week
        LEFT JOIN first_100_cyberlink ON first_neuron_activation.week = first_100_cyberlink.week
        LEFT JOIN first_swap ON first_neuron_activation.week = first_swap.week
        LEFT JOIN week_redelegation ON first_neuron_activation.week = week_redelegation.week
        LEFT JOIN week_undelegation ON first_neuron_activation.week = week_undelegation.week
    ) temp
);

CREATE OR REPLACE VIEW top_first_txs AS (
    SELECT
        type,
        count(*)
    FROM (
        SELECT 
            RIGHT(messages -> 0 ->> '@type', -1) AS type,
            rank() over(partition by signer_infos -> 0 -> 'public_key' ->> 'key' order by height)  AS rank
        FROM transaction
        WHERE success = true
    ) top
    WHERE rank = 1
    GROUP BY type
    ORDER BY count(*) DESC
);

CREATE OR REPLACE VIEW top_txs AS (
    SELECT
        type,
        count(*)
    FROM (
        SELECT 
            RIGHT(messages -> 0 ->> '@type', -1) AS type
        FROM transaction
        WHERE success = true
    ) top
    GROUP BY type
    ORDER BY count(*) DESC
);

CREATE OR REPLACE VIEW cyberlinks_stats AS (
    SELECT
        date(day) as date,
        cyberlinks_per_day,
        cyberlinks
    FROM
        generate_series('2021-11-05', now(), INTERVAL '1 day') day
    LEFT JOIN (
        SELECT
            date,
            cyberlinks_per_day,
            sum(cyberlinks_per_day) over(ORDER BY date) AS cyberlinks
        FROM (
            SELECT 
                date(timestamp) AS date,
                count(*) AS cyberlinks_per_day
            FROM cyberlinks
            GROUP BY date(timestamp)
        ) t
        ORDER BY date
    ) _t ON date(day) = _t.date
);

CREATE OR REPLACE VIEW tweets_stats AS (
    SELECT 
        date,
        tweets_per_day,
        sum(tweets_per_day) over(ORDER BY date) AS tweets
    FROM (
        SELECT
            date(day) as date,
            COALESCE(tweets_per_day, 0) as tweets_per_day,
            sum(tweets_per_day) over(ORDER BY date) AS tweets
        FROM
            generate_series('2021-11-05', now(), INTERVAL '1 day') day
        LEFT JOIN (
            SELECT
                date,
                tweets_per_day AS tweets_per_day
            FROM (
                SELECT 
                    date(timestamp) AS date,
                    count(*) AS tweets_per_day
                FROM cyberlinks
                WHERE particle_from = 'QmbdH2WBamyKLPE5zu4mJ9v49qvY8BFfoumoVPMR5V4Rvx'
                GROUP BY date(timestamp)
            ) t
            ORDER BY date
        ) _t ON date(day) = _t.date
    ) _temp
    ORDER BY date
);

CREATE OR REPLACE VIEW today_top_txs AS (
    SELECT
        type,
        count(*)
    FROM (
            SELECT *
            FROM (
                SELECT 
                    date(block.timestamp) AS date,
                    RIGHT(messages -> 0 ->> '@type', -1) AS type,
                    rank() over(partition by signer_infos -> 0 -> 'public_key' ->> 'key' order by transaction.height)  AS rank
                FROM transaction
                LEFT JOIN block on block.height = transaction.height
                WHERE success = true
            ) txs
            WHERE date >= CURRENT_DATE
    ) top
    GROUP BY type
    ORDER BY count(*) DESC
);

CREATE OR REPLACE VIEW neuron_activation_source AS (
    SELECT
        week,
        neuron_activated,
        recieve ::float / neuron_activated * 100 AS recieve_percent,
        ibc_receive ::float / neuron_activated * 100 AS ibc_receive_percent,
        genesis ::float / neuron_activated * 100 AS genesis_percent
    FROM (
        SELECT
            activation.week,
            activation.neuron_activated,
            send.recieve,
            COALESCE(ibc_receive.ibc_recieve, 0) AS ibc_receive,
            COALESCE(genesis.genesis, 0) AS genesis
        FROM (
            SELECT 
                week,
                count(*) AS neuron_activated
            FROM txs_ranked
            WHERE rank = 1
            GROUP BY week
        ) activation
        LEFT JOIN (
            SELECT
                week,
                count(*) AS recieve
            FROM txs_ranked
            WHERE rank = 1 AND type = 'receive' AND neuron not in (SELECT address FROM genesis_accounts)
            GROUP BY week
        ) send ON activation.week = send.week
        LEFT JOIN (
            SELECT
                week,
                count(*) AS ibc_recieve
            FROM txs_ranked
            WHERE rank = 1 AND type = 'ibc_receive' AND neuron not in (SELECT address FROM genesis_accounts)
            GROUP BY week
        ) ibc_receive ON activation.week = ibc_receive.week
        LEFT JOIN (
            SELECT
                week,
                count(*) AS genesis
            FROM txs_ranked
            WHERE rank = 1 AND neuron in (SELECT address FROM genesis_accounts)
            GROUP BY week
        ) genesis ON activation.week = genesis.week
    ) activation_source
);

CREATE OR REPLACE VIEW daily_number_of_transactions AS (
    SELECT
        date,
        count(*) AS txs_per_day,
        sum(count(*)) over(ORDER BY date) AS txs_total
    FROM (
        SELECT
            date_trunc('day', block.timestamp) :: date AS date
        FROM transaction
        LEFT JOIN block ON (
            transaction.height = block.height
        )
        WHERE success = 't'
    ) t
    GROUP BY date
    ORDER BY date
);

CREATE OR REPLACE VIEW daily_amount_of_used_gas AS (
    SELECT
        date,
        sum(total_gas) AS daily_gas,
        sum(sum(total_gas)) over(ORDER BY date) AS gas_total
    FROM (
        SELECT
            date_trunc('day', timestamp) :: date AS date,
            total_gas
        FROM block
    ) t
    GROUP BY date
    ORDER BY date
);

CREATE OR REPLACE VIEW number_of_new_neurons AS (
    SELECT
        date,
        count(*) AS new_neurons_daily,
        sum(count(*)) over(ORDER BY date) AS new_neurons_total
    FROM (
        SELECT *
        FROM (
            SELECT 
                date(block.timestamp) AS date,
                signer_infos -> 0 -> 'public_key' ->> 'key' AS pubkey,
                rank() over(partition by signer_infos -> 0 -> 'public_key' ->> 'key' order by block.timestamp) AS rank
            FROM transaction
            LEFT JOIN block on block.height = transaction.height
            WHERE success = true
        ) t
        WHERE rank = 1
    ) txs
    GROUP BY date
);

CREATE OR REPLACE VIEW daily_amount_of_active_neurons AS (
    SELECT
        date,
        count(*)
    FROM (
        SELECT 
            DISTINCT ON (date, pubkey) *
        FROM (
            SELECT 
                date(block.timestamp) AS date,
                signer_infos -> 0 -> 'public_key' ->> 'key' AS pubkey
            FROM transaction
            LEFT JOIN block on block.height = transaction.height
            WHERE success = true
        ) t
    ) _t
    WHERE date = CURRENT_DATE
    GROUP BY date
    ORDER BY date
);

CREATE OR REPLACE VIEW top_10_of_active_neurons_week AS (
    SELECT
        pubkey,
        count(*)
    FROM (
        SELECT 
            date(block.timestamp) AS date,
            signer_infos -> 0 -> 'public_key' ->> 'key' AS pubkey
        FROM transaction
        LEFT JOIN block on block.height = transaction.height
        WHERE success = true
    ) t
    WHERE date >= CURRENT_DATE - 7
    GROUP BY pubkey
    ORDER BY count(*) DESC
    LIMIT 10
);

CREATE OR REPLACE VIEW top_leaders AS (
    SELECT
        particle_to AS neuron,
        COUNT(*)
    FROM
        cyberlinks
    WHERE
        particle_from = 'QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx'
    GROUP BY particle_to
    ORDER BY COUNT(*) DESC
);

CREATE OR REPLACE VIEW follow_stats AS (
    SELECT
        date,
        follows_per_day,
        sum(follows_per_day) over(ORDER BY date) AS follow_total
    FROM (
        SELECT
            date(day),
            COALESCE(follows_per_day, 0) AS follows_per_day
        FROM
            generate_series('2021-11-05', now(), INTERVAL '1 day') AS day
        LEFT JOIN (
            SELECT
                date(timestamp),
                COUNT(*) AS follows_per_day
            FROM
                cyberlinks
            WHERE
                particle_from = 'QmPLSA5oPqYxgc8F7EwrM8WS9vKrr1zPoDniSRFh8HSrxx'
            GROUP BY date(timestamp)
            ORDER BY date(timestamp)
        ) t ON date(day) = t.date
    ) _t
    ORDER BY date
);

