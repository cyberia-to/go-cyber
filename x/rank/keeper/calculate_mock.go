package keeper

import (
	"github.com/cybercongress/go-cyber/v7/x/rank/types"
)

func mockRank(ctx *types.CalculationContext) types.EMState {

	size := ctx.GetCidsCount()
	if size == 0 || len(ctx.GetStakes()) == 0 {
		return types.EMState{
			RankValues: []float64{},
		}
	}

	rank := make([]float64, size)

	// Rank: deterministic descending normalized distribution
	denom := float64(size * (size + 1) / 2)
	for i := int64(0); i < size; i++ {
		rank[i] = float64(size-i) / denom
	}

	return types.EMState{
		RankValues: rank,
	}
}
