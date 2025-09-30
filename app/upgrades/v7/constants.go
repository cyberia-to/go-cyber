package v7

import (
	store "github.com/cosmos/cosmos-sdk/store/types"
	"github.com/cybercongress/go-cyber/v7/app/upgrades"
)

const UpgradeName = "v7"

var Upgrade = upgrades.Upgrade{
	UpgradeName:          UpgradeName,
	CreateUpgradeHandler: CreateV7UpgradeHandler,
	StoreUpgrades: store.StoreUpgrades{
		Added: []string{},
	},
}
