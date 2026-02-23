# How to prepare your node for Cyberfrey upgrade

This guide includes all the steps you need to get ready for the `Cyberfrey` upgrade in Bostrom.

Hereby we assume that you run your node in docker with the cyber ["official"](https://hub.docker.com/layers/cyber/cyberd/cyber/bostrom-1/images/sha256-6383de3e4562690907b0dbb99b752f53ef2d41f44a7d452a903d24397e49911b?context=explore) image, otherwise this guide will not suit your node. 

## Step 1: Pull new docker image

The new cyber binary is wrapped in the new docker image, so we have to pull it first: 

```js
docker pull cyberd/cyber:bostrom-2
```
It may take few minutes to pull the new image. When complete, check that you have it with: 

```js
docker images
```

## Step 2: Replace docker image for Bostrom container

*At this stage you will have to operate quickly in order to reduce your node downtime, so please read all the sub-steps first!*

Stop your current docker container with Bostrom: 

```js
docker stop bostrom
```

Remove Bostrom container (do not worry, files will stay untouched):

```js
docker rm bostrom
```

Create Bostrom container from new image (note: if you have custom ports set, please adjust accordingly): 

```sh
docker run -d --gpus all --name=bostrom --restart always -p 26656:26656 -p 26657:26657 -p 1317:1317 -e ALLOW_SEARCH=true -v $HOME/.cyber:/root/.cyber  cyberd/cyber:bostrom-2
```

Check logs. Block production should restore after startup:

```sh
docker logs bostrom -f --tail 20 
```

## Step 3: Verify that everything is OK

After the container lauch, the new cyber binary should appear inside the `$HOME/.cyber/cosmovisor/` folder. Check that you have a similar folder layout: 

```sh
cd $HOME/.cyber/cosmovisor/
tree
```

You should have a similar layout of files and folders:

```sh
root@node:~/.cyber/cosmovisor# tree
.
├── current -> /root/.cyber/cosmovisor/genesis/bin
├── genesis
│   └── bin
│       └── cyber
└── upgrades
    └── cyberfrey
        └── bin
            └── cyber


6 directories, 2 files
```

## You are done! What's next? 

Now is a good time to go and vote for prop #7. If you havent done this yet, report that you have completed preparation for the upgrade in our [Hall of Fame](https://t.me/fameofcyber) and chill until the upgrade block 3098000, which should come around 9:00am UTC Friday 03.06.2022 (proposal says 04.06.2022 but that's incorrect). 
You may also track the countdown to upgrade at `cybernode.ai`, actual block time is used there so the estimate is more or less correct.

What will happen at the block 3098000: 

- chain will halt with message `CONSENSUS FAILURE!!! err="UPGRADE \"cyberfrey\" NEEDED at height: 3098000:`
- Cosmovisor inside the container will catch this event and change symlink inside `.cyber/cosmovisor/` folder
- node will start and as soon as 66%+ of voting power is online, blocks will resume

## Crisis protocol 

The process of upgrading should go pretty smoothly and should not require any direct action, but in case something goes wrong, cyber devs may consider certain ways to recover. Simply check your node at the time of the upgrade and consult the [Hall of Fame](https://t.me/fameofcyber) chat for possible coordination. 
