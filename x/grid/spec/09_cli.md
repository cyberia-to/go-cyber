# CLI

## Query

```bash
cyber query grid params
cyber query grid routes-from [source]         # list all routes from source
cyber query grid routes-to [destination]       # list all routes to destination
cyber query grid routed-from [source]          # total energy routed from source (sum)
cyber query grid routed-to [destination]       # total energy routed to destination (sum)
cyber query grid route [source] [destination]  # single route
cyber query grid routes                        # all routes (paginated)
```

## Transaction

```bash
cyber tx grid create-route [destination] [name]
cyber tx grid edit-route [destination] [value]
cyber tx grid delete-route [destination]
cyber tx grid edit-route-name [destination] [name]
```
