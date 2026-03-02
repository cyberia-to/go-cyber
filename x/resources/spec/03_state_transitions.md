# State Transitions

## MsgInvestmint

1. `maxPeriod` calculated from current block height and halving period.
2. Spendable hydrogen balance verified >= requested amount.
3. Hydrogen sent from neuron to module account, then burned.
4. Mint amount calculated using `maxPeriod`, base params, halving, and supply decay.
5. Minimum return validated (>= 1000 millivolt or milliampere).
6. Resources minted to module account, sent to neuron.
7. Vesting schedule updated with 1-second period (backward compatibility).
8. If VOLT: network desirable bandwidth incremented by minted amount.
9. If AMPERE: no additional side effect in this module. Amperes affect focus weight in x/rank.
