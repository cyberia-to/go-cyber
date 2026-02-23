package keeper

import (
	"context"
	"math"

	errorsmod "cosmossdk.io/errors"
	"github.com/ipfs/go-cid"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	graphtypes "github.com/cybercongress/go-cyber/v7/x/graph/types"
	"github.com/cybercongress/go-cyber/v7/x/rank/types"
	querytypes "github.com/cybercongress/go-cyber/v7/x/rank/types"
)

var _ types.QueryServer = &StateKeeper{}

func (sk StateKeeper) Params(goCtx context.Context, _ *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := sk.GetParams(ctx)

	return &types.QueryParamsResponse{Params: params}, nil
}

func (sk StateKeeper) Rank(goCtx context.Context, req *types.QueryRankRequest) (*types.QueryRankResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	particle, err := cid.Decode(req.Particle)
	if err != nil {
		return nil, graphtypes.ErrInvalidParticle
	}

	if particle.Version() != 0 {
		return nil, graphtypes.ErrCidVersion
	}

	cidNum, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.Particle))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.Particle)
	}

	// rankValue := sk.index.GetRankValue(cidNum) // TODO it was the bug, test wasm
	rankValue := sk.networkCidRank.RankValues[cidNum]
	return &types.QueryRankResponse{Rank: rankValue}, nil
}

func (sk *StateKeeper) Search(goCtx context.Context, req *types.QuerySearchRequest) (*types.QuerySearchResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	cidNum, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.Particle))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, "")
	}

	page, limit := uint32(0), uint32(10)
	if req.Pagination != nil {
		page, limit = req.Pagination.Page, req.Pagination.PerPage
	}
	rankedCidNumbers, totalSize, err := sk.index.Search(cidNum, page, limit)
	if err != nil {
		panic(err)
	}

	result := make([]types.RankedParticle, 0, len(rankedCidNumbers))
	for _, c := range rankedCidNumbers {
		result = append(result, types.RankedParticle{Particle: string(sk.graphKeeper.GetCid(ctx, c.GetNumber())), Rank: c.GetRank()})
	}

	return &types.QuerySearchResponse{Result: result, Pagination: &querytypes.PageResponse{Total: totalSize}}, nil
}

func (sk *StateKeeper) Backlinks(goCtx context.Context, req *types.QuerySearchRequest) (*types.QuerySearchResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	cidNum, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.Particle))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.Particle)
	}

	page, limit := uint32(0), uint32(10)
	if req.Pagination != nil {
		page, limit = req.Pagination.Page, req.Pagination.PerPage
	}
	rankedCidNumbers, totalSize, err := sk.index.Backlinks(cidNum, page, limit)
	if err != nil {
		panic(err)
	}

	result := make([]types.RankedParticle, 0, len(rankedCidNumbers))
	for _, c := range rankedCidNumbers {
		result = append(result, types.RankedParticle{Particle: string(sk.graphKeeper.GetCid(ctx, c.GetNumber())), Rank: c.GetRank()})
	}

	return &types.QuerySearchResponse{Result: result, Pagination: &querytypes.PageResponse{Total: totalSize}}, nil
}

func (sk *StateKeeper) Top(goCtx context.Context, req *querytypes.QueryTopRequest) (*types.QuerySearchResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	if req.Pagination.PerPage > uint32(1000) {
		return nil, sdkerrors.ErrInvalidRequest
	}
	page, limit := req.Pagination.Page, req.Pagination.PerPage
	topRankedCidNumbers, totalSize, err := sk.index.Top(page, limit)
	if err != nil {
		panic(err)
	}

	result := make([]types.RankedParticle, 0, len(topRankedCidNumbers))
	for _, c := range topRankedCidNumbers {
		result = append(result, types.RankedParticle{Particle: string(sk.graphKeeper.GetCid(ctx, c.GetNumber())), Rank: c.GetRank()})
	}

	return &types.QuerySearchResponse{Result: result, Pagination: &querytypes.PageResponse{Total: totalSize}}, nil
}

func (sk StateKeeper) IsLinkExist(goCtx context.Context, req *types.QueryIsLinkExistRequest) (*types.QueryLinkExistResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	addr, err := sdk.AccAddressFromBech32(req.Address)
	if err != nil {
		return nil, errorsmod.Wrap(sdkerrors.ErrInvalidAddress, err.Error())
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	cidNumFrom, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.From))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.From)
	}

	cidNumTo, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.To))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.To)
	}

	var accountNum uint64
	account := sk.accountKeeper.GetAccount(ctx, addr)
	if account != nil {
		accountNum = account.GetAccountNumber()
	} else {
		return nil, errorsmod.Wrap(sdkerrors.ErrInvalidAddress, "Invalid neuron address")
	}

	exists := sk.graphIndexedKeeper.IsLinkExist(graphtypes.CompactLink{
		From:    uint64(cidNumFrom),
		To:      uint64(cidNumTo),
		Account: accountNum,
	})

	return &types.QueryLinkExistResponse{Exist: exists}, nil
}

func (sk StateKeeper) IsAnyLinkExist(goCtx context.Context, req *types.QueryIsAnyLinkExistRequest) (*types.QueryLinkExistResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	cidNumFrom, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.From))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.From)
	}

	cidNumTo, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.To))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.To)
	}

	exists := sk.graphIndexedKeeper.IsAnyLinkExist(cidNumFrom, cidNumTo)

	return &types.QueryLinkExistResponse{Exist: exists}, nil
}

// ParticleNegentropy returns the per-particle contribution to focus entropy.
// Computed at query time from RankValues: -πi × log2(πi) scaled by 1e15.
// No state is stored; this is a pure function of the current rank distribution.
func (sk *StateKeeper) ParticleNegentropy(goCtx context.Context, req *types.QueryNegentropyPartilceRequest) (*types.QueryNegentropyParticleResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	cidNum, exist := sk.graphKeeper.GetCidNumber(ctx, graphtypes.Cid(req.Particle))
	if !exist {
		return nil, errorsmod.Wrap(graphtypes.ErrCidNotFound, req.Particle)
	}

	rankValues := sk.networkCidRank.RankValues
	if rankValues == nil || uint64(cidNum) >= uint64(len(rankValues)) {
		return &types.QueryNegentropyParticleResponse{Entropy: 0}, nil
	}

	totalRank := uint64(0)
	for _, r := range rankValues {
		totalRank += r
	}
	if totalRank == 0 {
		return &types.QueryNegentropyParticleResponse{Entropy: 0}, nil
	}

	ri := rankValues[cidNum]
	if ri == 0 {
		return &types.QueryNegentropyParticleResponse{Entropy: 0}, nil
	}

	// -πi × log2(πi), scaled to uint64 by 1e15
	pi := float64(ri) / float64(totalRank)
	contribution := -pi * math.Log2(pi)
	entropy := uint64(contribution * 1e15)

	return &types.QueryNegentropyParticleResponse{Entropy: entropy}, nil
}

// Negentropy returns system-wide negentropy: J(π) = log2(n) − H(π).
// Computed at query time from RankValues. No state is stored.
// H(π) = −Σ πi × log2(πi), where πi = rankValue_i / Σ rankValues.
// J(π) measures how far the focus distribution deviates from uniform.
func (sk *StateKeeper) Negentropy(_ context.Context, _ *types.QueryNegentropyRequest) (*types.QueryNegentropyResponse, error) {
	rankValues := sk.networkCidRank.RankValues
	n := uint64(len(rankValues))
	if n == 0 {
		return &types.QueryNegentropyResponse{Negentropy: 0}, nil
	}

	totalRank := uint64(0)
	for _, r := range rankValues {
		totalRank += r
	}
	if totalRank == 0 {
		return &types.QueryNegentropyResponse{Negentropy: 0}, nil
	}

	// H(π) = −Σ πi × log2(πi)
	h := 0.0
	for _, r := range rankValues {
		if r == 0 {
			continue
		}
		pi := float64(r) / float64(totalRank)
		h -= pi * math.Log2(pi)
	}

	// J(π) = log2(n) − H(π)
	logN := math.Log2(float64(n))
	negentropy := logN - h
	if negentropy < 0 {
		negentropy = 0
	}

	// Scale to uint64 by 1e15 (same convention as rank values)
	result := uint64(negentropy * 1e15)
	return &types.QueryNegentropyResponse{Negentropy: result}, nil
}

// Deprecated: karma removed. Stub kept for protobuf interface compatibility.
func (sk *StateKeeper) Karma(_ context.Context, _ *types.QueryKarmaRequest) (*types.QueryKarmaResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "karma removed")
}
