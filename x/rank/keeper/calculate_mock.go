package keeper

import (
	"github.com/cybercongress/go-cyber/v6/x/rank/types"
)

func mockRank(ctx *types.CalculationContext) types.EMState {

	size := ctx.GetCidsCount()
	if size == 0 || len(ctx.GetStakes()) == 0 {
		return types.EMState{
			RankValues:    []float64{},
			EntropyValues: []float64{},
			KarmaValues:   []float64{},
		}
	}

	rank := make([]float64, size)
	entropy := make([]float64, size)
	karma := make([]float64, len(ctx.GetStakes()))

	// Rank: deterministic descending normalized distribution
	denom := float64(size * (size + 1) / 2)
	for i := int64(0); i < size; i++ {
		rank[i] = float64(size-i) / denom
	}

	// Entropy: linear ramp in [0, 1]
	for i := int64(0); i < size; i++ {
		entropy[i] = float64(i+1) / float64(size)
	}

	// Karma: normalized stakes; uniform if all zero
	stakes := ctx.GetStakes()
	var totalStake uint64
	for _, s := range stakes {
		totalStake += s
	}
	if totalStake > 0 {
		for i, s := range stakes {
			karma[i] = float64(s) / float64(totalStake)
		}
	} else if len(karma) > 0 {
		uniform := 1.0 / float64(len(karma))
		for i := range karma {
			karma[i] = uniform
		}
	}

	return types.EMState{
		RankValues:    rank,
		EntropyValues: entropy,
		KarmaValues:   karma,
	}
}
