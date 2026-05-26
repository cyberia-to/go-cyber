// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use std::cmp::max;
use std::fmt::Debug;
use std::ops::{Deref, DerefMut};

use anyhow::{bail, Result as AnyResult};
use cosmwasm_std::testing::{MockApi, MockStorage};
use cosmwasm_std::{
    Addr, Api, Binary, BlockInfo, CustomQuery, Empty, Querier, QuerierResult, Storage,
};
use cw_multi_test::{
    App, AppResponse, BankKeeper, BasicAppBuilder, CosmosRouter, Module, WasmKeeper,
};
use schemars::JsonSchema;
use serde::de::DeserializeOwned;

use cyber_std::CyberMsg;

pub(crate) const BLOCK_TIME: u64 = 5;

pub struct CyberModule {}

impl CyberModule {}
impl Module for CyberModule {
    type ExecT = CyberMsg;
    type QueryT = Empty;
    type SudoT = Empty;

    fn execute<ExecC, QueryC>(
        &self,
        _api: &dyn Api,
        _storage: &mut dyn Storage,
        _router: &dyn CosmosRouter<ExecC = ExecC, QueryC = QueryC>,
        _block: &BlockInfo,
        sender: Addr,
        msg: Self::ExecT,
    ) -> AnyResult<AppResponse>
    where
        ExecC: Debug + Clone + PartialEq + JsonSchema + DeserializeOwned + 'static,
        QueryC: CustomQuery + DeserializeOwned + 'static,
    {
        // Mock all CyberMsg variants as no-ops for testing.
        // TokenFactory (CreateDenom, MintTokens, BurnTokens, etc.) and
        // chain-specific messages (Cyberlink, Investmint, etc.) all return success.
        // Note: MintTokens/BurnTokens do NOT actually modify bank balances;
        // tests needing real native balances should use init_balance or BankSudo.
        let _ = (sender, msg);
        Ok(AppResponse::default())
    }

    fn query(
        &self,
        _api: &dyn Api,
        _storage: &dyn Storage,
        _querier: &dyn Querier,
        _block: &BlockInfo,
        _request: Self::QueryT,
    ) -> AnyResult<Binary> {
        bail!("query not implemented for CyberModule")
    }

    fn sudo<ExecC, QueryC>(
        &self,
        _api: &dyn Api,
        _storage: &mut dyn Storage,
        _router: &dyn CosmosRouter<ExecC = ExecC, QueryC = QueryC>,
        _block: &BlockInfo,
        _msg: Self::SudoT,
    ) -> AnyResult<AppResponse>
    where
        ExecC: Debug + Clone + PartialEq + JsonSchema + DeserializeOwned + 'static,
        QueryC: CustomQuery + DeserializeOwned + 'static,
    {
        bail!("sudo not implemented for CyberModule")
    }
}

pub type CyberAppWrapped =
    App<BankKeeper, MockApi, MockStorage, CyberModule, WasmKeeper<CyberMsg, Empty>>;

pub struct CyberApp(CyberAppWrapped);

impl Deref for CyberApp {
    type Target = CyberAppWrapped;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for CyberApp {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl Querier for CyberApp {
    fn raw_query(&self, bin_request: &[u8]) -> QuerierResult {
        self.0.raw_query(bin_request)
    }
}

impl Default for CyberApp {
    fn default() -> Self {
        Self::new()
    }
}

impl CyberApp {
    pub fn new() -> Self {
        Self(
            BasicAppBuilder::<CyberMsg, Empty>::new_custom()
                .with_custom(CyberModule {})
                .build(|_router, _, _storage| {}),
        )
    }

    pub fn block_info(&self) -> BlockInfo {
        self.0.block_info()
    }

    pub fn advance_blocks(&mut self, blocks: u64) {
        self.update_block(|block| {
            block.time = block.time.plus_seconds(BLOCK_TIME * blocks);
            block.height += blocks;
        });
    }

    pub fn advance_seconds(&mut self, seconds: u64) {
        self.update_block(|block| {
            block.time = block.time.plus_seconds(seconds);
            block.height += max(1, seconds / BLOCK_TIME);
        });
    }

    pub fn next_block(&mut self) {
        self.advance_blocks(1)
    }
}
