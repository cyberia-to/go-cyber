# CLI

## Query

```bash
cyber query rank params
cyber query rank rank [particle]                       # rank of a particle
cyber query rank search [particle] [page] [limit]      # outlinks sorted by rank
cyber query rank backlinks [particle] [page] [limit]   # inlinks sorted by rank
cyber query rank top [page] [limit]                    # top-ranked particles (max 1000)
cyber query rank is-exist [from] [to] [account]        # link exists by account
cyber query rank is-exist-any [from] [to]              # any link exists
cyber query rank negentropy [particle]                 # particle negentropy
cyber query rank negentropy-total                      # system negentropy
```

## Node Flags

```bash
--compute-gpu=true    # use GPU for rank calculation (default true)
--compute-mock=false  # use mock rank distribution for testing
--search-api=false    # enable search index for Search/Backlinks/Top queries
```
