# Deploy bostrom node from snapshot

## Download snapshot
First, go to [Cyber Snapshot Robot](https://cyb.ai/network/bostrom/contract/bostrom137p3ll78yrlw3gtfltgwhdkz0qxke4z6mt9qe6) page

Latest post will show you available snapsot:
![](https://ipfs.io/ipfs/QmWjcgseTj5GmGSC8z1X6wzD5Eh1wQv1RfBfChmafqcwvm)


Сlick on the link with the block and you will see two results:
![](https://ipfs.io/ipfs/QmQvZegg39JnQ5EESgA3t9seCYSAF7nZyDZGRo1iUXLemi)

We typicaly store only latest snashot, older might be available only in IPFS if someone stored them.

The first one is a hash of the current snapshot that can be downloaded directly from ipfs (to use this way, you need an ipfs [client](https://docs.ipfs.tech/install/command-line/) installed)

```
ipfs get <insert the hash here> --output bostrom_pruned.tar.gz
```
The second hash contains url that can be downloaded directly:

```
wget https://link_from_above
```

## Unpack snapshot

Single thread:

```
tar -xvzf bostrom_pruned_<snap_block>.tar.gz
```

Multiple threads (much faster and require pigz installation):

```
apt install pigz  
```
```
tar -I pigz -xf bostrom_pruned_<snap_block>.tar.gz -C ./
```

## Stop Cyber

```
docker stop bostrom
```

## Remove old data from home directory

**Dont forget to use correct path if your node is not in $HOME of your user.**

```
rm -rf ~/.cyber/data ~/.cyber/wasm
```

## Move unpacked folders into home directory

```
cd bostrom_pruned_<snap_block>  
```
```
mv data/ ~/.cyber/  
```
```
mv wasm/ ~/.cyber/
```

## Set up your pruning strategy to everything

To save the space ont the disk consumed by the node set pruning to everything (lightest one) and set snapshot-interval to 0 in `.cyber/config/app.toml`:

```
pruning = "everything"  
```
```
snapshot-interval = 0
```

## Start Cyber container and check logs

```
docker start bostrom  
```
```
docker logs bostrom -f --tail 10
```
You will see node started sync from the snapshot block.

## When done dont forget to remove folder and archive to save some space

```
rm -rf bostrom_pruned_<snap_block> bostrom_pruned_<snap_block>.tar.gz
```
