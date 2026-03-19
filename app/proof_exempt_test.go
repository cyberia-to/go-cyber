package app

import (
	"testing"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
)

// mockTx implements sdk.Tx for testing isProofSubmission.
type mockTx struct {
	msgs []sdk.Msg
}

func (m mockTx) GetMsgs() []sdk.Msg         { return m.msgs }
func (m mockTx) ValidateBasic() error        { return nil }

func newExecMsg(contract string, msgJSON string) *wasmtypes.MsgExecuteContract {
	return &wasmtypes.MsgExecuteContract{
		Sender:   "bostrom1sender",
		Contract: contract,
		Msg:      wasmtypes.RawContractMessage(msgJSON),
	}
}

const mineContract = "bostrom123mine"

func makeDecorator(contracts ...string) ProofExemptDecorator {
	m := make(map[string]struct{}, len(contracts))
	for _, c := range contracts {
		m[c] = struct{}{}
	}
	return ProofExemptDecorator{exemptContracts: m}
}

// --- isProofSubmission tests ---

func TestIsProofSubmission_ValidSingle(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"abc","nonce":1,"miner_address":"bostrom1m","challenge":"def","difficulty":8,"timestamp":1700000000}}`),
	}}
	if !d.isProofSubmission(tx) {
		t.Fatal("expected valid single submit_proof to be recognized")
	}
}

func TestIsProofSubmission_ValidBatch(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"a1","nonce":1,"miner_address":"m1","challenge":"c1","difficulty":8,"timestamp":1}}`),
		newExecMsg(mineContract, `{"submit_proof":{"hash":"a2","nonce":2,"miner_address":"m1","challenge":"c2","difficulty":8,"timestamp":2}}`),
	}}
	if !d.isProofSubmission(tx) {
		t.Fatal("expected batch of submit_proof to be recognized")
	}
}

func TestIsProofSubmission_WrongContract(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg("bostrom1other", `{"submit_proof":{"hash":"abc"}}`),
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject non-exempt contract")
	}
}

func TestIsProofSubmission_WrongMessage(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"update_config":{"paused":true}}`),
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject non-submit_proof message")
	}
}

func TestIsProofSubmission_MixedMessages(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"abc"}}`),
		newExecMsg(mineContract, `{"update_config":{"paused":true}}`),
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject tx with mixed message types")
	}
}

func TestIsProofSubmission_NonWasmMessage(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		&banktypes.MsgSend{FromAddress: "a", ToAddress: "b"},
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject non-wasm messages")
	}
}

func TestIsProofSubmission_ProofPlusNonWasm(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"abc"}}`),
		&banktypes.MsgSend{FromAddress: "a", ToAddress: "b"},
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject proof bundled with non-wasm message")
	}
}

func TestIsProofSubmission_EmptyTx(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject empty tx")
	}
}

func TestIsProofSubmission_NoExemptContracts(t *testing.T) {
	d := makeDecorator() // empty list
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"abc"}}`),
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject when no contracts are exempt")
	}
}

func TestIsProofSubmission_InvalidJSON(t *testing.T) {
	d := makeDecorator(mineContract)
	tx := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `not json`),
	}}
	if d.isProofSubmission(tx) {
		t.Fatal("should reject invalid JSON")
	}
}

func TestIsProofSubmission_MultipleExemptContracts(t *testing.T) {
	other := "bostrom456mine"
	d := makeDecorator(mineContract, other)

	tx1 := mockTx{msgs: []sdk.Msg{
		newExecMsg(mineContract, `{"submit_proof":{"hash":"abc"}}`),
	}}
	tx2 := mockTx{msgs: []sdk.Msg{
		newExecMsg(other, `{"submit_proof":{"hash":"def"}}`),
	}}
	if !d.isProofSubmission(tx1) {
		t.Fatal("should accept first exempt contract")
	}
	if !d.isProofSubmission(tx2) {
		t.Fatal("should accept second exempt contract")
	}
}
