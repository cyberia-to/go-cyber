# Setting up space-pussy Genesis Validator

This guide will provide detailed instructions on how to submit gentx for the Space-pussy chain!

The primary point of communication for the whole gentx and lauch ceremonies will be our [Cyber Hall of Fame](https://t.me/fameofcyber) telegram chat.

Some important notices about joining the genesis validator set: 

1. **GenTx must be submited by 17:00 UTC 3rd October**
2. We recommend only highly experienced validators who have run on past Cosmos SDK chains and have participated in a genesis ceremony before become genesis validators on Cyber.
3. Being a Genesis validator for a Supercomputer is an honor, so we expect all participants to treat this opportunity accordingly. We want our validators to be pro-active, maintain good uptime, communicate and act professionally during chain upgrades, and respectfully participate in governance.
4. To become a Genesis validator, you must have pussy tokens on your account in Genesis. 


## Hardware setup

Recommended hardware setup stays the same as it was for the Bostrom:

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
g install 1.19.1
g set 1.19.1
go version
```
You might see something like that: 

```bash
go version go1.19.1 linux/amd64
```

### Install pussy

Download source files from github: 

```bash
git clone https://github.com/joinresistance/space-pussy.git
cd space-pussy
```

Then install `pussy` daemon.  Running the following command will install the executable pussy to your GOPATH: 

```bash
make install CUDA_ENABLED=false
```

If your `pussy` version does not match - please verify that you dont have any other daemons laying somewhere else in `/usr/local/bin`.

### Initialize your node

Before you proceed verify that you don't have any old\test nodes initialized in that machine, check and remove folders inside `~/.pussy/`. If you have the testnet node running, stop it and remove `~/.pussy/` folder (do not forget to backup your seeds before you remove anything):

```bash
ls -la ~/
rm -rf .pussy/
```

Then run the following to init fresh one(replace <your_node_moniker> with something, for example `web2_destroyer`): 

```bash
pussy init <your_node_moniker>
```

This will create a new `.pussy` folder in your HOME directory.

### Download Pre-genesis File

You can now download the "pregenesis" file for the chain.  This is a genesis file with the chain-id and all balances.

```sh
cd $HOME/.pussy/config/
wget -O $HOME/.pussy/config/genesis.json  https://raw.githubusercontent.com/joinresistance/networks/main/space-pussy/unsigned-genesis.json
```

### Import Validator Key

To create a gentx, you will need the private key to an address that has some tokens in Genesis.

There are a couple options for how to import a key into `pussy`.

You can import such a key into via a mnemonic or add one from the Ledger.

```bash
pussy keys add <your_key_name> --recover
```

You could use your **ledger** device with the Cosmos app installed on it to sign transactions. Add address from Ledger:

```bash
pussy keys add <your_key_name> --ledger
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
 pussy keys add <your_key_name> --recover --keyring-backend file
 ```

### Create GenTx

Now that you have your key imported you are able to use it to create your gentx.

To create the Genesis transaction, you will have to choose the following parameters for your validator:

- moniker
- commission-rate
- commission-max-rate
- commission-max-change-rate
- min-self-delegation (must be >10000pussy)
- website (optional)
- details (optional)
- identity (keybase key hash, this is used to get validator logos in block explorers. optional)
- pubkey (will be pulled automatically)

Note that your gentx will be rejected if you use an amount greater than what you have on you balance in Genesis.

An example Genesis command would look like this:

```bash
pussy gentx <your_key_name> 1000000000000pussy \
  --min-self-delegation "1000000000" \
  --pubkey=$(pussy tendermint show-validator) \
  --moniker=<your_validator_nickname> \
  --commission-rate="0.05" \
  --commission-max-rate="0.10" \
  --commission-max-change-rate="0.01" \
  --chain-id=space-pussy 
```

*add `--keyring-backend file` if you used it during key import.*


Output will look similar to this:

```sh
Genesis transaction written to "/root/.pussy/config/gentx/gentx-445e04520cef1116faab9900e2edadcb8164477c.json"
```
File content must look similar to this [sample-gentx](https://github.com/joinresistance/networks/blob/main/space-pussy/gentxs/gentx-SAMPLE.json)

### Submit Your GenTx

To submit your GenTx for inclusion in the chain, please upload it to the [[github.com/joinresistance/networks](https://github.com/joinresistance/networks)](https://github.com/joinresistance/networks/blob/main/space-pussy/gentxs) repo by `18:00 UTC 3rd October`.

To upload the your Genesis file, please follow these steps:

1. Rename the gentx file located in your `$HOME/.pussy/config/gentx/` to gentx-{your-moniker}.json (please do not put any spaces or special characters in the file name)
2. Fork this repo by going to https://github.com/joinresistance/networks, clicking on fork, and choose your account (if multiple).
3. Clone your copy of the fork to your local machine
```sh
git clone https://github.com/<your_github_username>/networks
```
4. Copy the gentx to the networks repo (ensure that it is in the correct folder)

```sh
cp ~/.pussy/config/gentx/gentx-<your-moniker>.json networks/space-pussy/gentxs/
```

5. Commit and push to your repo.
 
```sh
cd networks
git add space-pussy/gentxs/*
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

Please back up `$HOME/.pussy/config/priv_validator_key.json` along with your seed phrase. In case of occasional folder loss you would be able to restore you validator.

Those things should not be changed, otherwise, your validator won't start on Genesis. 


## Prepare node for chain start

Ok, so here is it, the final genesis for the space-pussy `TBA`. Now only a few steps left to finalize the validator node setup for space-pussy launch:

- Clear out old containers
- Download final genesis, and place it to working directory `$HOME/.cyber`
- Pull and deploy new Docker container
- Configure persistent peers, seeds, and some other stuff from `config.toml`
- Verify the correctness of the keys and files on the node


### Obtain signed genesis file

Hereby we mean that you already have your pussy node initialized in $HOME directory.

Remove pre-genesis from .pussy:

```bash
rm $HOME/.pussy/config/genesis.json
```

Download genesis file for space-pussy:

```bash
wget -O $HOME/.pussy/config/genesis.json https://gateway.ipfs.cybernode.ai/ipfs/TBA
```

Also, it is **required** to remove old chain data and reset the home directory to state of signed genesis:

```bash
pussy tendermint unsafe-reset-all --home $HOME/.pussy/
```

### Deploy docker container

To pull and deploy docker container for the `space-pussy` chain use the following command:

```bash
docker run -d --gpus all --name=space-pussy --restart always -p 26656:26656 -p 26657:26657 -p 1317:1317 -e ALLOW_SEARCH=true -e COMPUTE_GPU=true -v $HOME/.pussy:/root/.pussy  cyberd/space-pussy:v0.0.1-cuda11.4
```


### Setup config.toml

Add correct seeds and persistent peers nodes. You may find some [here](https://github.com/joinresistance/networks/blob/main/space-pussy/peers.md)
Insert them into lines 185 and 188 of $HOME/.pussy/config/config.toml:

```bash
nano $HOME/.pussy/config/config.toml
```

```bash
# Comma separated list of seed nodes to connect to
seeds = ""

# Comma separated list of nodes to keep persistent connections to
persistent_peers = ""
```

For better network stability please update your `.pussy/config/config.toml` lines as follows: 

```
addr_book_strict = false

max_num_inbound_peers = 100

max_num_outbound_peers = 80

persistent_peers_max_dial_period = "500s"

```

## Launch

When all above are checked and completed please go ahead and restart the container:

```bash
docker restart space-pussy
```

Check the logs. 

```bash
docker logs space-pussy
```

They have to contain the following:

```bash
1:42AM INF Starting Node service impl=Node
1:42AM INF Genesis time is in the future. Sleeping until then... genTime=2022-09-03T22:55:42Z
```

If you got that message - congrats, you set everything up!

The chain will start at `3rd October 19:55UTC`. Please track [Cyber Hall of Fame](https://t.me/fameofcyber) telegram chat, all coordination will be done there.  
