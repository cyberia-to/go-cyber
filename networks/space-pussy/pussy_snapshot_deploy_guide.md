# ![](https://ipfs.io/ipfs/QmWeAd87fZm1pMYyX9BmhnTrXYKCZLoyzMJMcSwNHfB6gU) Deploy Pussy node from snapshot

## Download snapshot
First, go to [Pussy Snapshot Robot](https://cyb.ai/network/bostrom/contract/pussy137p3ll78yrlw3gtfltgwhdkz0qxke4z638md6n) quitter page

Latest post will show you available snapsot:
![](https://ipfs.io/ipfs/QmaFJ56SNwEvF2J1wsuKjdb1psYNSbFPiSRntPrjEcYoHa)

Сlick on the link with the block and you will see three results:
![](https://ipfs.io/ipfs/QmaSj6avQZFs8Yn7ZbKNoR96TVqAng1Cov21ZukNoU2n7U)

We typicaly store only latest snashot, older might be available only in IPFS if someone stored them.

The first one is a hash of the current snapshot that can be downloaded directly from ipfs (to use this way, you need an ipfs [client](https://docs.ipfs.tech/install/command-line/) installed)

```
ipfs get <insert the hash here> --output space-pussy-pruned.tar.gz
```
The second hash contains url that can be downloaded directly:

```
wget https://jupiter.cybernode.ai/shared/space-pussy-pruned_<change block number>.tar.gz
```

## Unpack snapshot

Single thread:

```
tar -xvzf space-pussy-pruned_<snap_block>.tar.gz
```

Multiple threads (much faster and require pigz installation):

```
apt install pigz
tar -I pigz -xf space-pussy-pruned_<snap_block>.tar.gz -C ./
```

## Stop Pussy

```
docker stop space-pussy
```

## Remove old data from home directory

**Dont forget to use correct path if your node is not in $HOME of your user.**

```
rm -rf ~/.pussy/data ~/.pussy/wasm
```

## Move unpacked folders into home directory

```
cd space-pussy-pruned_<snap_block>
mv data/ ~/.pussy/
mv wasm/ ~/.pussy/
```

## Set up your pruning strategy to everything

To save the space ont the disk consumed by the node set pruning to everything (lightest one) and set snapshot-interval to 0 in `.pussy/config/app.toml`:

```
pruning = "everything"
snapshot-interval = 0
```

## Start Pussy container and check logs

```
docker start space-pussy
docker logs space-pussy -f --tail 10
```
You will see node started sync from the snapshot block.

## When done dont forget to remove folder and archive to save some space

```
rm -rf space-pussy-pruned_<snap_block> space-pussy-pruned_<snap_block>.tar.gz
```
