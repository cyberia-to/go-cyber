package app

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/ante"
)

// ProofExemptDecorator conditionally skips fee deduction for
// PoW mining proof submissions to whitelisted contracts.
//
// When a transaction contains ONLY MsgExecuteContract calls
// targeting an exempt contract with a "submit_proof" message,
// the decorator bypasses DeductFeeDecorator entirely.
// This allows miners to submit proofs without holding any tokens
// for gas — the mining contract deducts gas cost from rewards.
//
// For all other transactions, normal fee deduction applies.
type ProofExemptDecorator struct {
	inner           ante.DeductFeeDecorator
	exemptContracts map[string]struct{}
}

func NewProofExemptDecorator(
	opts ante.HandlerOptions,
	exemptContracts []string,
) ProofExemptDecorator {
	contracts := make(map[string]struct{}, len(exemptContracts))
	for _, c := range exemptContracts {
		if c != "" {
			contracts[c] = struct{}{}
		}
	}
	return ProofExemptDecorator{
		inner:           ante.NewDeductFeeDecorator(opts.AccountKeeper, opts.BankKeeper, opts.FeegrantKeeper, opts.TxFeeChecker),
		exemptContracts: contracts,
	}
}

func (d ProofExemptDecorator) AnteHandle(
	ctx sdk.Context,
	tx sdk.Tx,
	simulate bool,
	next sdk.AnteHandler,
) (sdk.Context, error) {
	if d.isProofSubmission(tx) {
		// Skip fee deduction — gas cost is handled inside the contract.
		// Still call next to continue the ante chain (sig verification, etc.).
		return next(ctx, tx, simulate)
	}
	return d.inner.AnteHandle(ctx, tx, simulate, next)
}

// isProofSubmission returns true when ALL messages in the tx are
// MsgExecuteContract targeting an exempt contract with "submit_proof".
func (d ProofExemptDecorator) isProofSubmission(tx sdk.Tx) bool {
	if len(d.exemptContracts) == 0 {
		return false
	}

	msgs := tx.GetMsgs()
	if len(msgs) == 0 {
		return false
	}

	for _, msg := range msgs {
		execMsg, ok := msg.(*wasmtypes.MsgExecuteContract)
		if !ok {
			return false
		}

		if _, exempt := d.exemptContracts[execMsg.Contract]; !exempt {
			return false
		}

		// Parse just the top-level keys to check for "submit_proof"
		var payload map[string]json.RawMessage
		if err := json.Unmarshal(execMsg.Msg, &payload); err != nil {
			return false
		}
		if _, ok := payload["submit_proof"]; !ok {
			return false
		}
	}

	return true
}
