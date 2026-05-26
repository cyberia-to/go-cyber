# Clients

## CLI

### Queries

| Command | Arguments | Description |
| --- | --- | --- |
| `cyber query clock params` | | Module parameters |
| `cyber query clock contract` | [contract_address] | Single contract status |
| `cyber query clock contracts` | | All registered contracts |

### Transactions

| Command | Arguments | Description |
| --- | --- | --- |
| `cyber tx clock register` | [contract_address] | Register a contract |
| `cyber tx clock unjail` | [contract_address] | Unjail a contract |
| `cyber tx clock unregister` | [contract_address] | Unregister a contract |
