//@ts-nocheck
import * as _105 from "./abci/types";
import * as _106 from "./crypto/keys";
import * as _107 from "./crypto/proof";
import * as _108 from "./libs/bits/types";
import * as _109 from "./p2p/types";
import * as _110 from "./types/block";
import * as _111 from "./types/evidence";
import * as _112 from "./types/params";
import * as _113 from "./types/types";
import * as _114 from "./types/validator";
import * as _115 from "./version/types";
export namespace tendermint {
  export const abci = {
    ..._105
  };
  export const crypto = {
    ..._106,
    ..._107
  };
  export namespace libs {
    export const bits = {
      ..._108
    };
  }
  export const p2p = {
    ..._109
  };
  export const types = {
    ..._110,
    ..._111,
    ..._112,
    ..._113,
    ..._114
  };
  export const version = {
    ..._115
  };
}