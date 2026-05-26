// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::tokenfactory::msg::TokenFactoryMsg;
use crate::tokenfactory::msg::TokenFactoryMsg::{
    BurnTokens, ChangeAdmin, CreateDenom, ForceTransfer, MintTokens, SetMetadata,
};
use crate::tokenfactory::types::Metadata;
use crate::types::{Link, Load, Trigger};
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Coin, CosmosMsg, CustomMsg, Decimal, Uint128};

impl From<CyberMsg> for CosmosMsg<CyberMsg> {
    fn from(msg: CyberMsg) -> CosmosMsg<CyberMsg> {
        CosmosMsg::Custom(msg)
    }
}

impl CustomMsg for CyberMsg {}

#[cw_serde]
pub enum CyberMsg {
    Cyberlink {
        neuron: String,
        links: Vec<Link>,
    },
    Investmint {
        neuron: String,
        amount: Coin,
        resource: String,
        length: u64,
    },
    CreateEnergyRoute {
        source: String,
        destination: String,
        name: String,
    },
    EditEnergyRoute {
        source: String,
        destination: String,
        value: Coin,
    },
    EditEnergyRouteName {
        source: String,
        destination: String,
        name: String,
    },
    DeleteEnergyRoute {
        source: String,
        destination: String,
    },
    CreateThought {
        program: String,
        trigger: Trigger,
        load: Load,
        name: String,
        particle: String,
    },
    ForgetThought {
        program: String,
        name: String,
    },
    ChangeThoughtInput {
        program: String,
        name: String,
        input: String,
    },
    ChangeThoughtPeriod {
        program: String,
        name: String,
        period: u64,
    },
    ChangeThoughtBlock {
        program: String,
        name: String,
        block: u64,
    },
    CreatePool {
        pool_creator_address: String,
        pool_type_id: u32,
        deposit_coins: Vec<Coin>,
    },
    DepositWithinBatch {
        depositor_address: String,
        pool_id: u64,
        deposit_coins: Vec<Coin>,
    },
    WithdrawWithinBatch {
        withdrawer_address: String,
        pool_id: u64,
        pool_coin: Coin,
    },
    SwapWithinBatch {
        swap_requester_address: String,
        pool_id: u64,
        swap_type_id: u32,
        offer_coin: Coin,
        demand_coin_denom: String,
        offer_coin_fee: Coin,
        order_price: Decimal,
    },

    TokenFactory(TokenFactoryMsg),
}

impl CyberMsg {
    pub fn create_contract_denom(subdenom: String, metadata: Option<Metadata>) -> Self {
        Self::TokenFactory(CreateDenom { subdenom, metadata })
    }

    pub fn change_denom_admin(denom: String, new_admin_address: String) -> Self {
        Self::TokenFactory(ChangeAdmin {
            denom,
            new_admin_address,
        })
    }

    pub fn mint_contract_tokens(denom: String, amount: Uint128, mint_to_address: String) -> Self {
        Self::TokenFactory(MintTokens {
            denom,
            amount,
            mint_to_address,
        })
    }

    pub fn burn_contract_tokens(denom: String, amount: Uint128, burn_from_address: String) -> Self {
        Self::TokenFactory(BurnTokens {
            denom,
            amount,
            burn_from_address,
        })
    }

    pub fn force_transfer_tokens(
        denom: String,
        amount: Uint128,
        from_address: String,
        to_address: String,
    ) -> Self {
        Self::TokenFactory(ForceTransfer {
            denom,
            amount,
            from_address,
            to_address,
        })
    }

    pub fn set_metadata(denom: String, metadata: Metadata) -> Self {
        Self::TokenFactory(SetMetadata { denom, metadata })
    }

    pub fn cyberlink(neuron: String, links: Vec<Link>) -> Self {
        Self::Cyberlink { neuron, links }
    }

    pub fn investmint(neuron: String, amount: Coin, resource: String, length: u64) -> Self {
        Self::Investmint {
            neuron,
            amount,
            resource,
            length,
        }
    }

    pub fn create_energy_route(source: String, destination: String, name: String) -> Self {
        Self::CreateEnergyRoute {
            source,
            destination,
            name,
        }
    }

    pub fn edit_energy_route(source: String, destination: String, value: Coin) -> Self {
        Self::EditEnergyRoute {
            source,
            destination,
            value,
        }
    }

    pub fn edit_energy_route_name(source: String, destination: String, name: String) -> Self {
        Self::EditEnergyRouteName {
            source,
            destination,
            name: name,
        }
    }

    pub fn delete_energy_route(source: String, destination: String) -> Self {
        Self::DeleteEnergyRoute {
            source,
            destination,
        }
    }

    pub fn creat_thought(
        program: String,
        trigger: Trigger,
        load: Load,
        name: String,
        particle: String,
    ) -> Self {
        Self::CreateThought {
            program,
            trigger,
            load,
            name,
            particle,
        }
    }

    pub fn forget_thought(program: String, name: String) -> Self {
        Self::ForgetThought { program, name }
    }

    pub fn change_thought_input(program: String, name: String, input: String) -> Self {
        Self::ChangeThoughtInput {
            program,
            name,
            input,
        }
    }

    pub fn change_thought_period(program: String, name: String, period: u64) -> Self {
        Self::ChangeThoughtPeriod {
            program,
            name,
            period,
        }
    }

    pub fn change_thought_block(program: String, name: String, block: u64) -> Self {
        Self::ChangeThoughtBlock {
            program,
            name,
            block,
        }
    }

    pub fn create_pool(
        pool_creator_address: String,
        pool_type_id: u32,
        deposit_coins: Vec<Coin>,
    ) -> Self {
        Self::CreatePool {
            pool_creator_address,
            pool_type_id,
            deposit_coins,
        }
    }

    pub fn deposit_within_batch(
        depositor_address: String,
        pool_id: u64,
        deposit_coins: Vec<Coin>,
    ) -> Self {
        Self::DepositWithinBatch {
            depositor_address,
            pool_id,
            deposit_coins,
        }
    }

    pub fn withdraw_within_batch(
        withdrawer_address: String,
        pool_id: u64,
        pool_coin: Coin,
    ) -> Self {
        Self::WithdrawWithinBatch {
            withdrawer_address,
            pool_id,
            pool_coin,
        }
    }

    pub fn swap_within_batch(
        swap_requester_address: String,
        pool_id: u64,
        swap_type_id: u32,
        offer_coin: Coin,
        demand_coin_denom: String,
        offer_coin_fee: Coin,
        order_price: Decimal,
    ) -> Self {
        Self::SwapWithinBatch {
            swap_requester_address,
            pool_id,
            swap_type_id,
            offer_coin,
            demand_coin_denom,
            offer_coin_fee,
            order_price,
        }
    }
}
