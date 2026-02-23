CREATE TABLE cyberlinks
(
    id                  SERIAL PRIMARY KEY,
    particle_from       VARCHAR(256)                NOT NULL,
    particle_to         VARCHAR(256)                NOT NULL,
    neuron              TEXT                        NOT NULL REFERENCES account (address),
    timestamp           TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    height              BIGINT                      NOT NULL REFERENCES block (height),
    transaction_hash    TEXT                        NOT NULL
);
CREATE INDEX cyberlinks_particle_from_index ON cyberlinks(particle_from);
CREATE INDEX cyberlinks_particle_to_index ON cyberlinks(particle_to);
CREATE INDEX cyberlinks_neuron_index ON cyberlinks(neuron);
CREATE INDEX cyberlinks_height_index ON cyberlinks(height);
CREATE INDEX cyberlinks_from_to_index ON cyberlinks(particle_from, particle_to);

CREATE TABLE particles
(
    id                  SERIAL PRIMARY KEY,
    particle            VARCHAR(256)                NOT NULL UNIQUE,
    neuron              TEXT                        NOT NULL REFERENCES account (address),
    timestamp           TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    height              BIGINT                      NOT NULL REFERENCES block (height),
    transaction_hash    TEXT                        NOT NULL
);
CREATE INDEX particles_neuron_index ON particles(neuron);
CREATE INDEX particles_height_index ON particles(height);
CREATE INDEX particles_neuron_particle_index ON particles(neuron, particle);