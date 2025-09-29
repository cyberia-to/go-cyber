package keeper

import (
	"fmt"
	"runtime/debug"
	"time"

	"github.com/cosmos/cosmos-sdk/telemetry"

	"github.com/cybercongress/go-cyber/v7/x/rank/types"

	"github.com/cometbft/cometbft/libs/log"
)

func CalculateRank(ctx *types.CalculationContext, unit types.ComputeUnit, mock bool, logger log.Logger) (rank types.Rank) {
	defer telemetry.ModuleMeasureSince(types.ModuleName, time.Now(), "rank_calculation")

	if mock {
		rank = types.NewRank(mockRank(ctx), logger, ctx.FullTree)
		return
	}

	start := time.Now()
	if unit == types.CPU {
		// used only for development
		rank = types.NewRank(calculateRankCPU(ctx), logger, ctx.FullTree)
	} else {
		rank = types.NewRank(calculateRankGPU(ctx, logger), logger, ctx.FullTree)
	}

	diff := time.Since(start)

	logger.Info(
		"cyber~Rank calculated", "duration", diff.String(),
		"cyberlinks", ctx.LinksCount, "particles", ctx.CidsCount,
	)

	return
}

func CalculateRankInParallel(
	ctx *types.CalculationContext, rankChan chan types.Rank, err chan error, unit types.ComputeUnit, mock bool, logger log.Logger,
) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("trace from panic: \n" + string(debug.Stack()))
			err <- r.(error)
		}
	}()

	rank := CalculateRank(ctx, unit, mock, logger)
	rankChan <- rank
}
