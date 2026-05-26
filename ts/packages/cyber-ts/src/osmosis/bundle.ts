//@ts-nocheck
import * as _100 from "./tokenfactory/v1beta1/authority_metadata";
import * as _101 from "./tokenfactory/v1beta1/genesis";
import * as _102 from "./tokenfactory/v1beta1/params";
import * as _103 from "./tokenfactory/v1beta1/query";
import * as _104 from "./tokenfactory/v1beta1/tx";
import * as _207 from "./tokenfactory/v1beta1/tx.amino";
import * as _208 from "./tokenfactory/v1beta1/tx.registry";
import * as _209 from "./tokenfactory/v1beta1/query.lcd";
import * as _210 from "./tokenfactory/v1beta1/query.rpc.Query";
import * as _211 from "./tokenfactory/v1beta1/tx.rpc.msg";
import * as _221 from "./lcd";
import * as _222 from "./rpc.query";
import * as _223 from "./rpc.tx";
export namespace osmosis {
  export namespace tokenfactory {
    export const v1beta1 = {
      ..._100,
      ..._101,
      ..._102,
      ..._103,
      ..._104,
      ..._207,
      ..._208,
      ..._209,
      ..._210,
      ..._211
    };
  }
  export const ClientFactory = {
    ..._221,
    ..._222,
    ..._223
  };
}