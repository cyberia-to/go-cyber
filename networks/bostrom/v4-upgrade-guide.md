# How to prepare your node for v4 upgrade

This guide describes all the steps you need to get ready for the `v4` upgrade in Bostrom.

Hereby we assume that you run your node in docker with the cyber ["official"](https://hub.docker.com/layers/cyber/cyberd/cyber/bostrom-1/images/sha256-6383de3e4562690907b0dbb99b752f53ef2d41f44a7d452a903d24397e49911b?context=explore) image, otherwise, this guide will not suit you.

## Step 1: Pull a new docker image & prepare

The new cyber binary is wrapped in the new docker image, so we have to pull it first:

```js
docker pull cyberd/bostrom:v4.0.0-cuda11.4
```

It may take a few minutes. When complete, check that you have it:

```js
docker images
```

Make sure that in `config/app.toml` you have  `minimum-gas-prices` valuet set: 

```bash
 minimum-gas-prices = "0boot"
 ```

## Step 2: Replace the docker image for the Bostrom container

*At this stage you will have to operate quickly to reduce your node downtime, so please read all the sub-steps first!*

Stop your docker container with Bostrom:

```js
docker stop bostrom
```

Remove Bostrom container (do not worry, files will stay intact):

```js
docker rm bostrom
```

Create Bostrom container from new image (note: if you have custom ports set, please adjust accordingly):

```sh
docker run -d --gpus all --name=bostrom --restart always -p 26656:26656 -p 26657:26657 -p 1317:1317 -e ALLOW_SEARCH=true -v $HOME/.cyber:/root/.cyber  cyberd/bostrom:v4.0.0-cuda11.4
```

Check logs. Block production should be restored after startup:

```sh
docker logs bostrom -f --tail 20 
```

## Step 3: Verify that everything is OK

After the container launch, the new cyber binary should appear inside the `$HOME/.cyber/cosmovisor/` folder. Check that you have a similar folder layout:

```sh
cd $HOME/.cyber/cosmovisor/
tree
```

You should have a similar layout of files and folders:

```sh
root@node:~/.cyber/cosmovisor# tree
.
├── current -> /root/.cyber/cosmovisor/upgrades/v3
├── genesis
│   └── bin
│       └── cyber
└── upgrades
    ├── cyber
    ├── cyberfrey
    │   ├── bin
    │   │   └── cyber
    │   ├── cyber
    │   └── upgrade-info.json
    ├── v3
    │   ├── bin
    │   │   └── cyber
    │   └── upgrade-info.json
    └── v4
        └── bin
            └── cyber

```

## You are done! What's next?

Now is a good time to go and vote for prop [#45](https://cyb.ai/senate/45). If you haven't done this yet, report that you have completed preparation for the upgrade in our [Hall of Fame](https://t.me/fameofcyber) and chill until the upgrade block 15515000, which should come around ~9:00am UTC Friday 04.10.2024 ([ping.pub timer](https://ping.pub/bostrom/block/15515000)).

What will happen at the block 15515000:

- the chain will halt with the message `CONSENSUS FAILURE!!! err="UPGRADE \"v4\" NEEDED at height: 15515000:`
- Cosmovisor inside the container will catch this event and change symlink inside `.cyber/cosmovisor/` folder
- node will start and as soon as 66%+ of voting power is online, blocks will resume

## Crisis protocol

The process of upgrading should go pretty smoothly and should not require any direct action, but in case something goes wrong, cyber devs may consider certain ways to recover. Simply check your node at the time of the upgrade and consult the [Hall of Fame](https://t.me/fameofcyber) chat for possible coordination.

## Note: Keys format upgrade

In the v4 release cyber is being updated to the cometbft consensus engine, which leads to keystore migration to the cometbft compatible version. That will mean that after the upgrade and first signed TX using the new version of CLI, the keystore would be migrated and no longer compatible with the old CLI versions. Everything would work smoothly if you use `docker exec -ti bostrom cyber tx ...` for transaction casting, however, if you have CLI installed separately - make sure to upgrade it as well to [v4.0.0](https://github.com/cybercongress/go-cyber/releases/tag/v4.0.0).
