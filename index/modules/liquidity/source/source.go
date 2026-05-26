package source

import (
	"github.com/cybercongress/go-cyber/v4/x/liquidity/types"
)

type Source interface {
	GetPool(poolID uint64, height int64) (types.Pool, error)
}
