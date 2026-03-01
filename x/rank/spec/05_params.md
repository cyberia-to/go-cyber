# Parameters

| Key                | Type    | Default | Range              |
|--------------------|---------|---------|--------------------|
| CalculationPeriod  | int64   | 5       | ≥ 5                |
| DampingFactor      | sdk.Dec | 0.85    | [0.7, 0.9]         |
| Tolerance          | sdk.Dec | 0.001   | [0.00001, 0.001]   |

## CalculationPeriod

Number of blocks between rank recalculations. Lower values make rank more responsive but increase compute load.

## DampingFactor

Probability that a random walker follows a link rather than jumping to a random particle. Standard PageRank value is 0.85. Higher values give more weight to link structure, lower values make rank more uniform.

## Tolerance

Convergence threshold for the iterative algorithm. Iteration stops when the maximum rank change across all particles is below this value. Smaller tolerance means more precise ranks but more iterations.
