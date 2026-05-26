export enum CyberRegistryTypes {
  MsgCyberlink = "/cyber.graph.v1beta1.MsgCyberlink",
  MsgInvestmint = "/cyber.resources.v1beta1.MsgInvestmint",
  MsgCreateRoute = "/cyber.grid.v1beta1.MsgCreateRoute",
  MsgEditRoute = "/cyber.grid.v1beta1.MsgEditRoute",
  MsgEditRouteName = "/cyber.grid.v1beta1.MsgEditRouteName",
  MsgDeleteRoute = "/cyber.grid.v1beta1.MsgDeleteRoute",
}

export enum CosmosRegistryTypes {
  MsgDeposit = "/cosmos.gov.v1beta1.MsgDeposit",
  MsgExec = "/cosmos.authz.v1beta1.MsgExec",
  MsgGrant = "/cosmos.authz.v1beta1.MsgGrant",
  MsgRevoke = "/cosmos.authz.v1beta1.MsgRevoke",
}

export enum CosmwasmRegistryTypes {
  MsgClearAdmin = "/cosmwasm.wasm.v1beta1.MsgClearAdmin",
  MsgMigrateContract = "/cosmwasm.wasm.v1beta1.MsgMigrateContract",
  MsgUpdateAdmin = "/cosmwasm.wasm.v1beta1.MsgUpdateAdmin",
  MsgExecuteContract = "/cosmwasm.wasm.v1.MsgExecuteContract",
  MsgInstantiateContract = "/cosmwasm.wasm.v1.MsgInstantiateContract",
  MsgStoreCode = "/cosmwasm.wasm.v1.MsgStoreCode",
}

export enum TendermintRegistryTypes {
  MsgSwapWithinBatch = "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch",
  MsgDepositWithinBatch = "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch",
  MsgWithdrawWithinBatch = "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch",
  MsgCreatePool = "/tendermint.liquidity.v1beta1.MsgCreatePool",
}

export const RegistryTypes = {
  cyber: CyberRegistryTypes,
  cosmos: CosmosRegistryTypes,
  cosmwasm: CosmwasmRegistryTypes,
  tendermint: TendermintRegistryTypes,
};
