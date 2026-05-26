//@ts-nocheck
import * as _62 from "./bandwidth/v1beta1/genesis";
import * as _63 from "./bandwidth/v1beta1/query";
import * as _64 from "./bandwidth/v1beta1/tx";
import * as _65 from "./bandwidth/v1beta1/types";
import * as _66 from "./clock/v1/clock";
import * as _67 from "./clock/v1/genesis";
import * as _68 from "./clock/v1/query";
import * as _69 from "./clock/v1/tx";
import * as _70 from "./dmn/v1beta1/genesis";
import * as _71 from "./dmn/v1beta1/query";
import * as _72 from "./dmn/v1beta1/tx";
import * as _73 from "./dmn/v1beta1/types";
import * as _74 from "./graph/v1beta1/query";
import * as _75 from "./graph/v1beta1/tx";
import * as _76 from "./graph/v1beta1/types";
import * as _77 from "./grid/v1beta1/genesis";
import * as _78 from "./grid/v1beta1/query";
import * as _79 from "./grid/v1beta1/tx";
import * as _80 from "./grid/v1beta1/types";
import * as _81 from "./liquidity/v1beta1/genesis";
import * as _82 from "./liquidity/v1beta1/liquidity";
import * as _83 from "./liquidity/v1beta1/query";
import * as _84 from "./liquidity/v1beta1/tx";
import * as _85 from "./rank/v1beta1/genesis";
import * as _86 from "./rank/v1beta1/pagination";
import * as _87 from "./rank/v1beta1/query";
import * as _88 from "./rank/v1beta1/tx";
import * as _89 from "./rank/v1beta1/types";
import * as _90 from "./resources/v1beta1/genesis";
import * as _91 from "./resources/v1beta1/query";
import * as _92 from "./resources/v1beta1/tx";
import * as _93 from "./resources/v1beta1/types";
import * as _167 from "./bandwidth/v1beta1/tx.amino";
import * as _168 from "./clock/v1/tx.amino";
import * as _169 from "./dmn/v1beta1/tx.amino";
import * as _170 from "./graph/v1beta1/tx.amino";
import * as _171 from "./grid/v1beta1/tx.amino";
import * as _172 from "./liquidity/v1beta1/tx.amino";
import * as _173 from "./rank/v1beta1/tx.amino";
import * as _174 from "./resources/v1beta1/tx.amino";
import * as _175 from "./bandwidth/v1beta1/tx.registry";
import * as _176 from "./clock/v1/tx.registry";
import * as _177 from "./dmn/v1beta1/tx.registry";
import * as _178 from "./graph/v1beta1/tx.registry";
import * as _179 from "./grid/v1beta1/tx.registry";
import * as _180 from "./liquidity/v1beta1/tx.registry";
import * as _181 from "./rank/v1beta1/tx.registry";
import * as _182 from "./resources/v1beta1/tx.registry";
import * as _183 from "./bandwidth/v1beta1/query.lcd";
import * as _184 from "./clock/v1/query.lcd";
import * as _185 from "./dmn/v1beta1/query.lcd";
import * as _186 from "./graph/v1beta1/query.lcd";
import * as _187 from "./grid/v1beta1/query.lcd";
import * as _188 from "./liquidity/v1beta1/query.lcd";
import * as _189 from "./rank/v1beta1/query.lcd";
import * as _190 from "./resources/v1beta1/query.lcd";
import * as _191 from "./bandwidth/v1beta1/query.rpc.Query";
import * as _192 from "./clock/v1/query.rpc.Query";
import * as _193 from "./dmn/v1beta1/query.rpc.Query";
import * as _194 from "./graph/v1beta1/query.rpc.Query";
import * as _195 from "./grid/v1beta1/query.rpc.Query";
import * as _196 from "./liquidity/v1beta1/query.rpc.Query";
import * as _197 from "./rank/v1beta1/query.rpc.Query";
import * as _198 from "./resources/v1beta1/query.rpc.Query";
import * as _199 from "./bandwidth/v1beta1/tx.rpc.msg";
import * as _200 from "./clock/v1/tx.rpc.msg";
import * as _201 from "./dmn/v1beta1/tx.rpc.msg";
import * as _202 from "./graph/v1beta1/tx.rpc.msg";
import * as _203 from "./grid/v1beta1/tx.rpc.msg";
import * as _204 from "./liquidity/v1beta1/tx.rpc.msg";
import * as _205 from "./rank/v1beta1/tx.rpc.msg";
import * as _206 from "./resources/v1beta1/tx.rpc.msg";
import * as _218 from "./lcd";
import * as _219 from "./rpc.query";
import * as _220 from "./rpc.tx";
export namespace cyber {
  export namespace bandwidth {
    export const v1beta1 = {
      ..._62,
      ..._63,
      ..._64,
      ..._65,
      ..._167,
      ..._175,
      ..._183,
      ..._191,
      ..._199
    };
  }
  export namespace clock {
    export const v1 = {
      ..._66,
      ..._67,
      ..._68,
      ..._69,
      ..._168,
      ..._176,
      ..._184,
      ..._192,
      ..._200
    };
  }
  export namespace dmn {
    export const v1beta1 = {
      ..._70,
      ..._71,
      ..._72,
      ..._73,
      ..._169,
      ..._177,
      ..._185,
      ..._193,
      ..._201
    };
  }
  export namespace graph {
    export const v1beta1 = {
      ..._74,
      ..._75,
      ..._76,
      ..._170,
      ..._178,
      ..._186,
      ..._194,
      ..._202
    };
  }
  export namespace grid {
    export const v1beta1 = {
      ..._77,
      ..._78,
      ..._79,
      ..._80,
      ..._171,
      ..._179,
      ..._187,
      ..._195,
      ..._203
    };
  }
  export namespace liquidity {
    export const v1beta1 = {
      ..._81,
      ..._82,
      ..._83,
      ..._84,
      ..._172,
      ..._180,
      ..._188,
      ..._196,
      ..._204
    };
  }
  export namespace rank {
    export const v1beta1 = {
      ..._85,
      ..._86,
      ..._87,
      ..._88,
      ..._89,
      ..._173,
      ..._181,
      ..._189,
      ..._197,
      ..._205
    };
  }
  export namespace resources {
    export const v1beta1 = {
      ..._90,
      ..._91,
      ..._92,
      ..._93,
      ..._174,
      ..._182,
      ..._190,
      ..._198,
      ..._206
    };
  }
  export const ClientFactory = {
    ..._218,
    ..._219,
    ..._220
  };
}