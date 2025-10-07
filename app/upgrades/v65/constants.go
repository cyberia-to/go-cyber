package v65

import (
	"github.com/cybercongress/go-cyber/v6/app/upgrades"
)

const (
	UpgradeName = "v65"

	UpgradeHeight = 20_810_056
)

var Fork = upgrades.Fork{
	UpgradeName:    UpgradeName,
	UpgradeHeight:  UpgradeHeight,
	BeginForkLogic: RunForkLogic,
}
