package keeper

import (
	"context"

	errorsmod "cosmossdk.io/errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	ctypes "github.com/cybercongress/go-cyber/v7/types"

	"github.com/cybercongress/go-cyber/v7/x/resources/types"
)

var _ types.QueryServer = Keeper{}

func (k Keeper) Params(goCtx context.Context, request *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	return &types.QueryParamsResponse{Params: params}, nil
}

func (k Keeper) Investmint(goCtx context.Context, request *types.QueryInvestmintRequest) (*types.QueryInvestmintResponse, error) {
	if request == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	if request.Amount.Denom != ctypes.SCYB {
		return nil, errorsmod.Wrap(types.ErrInvalidBaseResource, request.Amount.String())
	}

	if request.Resource != ctypes.VOLT && request.Resource != ctypes.AMPERE {
		return nil, errorsmod.Wrap(types.ErrResourceNotExist, request.Resource)
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	maxPeriod := k.GetMaxPeriod(ctx, request.Resource)

	amount := k.CalculateInvestmint(ctx, request.Amount, request.Resource, maxPeriod)

	amount = k.applySupplyExponentialAdjustment(ctx, request.Resource, amount)

	return &types.QueryInvestmintResponse{Amount: amount}, nil
}

func (k Keeper) AdjustedPrice(goCtx context.Context, request *types.QueryAdjustedPriceRequest) (*types.QueryAdjustedPriceResponse, error) {
	if request == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	if request.Resource != ctypes.VOLT && request.Resource != ctypes.AMPERE {
		return nil, errorsmod.Wrap(types.ErrResourceNotExist, request.Resource)
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	amount := k.applySupplyExponentialAdjustment(ctx, request.Resource, request.Base)

	return &types.QueryAdjustedPriceResponse{Adjusted: amount}, nil
}
