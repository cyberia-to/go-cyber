# Here you may fing peers and seeds to hop on bostrom chain

## Seeds:

cybercongress

```bash
d0518ce9881a4b0c5872e5e9b7c4ea8d760dad3f@85.10.207.173:26656
```

notional
```bash
9ccf246720ba68f22c32548159fbe7cc5fc2f429@provider.xeon.computer:32199
```

## Peers:

cyberongress:

```bash
5d542c0eb40ae48dc2cac0c140aedb605ded77dc@195.201.105.229:26656
c72de1e20beed51b779d89b1cf08d8146016eec4@185.186.208.37:26656
```

Bro_n_Bro validator

```bash
f995433a0b09666c3ced97a912726ab5f747a4d0@95.216.241.52:26656
5e96c2a8d92b09a35da6e31838134ad306d79149@93.159.134.158:26656
```

cyberG

```bash
39a20a7d84c6e91c6638f5a685a13f655e050ee0@176.37.214.146:26656
```

Developer

```bash
77d27615009fc703ece46901792cc8750cccd0de@185.230.90.71:26656
```

Bloqhub

```bash
dd22cffccafaece970cfa9e7eb3c8468f6fa1c84@46.166.165.14:26656
```

web34ever

```bash
5e8522bef5ceca507e05aa0d5f67f37a70222c73@88.218.191.79:26656
```

POSTHUMAN

```bash
55937c36959ea3984cc6e6ebd3354d73bbbdbcda@95.165.24.115:26656
```

## Run a seed on akash

```yaml
---
version: "2.0"

services:
  osmosis:
    image: ghcr.io/notional-labs/tinyseed:latest
    env: 
     - ID=bostrom
     - SEEDS=d0518ce9881a4b0c5872e5e9b7c4ea8d760dad3f@85.10.207.173:26656
    expose:
      - port: 8080
        to:
          - global: true
      - port: 6969
        to:
          - global: true
profiles:
  compute:
    osmosis:
      resources:
        cpu:
          units: 1
        memory:
          size: 100Mi
        storage:
          size: 100Mi
  placement:
    dcloud:
      pricing:
        osmosis:
          denom: uakt
          amount: 10
deployment:
  osmosis:
    dcloud:
      profile: osmosis
      count: 1
```
