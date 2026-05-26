package types

import (
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
)

// Contract type
type Contract struct {
	*wasmtypes.ContractInfo
	Address     string
	CreatedTime string
}

// NewContract instance
func NewContract(contract *wasmtypes.ContractInfo, address string, created string) Contract {
	return Contract{
		ContractInfo: contract,
		Address:      address,
		CreatedTime:  created,
	}
}

// Code type
type Code struct {
	CodeID      string
	Creator     string
	CreatedTime string
	Height      int64
}

// NewCode instance
func NewCode(
	codeID string,
	creator string,
	createdTime string,
	height int64,
) Code {
	return Code{codeID, creator, createdTime, height}
}
