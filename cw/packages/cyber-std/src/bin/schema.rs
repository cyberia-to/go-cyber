// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use std::env::current_dir;
use std::fs::create_dir_all;

use cosmwasm_schema::{export_schema, remove_schemas, schema_for};
use cyber_std::{query_res::*, CyberMsg, CyberQuery};

fn main() {
    let mut out_dir = current_dir().unwrap();
    out_dir.push("schema");
    create_dir_all(&out_dir).unwrap();
    remove_schemas(&out_dir).unwrap();

    export_schema(&schema_for!(CyberMsg), &out_dir);
    export_schema(&schema_for!(CyberQuery), &out_dir);
    export_schema(&schema_for!(ParticleRankResponse), &out_dir);
    export_schema(&schema_for!(GraphStatsResponse), &out_dir);
    export_schema(&schema_for!(ThoughtResponse), &out_dir);
    export_schema(&schema_for!(ThoughtStatsResponse), &out_dir);
    export_schema(&schema_for!(ThoughtsFeesResponse), &out_dir);
    export_schema(&schema_for!(RoutesResponse), &out_dir);
    export_schema(&schema_for!(RoutedEnergyResponse), &out_dir);
    export_schema(&schema_for!(RouteResponse), &out_dir);
    export_schema(&schema_for!(BandwidthPriceResponse), &out_dir);
    export_schema(&schema_for!(BandwidthLoadResponse), &out_dir);
    export_schema(&schema_for!(TotalBandwidthResponse), &out_dir);
    export_schema(&schema_for!(NeuronBandwidthResponse), &out_dir);
    export_schema(&schema_for!(PoolParamsResponse), &out_dir);
    export_schema(&schema_for!(PoolLiquidityResponse), &out_dir);
    export_schema(&schema_for!(PoolSupplyResponse), &out_dir);
    export_schema(&schema_for!(PoolPriceResponse), &out_dir);
    export_schema(&schema_for!(PoolAddressResponse), &out_dir);
}
