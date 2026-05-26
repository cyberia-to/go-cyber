//@ts-nocheck
import * as _55 from "./wasm/v1/authz";
import * as _56 from "./wasm/v1/genesis";
import * as _57 from "./wasm/v1/ibc";
import * as _58 from "./wasm/v1/proposal";
import * as _59 from "./wasm/v1/query";
import * as _60 from "./wasm/v1/tx";
import * as _61 from "./wasm/v1/types";
import * as _162 from "./wasm/v1/tx.amino";
import * as _163 from "./wasm/v1/tx.registry";
import * as _164 from "./wasm/v1/query.lcd";
import * as _165 from "./wasm/v1/query.rpc.Query";
import * as _166 from "./wasm/v1/tx.rpc.msg";
import * as _215 from "./lcd";
import * as _216 from "./rpc.query";
import * as _217 from "./rpc.tx";
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = {
      ..._55,
      ..._56,
      ..._57,
      ..._58,
      ..._59,
      ..._60,
      ..._61,
      ..._162,
      ..._163,
      ..._164,
      ..._165,
      ..._166
    };
  }
  export const ClientFactory = {
    ..._215,
    ..._216,
    ..._217
  };
}