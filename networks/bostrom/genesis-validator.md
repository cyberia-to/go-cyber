# Setting up cyber Genesis Validator

This guide will provide detailed instructions on how to submit gentx for the bostrom chain!

The primary point of communication for the whole gentx and lauch ceremonies will be our [Cyber Hall of Fame](https://t.me/fameofcyber) telegram chat.

Some important notices about joining the genesis validator set: 

1. **GenTx must be submited by 0:00 UTC 1st November**
2. We recommend only highly experienced validators who have run on past Cosmos SDK chains and have participated in a genesis ceremony before become genesis validators on Cyber.
3. Being a Genesis validator for a Supercomputer is an honor, so we expect all participants to treat this opportunity accordingly. We want our validators to be pro-active, maintain good uptime, communicate and act professionally during chain upgrades, and respectfully participate in governance.
4. To become a Genesis validator, you must have boot tokens on your account in Genesis. That might've happened if you participated in one of our previous testnets or Game of Links, or some other kind of incentivized activity. 


## Hardware setup

Recommended hardware setup stays the same as it was for the last Bostrom-testnets:

```js
CPU: 6 cores
RAM: 32 GB
SSD: 1 TB
Connection: 50+Mbps, Stable and low-latency connection
GPU: Nvidia GeForce (or Tesla/Titan/Quadro) with CUDA-cores; 4+ Gb of video memory*
Software: Ubuntu 18.04 LTS / 20.04 LTS
```

The blockchain is always growing. Therefore, in the future, hardware requirements might increase.
Also, the specs above are not mandatory and may differ, but it always implies that the node might be powerful and reliable.

## Instructions

All instructions provided are for the Ubuntu 20.04 system and may vary for other versions\OS.

### Install GO 1.17+

Cyber is written in `go`, and we'll need the version 1.17+ to compile it. 

Check which version you currently have with 

```bash
go version
``` 

If you need to update or install 'go' we'd recommend to use the handy go version manager called [g](https://github.com/stefanmaric/g). To install 'go' with it use: 

```bash
curl -sSL https://git.io/g-install | sh -s
source ~/.bashrc
```

Agree to install latest version, or manually install specific version: 

```bash
g install 1.17.2
g set 1.17.2
go version
```
You might see something like that: 

```bash
go version go1.17.2 linux/amd64
```

### Install cyber 

Download source files from github: 

```bash
git clone https://github.com/cybercongress/go-cyber.git
cd go-cyber
git checkout bostrom-dev
```

Then install `cyber` daemon.  Running the following command will install the executable cyber to your GOPATH: 

```bash
make install
```

Verify your installation by running:

```bash
cyber version --long
```

Result must look like this: 

```bash
name: cyber
server_name: cyber
version: 0.2.0-rc2
commit: .......
build_tags: netgo ledger,
go: go version go1.17.2 linux/amd64
build_deps:
- filippo.io/edwards25519@v1.0.0-beta.2
- github.com/99designs/keyring@v1.1.6
...
- gopkg.in/yaml.v3@v3.0.0-20210107192922-496545a6307b
- nhooyr.io/websocket@v1.8.6
cosmos_sdk_version: v0.44.2
```

If your `cyber` version does not match - please verify that you dont have any other daemons laying somewhere else in `/usr/local/bin`.

### Initialize your node

Before you proceed verify that you don't have any old\test nodes initialized in that machine, check and remove folders inside `~/.cyber/`. If you have the testnet node running, stop it and remove `~/.cyber/` folder (do not forget to backup your seeds before you remove anything):

```bash
ls -la ~/
rm -rf .cyber/
```

Then run the following to init fresh one(replace <your_node_moniker> with something, for example `web2_destroyer`): 

```bash
cyber init <your_node_moniker>
```

This will create a new `.cyber` folder in your HOME directory.

### Download Pregenesis File

You can now download the "pregenesis" file for the chain.  This is a genesis file with the chain-id and all balances.

```sh
cd $HOME/.cyber/config/
wget -O $HOME/.cyber/config/genesis.json  https://gateway.ipfs.cybernode.ai/ipfs/QmQAd2SBwypsz5ZqkYgeSTFLq3peGV9xGE3i1gW5oPjcYT
```

### Import Validator Key

To create a gentx, you will need the private key to an address that has some tokens in Genesis.

There are a couple options for how to import a key into `cyber`.

You can import such a key into via a mnemonic or add one from the Ledger.

```bash
cyber keys add <your_key_name> --recover
```

You could use your **ledger** device with the Cosmos app installed on it to sign transactions. Add address from Ledger:

```bash
cyber keys add <your_key_name> --ledger
```

**<your_key_name>** is any name you pick to represent this key pair.
You have to refer to that name later when you use cli to sign transactions.

*Note* 

If you got an error saying 

```js
Error: No such interface “org.freedesktop.DBus.Properties” on object at path /
```
 during key import, please use file keyring with all cli key commands:

 ```bash
 cyber keys add <your_key_name> --recover --keyring-backend file
 ```

### Create GenTx

Now that you have your key imported you are able to use it to create your gentx.

To create the Genesis transaction, you will have to choose the following parameters for your validator:

- moniker
- commission-rate
- commission-max-rate
- commission-max-change-rate
- min-self-delegation (must be >10000boot)
- website (optional)
- details (optional)
- identity (keybase key hash, this is used to get validator logos in block explorers. optional)
- pubkey (will be pulled automatically)

Note that your gentx will be rejected if you use an amount greater than what you have on you balance in Genesis.

An example Genesis command would look like this:

```bash
cyber gentx <your_key_name> 10000000000boot \\
  --min-self-delegation "1000000000" \
  --pubkey=$(cyber tendermint show-validator) \
  --moniker=<your_validator_nickname> \
  --commission-rate="0.05" \
  --commission-max-rate="0.10" \
  --commission-max-change-rate="0.01" \
  --chain-id=bostrom 
```

*add `--keyring-backend file` if you used it during key import.*


Output will look similar to this:

```sh
Genesis transaction written to "/root/.cyber/config/gentx/gentx-445e04520cef1116faab9900e2edadcb8164477c.json"
```
File content must look similar to this [sample-gentx](https://github.com/cybercongress/networks/blob/main/bostrom/gentxs/gentx-SAMPLE.json)

### Submit Your GenTx

To submit your GenTx for inclusion in the chain, please upload it to the [github.com/cybercongress/networks](https://github.com/cybercongress/networks/tree/main/bostrom) repo by `0:00 UTC 1st November`.

To upload the your Genesis file, please follow these steps:

1. Rename the gentx file located in your `$HOME/.cyber/config/gentx/` to gentx-{your-moniker}.json (please do not have any spaces or special characters in the file name)
2. Fork this repo by going to https://github.com/cybercongress/networks, clicking on fork, and choose your account (if multiple).
3. Clone your copy of the fork to your local machine
```sh
git clone https://github.com/<your_github_username>/networks
```
4. Copy the gentx to the networks repo (ensure that it is in the correct folder)

```sh
cp ~/.cyber/config/gentx/gentx-<your-moniker>.json networks/bostrom/gentxs/
```

5. Commit and push to your repo.
 
```sh
cd networks
git add bostrom/gentxs/*
git commit -m "<your validator moniker> gentx"
git push origin master
```

6. Create a pull request from your fork to master on this repo.
7. Let us know in [Cyber Hall of Fame](https://t.me/fameofcyber) when you've completed this process!
8. Stay tuned, further steps will be provided soon! 

### Back-up validator keys (!)

Your identity as validator consists of two things: 

- your account (to sign transactions)
- your validator private key (to sign stuff on the chain consensus layer)

Please back up `$HOME/.cyber/config/priv_validator_key.json` along with your seed phrase. In case of occasional folder loss you would be able to restore you validator.

Those things should not be changed, otherwise, your validator won't start on Genesis. 


## Prepare node for chain start

Ok, so here is it, the final genesis for the bostrom network - [QmYubyVNfghD4xCrTFj26zBwrF9s5GJhi1TmxvrwmJCipr](https://gateway.ipfs.cybernode.ai/ipfs/QmYubyVNfghD4xCrTFj26zBwrF9s5GJhi1TmxvrwmJCipr). We have 33 valid genesis transactions submitted! Now only a few steps left to finalize the validator node setup for bostrom launch:

- Clear out old containers
- Download final genesis, and place it to working directory `$HOME/.cyber`
- Pull and deploy new Docker container
- Configure persistent peers, seeds, and some other stuff from `config.toml`
- Verify the correctness of the keys and files on the node


### Cleaning up

If you somehow still have old containers like `bostrom-testnet-6` or `bostrom-testnet-7` sitting on your node - it is a good time to remove them now.

Check which docker containers you have:

```bash
docker ps -a
```

And stop\delete all unnecessary:

```bash
docker stop old-container-name
docker rm old-container-name
```

Check and remove older images to save some space

```bash
docker images
docker rmi image_name
```

If you have older nodes on your server, **please remove the `cosmovisor`**
 directory from .cyber, so it will be updated with the latest version of binaries during docker startup:

 ```bash
 rm -rf  $HOME/.cyber/cosmovisor/
 ```


### Obtain signed genesis file

Hereby we mean that you already have your cyber node initialized in $HOME directory.

Remove pre-genesis from .cyber:

```bash
rm $HOME/.cyber/config/genesis.json
```

Download genesis file for bostrom:

```bash
wget -O $HOME/.cyber/config/genesis.json https://gateway.ipfs.cybernode.ai/ipfs/QmYubyVNfghD4xCrTFj26zBwrF9s5GJhi1TmxvrwmJCipr
```

Also, it is **required** to remove old chain data and reset the home directory to state of signed genesis:

```bash
cyber unsafe-reset-all --home $HOME/.cyber/
```

### Deploy docker container

To pull and deploy docker container for the `bostrom` chain use the following command:

```bash
docker run -d --gpus all --name=bostrom --restart always -p 26656:26656 -p 26657:26657 -p 1317:1317 -e ALLOW_SEARCH=false -v $HOME/.cyber:/root/.cyber  cyberd/cyber:bostrom-1
```


### Setup config.toml

Add correct seeds and persistent peers nodes. You may find some [here](https://github.com/cybercongress/networks/blob/main/bostrom/peers.md)
Insert them into lines 185 and 188 of $HOME/.cyber/config/config.toml:

```bash
nano $HOME/.cyber/config/config.toml
```

```bash
# Comma separated list of seed nodes to connect to
seeds = ""

# Comma separated list of nodes to keep persistent connections to
persistent_peers = ""
```

For better network stability please update your `.cyber/config/config.toml` lines as follows: 

```
addr_book_strict = false

max_num_inbound_peers = 60

max_num_outbound_peers = 30

persistent_peers_max_dial_period = "500s"

```

### Verify validator keys

Verify that your `priv_validator_key.json` from $HOME/.cyber/config/ directory matches the one you used to create gentx.

Check that `pub key value` section is similar to the one corresponding your validator name below:

```bash
cat $HOME/.cyber/config/priv_validator_key.json
```
```bash
sta                 FVs7R89ToDtCaYNZHrRF8MWCQ4d3uxytQSMg4OMleW8=
blue                110HUJd7XFqWhXbE/nF1D4pFcM/vQ8D9yOJbyQF6gsc=
Node_masters        hkaRWuE3BNBVmeqv70qJ++iyYs7THerZyOhNa7E2gVM=
Citizen Cosmos      hzZZ1s5Q2R0Qhbax0Hf7xS9m+kMxbc6FVUihIIoa35c=
0base.vc            9EtOO5q/eUiQ1VtdFegl46fyhJ2tkzm2TDLkdm+zRm0=
Space               0O20CW17q7chWZGHayK+SlEzCXfJaqTlshkE1xujQCg=
Citadel.one         96vbjWw9jbyO8Krl9Rjbt8SU9tVuBiPhtVAxx28arcU=
Developer           KdT8GK9d81xvkDzuNjM3nwi3mijxRfq2YWnM++SAIw4=
qwertys318          r3NIqDgCKwxfTIdvsUYruUSv+ExKI/dyL9UxRt3uuHQ=
web34ever           Kry59s/u3vENIsWu+4ssFqsnECWTxA8iOFSXPbIQmsU=
POSTHUMAN           lWEU7pJSRroGTFMa5O6JKRC1JnGsupKTC88i3uAtxu0=
papsan              YV4dJbW6TrErmwcs0VxFiAJUio+6Yh5shQ+hwlMveN8=
P2P.ORG             4KsAoQUaZNVyA0Tc02Gw3GYxkuMdgtf+aXTOqKDNbgE=
Nett                ChguMkmpTQCnekerrNnAnyFePLY3C1jacudM3SYOrdg=
Godzilla            BncD9wiS2MKpBJw1t9PLoIeqQ9pTccPoGBx9cRNoZak=
Kerman              0nAyxxNGDv3s2miDdJWibOEoWVre8jadmJiA7BSEugk=
cyberG              uMw2XjXqICe1CvEbYCwN3GEXm5r1CBhc0TacHucheyw=
Adorid              AK7c305pBQkAz05OE8rw5JkwSx+nhcvna6Tz9RXhE+Q=
DemonKing           XXul+cFAn6BK4S/aZlMABb9h+jsqFi7/GgZ01JTfhnE=
DragonBall          SmngMSNxQ7TnildgcI5OzZYJxWbwAH2C0UJj3M+J+Fw=
StakeAngle          qOE+qVo9giTu6cypXg6zN3ZT9MitNBHfTYfLL2ADVGo=
spectrum            ZxG1y2GSwb/HuBi8BFZLoYYUMyuvboplTa1DDuMGnG0=
kiwi                823dliApVbj5vUsXFYViaOB6hI8/P7ul0zmZpHmW+80=
PLap                2VHfckjdelAwGj8b3gw+kq7U0ni9aB9S3rNQx054iVU=
dobry               ZxYmxQPGdPYaBJA8IY4Jg3h/Cs0wVRmPIippypxPrsU=
goto5k              TVfJZnq2vaHv1XI49n7nPn1wVQxurVL3JDVVUUo/Ijo=
alinode             JKHQ2Gg/+wWDMcvLwHoEHFccRVZYuGCBSTD/fnIi2vg=
Hailbiafra          triXPhJGBlAduyzF6oF0PKHM9H2sXz9+TWY5gb9lkNI=
csaxial             lB5R6K7wY2G4a3Aus+NWAwYiFga5Cc2WxvwZG3Ga3yk=
NodeMarsel          fIbK0sEsisgCoXnWmrfApLX7SdvuhltzU1llq+jiV8k=
MindPool            RPBRQHcurf6ZOoar9DWoncHbcEGmaceT0zdalDYsobo=
Bro_n_Bro           SEiFL2BSD9TOUsPIaBKx5xZU+ijry95DdZ44u9mwd3Y=
bloqhub             aIG2z/l2N3K6WslUGA8u5kZnqcvqyKEXQpoiiICLKa4=
```

## Launch

When all above are checked and completed please go ahead and restart the container:

```bash
docker restart bostrom
```

Check the logs. 

```bash
docker logs bostrom
```

They have to contain the following:

```bash
1:42AM INF Starting Node service impl=Node
1:42AM INF Genesis time is in the future. Sleeping until then... genTime=2021-11-05T13:22:42Z
```

If you got that message - congrats, you set everything up!

The chain will start at `5th November 13:22UTC`. Please track [Cyber Hall of Fame](https://t.me/fameofcyber) telegram chat, all coordination will be done there. 
Also, watch the bostrom genesis at `https://cyb.ai/genesis`, you can find something beautiful and interesting there! 
See you in the Cyber Era! 
