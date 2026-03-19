# Concepts

## Clock

The clock module executes registered contracts at the start and end of every block via Sudo messages. Contracts perform regular actions without external bots.

Registration requires the sender to be the contract admin (if set) or the contract creator. Once registered, the contract receives `BeginBlock` and `EndBlock` Sudo calls every block.

If a contract errors or exceeds the `contract_gas_limit` parameter, it is jailed and skipped until unjailed.

## Registering a contract

```bash
cyber tx clock register [contract_address]
```

The sender must be the contract admin or creator. The contract must implement the Sudo entry point described in [Integration](03_integration.md).

## Unjailing a contract

```bash
cyber tx clock unjail [contract_address]
```

The sender must be the contract admin or creator. Unjailing restores block execution for the contract.

## Unregistering a contract

```bash
cyber tx clock unregister [contract_address]
```

The sender must be the contract admin or creator. Removes the contract from the clock module.
