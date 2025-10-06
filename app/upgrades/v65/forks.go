package v65

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cybercongress/go-cyber/v6/app/keepers"
)

func RunForkLogic(ctx sdk.Context, keepers *keepers.AppKeepers) {
	logger := ctx.Logger().With("upgrade", UpgradeName)

	cidCount := keepers.GraphKeeper.GetCidsCount(ctx)
	keepers.RankKeeper.SetDebugMerkleTrees(ctx, cidCount)

	logger.Info("Applying emergency hard fork for v65")
}
