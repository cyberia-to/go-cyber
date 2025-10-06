package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cybercongress/go-cyber/v7/x/graph/types"
)

var _ types.QueryServer = GraphKeeper{}

func (gk GraphKeeper) GraphStats(goCtx context.Context, _ *types.QueryGraphStatsRequest) (*types.QueryGraphStatsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	links := gk.GetLinksCount(ctx)
	cids := gk.GetCidsCount(ctx)

	return &types.QueryGraphStatsResponse{Cyberlinks: links, Particles: cids}, nil
}

func (gk GraphKeeper) BurnStats(goCtx context.Context, _ *types.QueryBurnStatsRequest) (*types.QueryBurnStatsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	millivolts := gk.GetBurnedVolts(ctx)
	milliamperes := gk.GetBurnedAmperes(ctx)

	return &types.QueryBurnStatsResponse{millivolts, milliamperes}, nil
}
