# Errors

| Error                | Code | Description                         |
|----------------------|------|-------------------------------------|
| ErrTimeLockCoins     | 2    | failed to update vesting schedule   |
| ErrIssueCoins        | 3    | failed to issue coins               |
| ErrMintCoins         | 4    | failed to mint coins                |
| ErrBurnCoins         | 5    | failed to burn hydrogen             |
| ErrSendMintedCoins   | 6    | failed to send minted coins         |
| ErrNotAvailablePeriod| 7    | period not available (legacy)       |
| ErrInvalidAccountType| 8    | account type not supported          |
| ErrAccountNotFound   | 9    | account not found                   |
| ErrResourceNotExist  | 10   | resource does not exist             |
| ErrFullSlots         | 11   | all slots are full (legacy)         |
| ErrSmallReturn       | 12   | mint return < 1000 units            |
| ErrInvalidBaseResource| 13  | wrong hydrogen denom for resource   |
