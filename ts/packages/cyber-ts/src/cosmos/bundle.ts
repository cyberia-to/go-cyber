//@ts-nocheck
import * as _2 from "./auth/v1beta1/auth";
import * as _3 from "./auth/v1beta1/genesis";
import * as _4 from "./auth/v1beta1/query";
import * as _5 from "./authz/v1beta1/authz";
import * as _6 from "./authz/v1beta1/event";
import * as _7 from "./authz/v1beta1/genesis";
import * as _8 from "./authz/v1beta1/query";
import * as _9 from "./authz/v1beta1/tx";
import * as _10 from "./bank/v1beta1/authz";
import * as _11 from "./bank/v1beta1/bank";
import * as _12 from "./bank/v1beta1/genesis";
import * as _13 from "./bank/v1beta1/query";
import * as _14 from "./bank/v1beta1/tx";
import * as _15 from "./base/abci/v1beta1/abci";
import * as _16 from "./base/query/v1beta1/pagination";
import * as _17 from "./base/reflection/v2alpha1/reflection";
import * as _18 from "./base/v1beta1/coin";
import * as _19 from "./crypto/ed25519/keys";
import * as _20 from "./crypto/hd/v1/hd";
import * as _21 from "./crypto/keyring/v1/record";
import * as _22 from "./crypto/multisig/keys";
import * as _23 from "./crypto/secp256k1/keys";
import * as _24 from "./crypto/secp256r1/keys";
import * as _25 from "./distribution/v1beta1/distribution";
import * as _26 from "./distribution/v1beta1/genesis";
import * as _27 from "./distribution/v1beta1/query";
import * as _28 from "./distribution/v1beta1/tx";
import * as _29 from "./gov/v1/genesis";
import * as _30 from "./gov/v1/gov";
import * as _31 from "./gov/v1/query";
import * as _32 from "./gov/v1/tx";
import * as _33 from "./gov/v1beta1/genesis";
import * as _34 from "./gov/v1beta1/gov";
import * as _35 from "./gov/v1beta1/query";
import * as _36 from "./gov/v1beta1/tx";
import * as _37 from "./mint/v1beta1/genesis";
import * as _38 from "./mint/v1beta1/mint";
import * as _39 from "./mint/v1beta1/query";
import * as _40 from "./params/v1beta1/params";
import * as _41 from "./params/v1beta1/query";
import * as _42 from "./staking/v1beta1/authz";
import * as _43 from "./staking/v1beta1/genesis";
import * as _44 from "./staking/v1beta1/query";
import * as _45 from "./staking/v1beta1/staking";
import * as _46 from "./staking/v1beta1/tx";
import * as _47 from "./tx/signing/v1beta1/signing";
import * as _48 from "./tx/v1beta1/service";
import * as _49 from "./tx/v1beta1/tx";
import * as _50 from "./upgrade/v1beta1/query";
import * as _51 from "./upgrade/v1beta1/tx";
import * as _52 from "./upgrade/v1beta1/upgrade";
import * as _53 from "./vesting/v1beta1/tx";
import * as _54 from "./vesting/v1beta1/vesting";
import * as _116 from "./authz/v1beta1/tx.amino";
import * as _117 from "./bank/v1beta1/tx.amino";
import * as _118 from "./distribution/v1beta1/tx.amino";
import * as _119 from "./gov/v1/tx.amino";
import * as _120 from "./gov/v1beta1/tx.amino";
import * as _121 from "./staking/v1beta1/tx.amino";
import * as _122 from "./upgrade/v1beta1/tx.amino";
import * as _123 from "./vesting/v1beta1/tx.amino";
import * as _124 from "./authz/v1beta1/tx.registry";
import * as _125 from "./bank/v1beta1/tx.registry";
import * as _126 from "./distribution/v1beta1/tx.registry";
import * as _127 from "./gov/v1/tx.registry";
import * as _128 from "./gov/v1beta1/tx.registry";
import * as _129 from "./staking/v1beta1/tx.registry";
import * as _130 from "./upgrade/v1beta1/tx.registry";
import * as _131 from "./vesting/v1beta1/tx.registry";
import * as _132 from "./auth/v1beta1/query.lcd";
import * as _133 from "./authz/v1beta1/query.lcd";
import * as _134 from "./bank/v1beta1/query.lcd";
import * as _135 from "./distribution/v1beta1/query.lcd";
import * as _136 from "./gov/v1/query.lcd";
import * as _137 from "./gov/v1beta1/query.lcd";
import * as _138 from "./mint/v1beta1/query.lcd";
import * as _139 from "./params/v1beta1/query.lcd";
import * as _140 from "./staking/v1beta1/query.lcd";
import * as _141 from "./tx/v1beta1/service.lcd";
import * as _142 from "./upgrade/v1beta1/query.lcd";
import * as _143 from "./auth/v1beta1/query.rpc.Query";
import * as _144 from "./authz/v1beta1/query.rpc.Query";
import * as _145 from "./bank/v1beta1/query.rpc.Query";
import * as _146 from "./distribution/v1beta1/query.rpc.Query";
import * as _147 from "./gov/v1/query.rpc.Query";
import * as _148 from "./gov/v1beta1/query.rpc.Query";
import * as _149 from "./mint/v1beta1/query.rpc.Query";
import * as _150 from "./params/v1beta1/query.rpc.Query";
import * as _151 from "./staking/v1beta1/query.rpc.Query";
import * as _152 from "./tx/v1beta1/service.rpc.Service";
import * as _153 from "./upgrade/v1beta1/query.rpc.Query";
import * as _154 from "./authz/v1beta1/tx.rpc.msg";
import * as _155 from "./bank/v1beta1/tx.rpc.msg";
import * as _156 from "./distribution/v1beta1/tx.rpc.msg";
import * as _157 from "./gov/v1/tx.rpc.msg";
import * as _158 from "./gov/v1beta1/tx.rpc.msg";
import * as _159 from "./staking/v1beta1/tx.rpc.msg";
import * as _160 from "./upgrade/v1beta1/tx.rpc.msg";
import * as _161 from "./vesting/v1beta1/tx.rpc.msg";
import * as _212 from "./lcd";
import * as _213 from "./rpc.query";
import * as _214 from "./rpc.tx";
export namespace cosmos {
  export namespace auth {
    export const v1beta1 = {
      ..._2,
      ..._3,
      ..._4,
      ..._132,
      ..._143
    };
  }
  export namespace authz {
    export const v1beta1 = {
      ..._5,
      ..._6,
      ..._7,
      ..._8,
      ..._9,
      ..._116,
      ..._124,
      ..._133,
      ..._144,
      ..._154
    };
  }
  export namespace bank {
    export const v1beta1 = {
      ..._10,
      ..._11,
      ..._12,
      ..._13,
      ..._14,
      ..._117,
      ..._125,
      ..._134,
      ..._145,
      ..._155
    };
  }
  export namespace base {
    export namespace abci {
      export const v1beta1 = {
        ..._15
      };
    }
    export namespace query {
      export const v1beta1 = {
        ..._16
      };
    }
    export namespace reflection {
      export const v2alpha1 = {
        ..._17
      };
    }
    export const v1beta1 = {
      ..._18
    };
  }
  export namespace crypto {
    export const ed25519 = {
      ..._19
    };
    export namespace hd {
      export const v1 = {
        ..._20
      };
    }
    export namespace keyring {
      export const v1 = {
        ..._21
      };
    }
    export const multisig = {
      ..._22
    };
    export const secp256k1 = {
      ..._23
    };
    export const secp256r1 = {
      ..._24
    };
  }
  export namespace distribution {
    export const v1beta1 = {
      ..._25,
      ..._26,
      ..._27,
      ..._28,
      ..._118,
      ..._126,
      ..._135,
      ..._146,
      ..._156
    };
  }
  export namespace gov {
    export const v1 = {
      ..._29,
      ..._30,
      ..._31,
      ..._32,
      ..._119,
      ..._127,
      ..._136,
      ..._147,
      ..._157
    };
    export const v1beta1 = {
      ..._33,
      ..._34,
      ..._35,
      ..._36,
      ..._120,
      ..._128,
      ..._137,
      ..._148,
      ..._158
    };
  }
  export namespace mint {
    export const v1beta1 = {
      ..._37,
      ..._38,
      ..._39,
      ..._138,
      ..._149
    };
  }
  export namespace params {
    export const v1beta1 = {
      ..._40,
      ..._41,
      ..._139,
      ..._150
    };
  }
  export namespace staking {
    export const v1beta1 = {
      ..._42,
      ..._43,
      ..._44,
      ..._45,
      ..._46,
      ..._121,
      ..._129,
      ..._140,
      ..._151,
      ..._159
    };
  }
  export namespace tx {
    export namespace signing {
      export const v1beta1 = {
        ..._47
      };
    }
    export const v1beta1 = {
      ..._48,
      ..._49,
      ..._141,
      ..._152
    };
  }
  export namespace upgrade {
    export const v1beta1 = {
      ..._50,
      ..._51,
      ..._52,
      ..._122,
      ..._130,
      ..._142,
      ..._153,
      ..._160
    };
  }
  export namespace vesting {
    export const v1beta1 = {
      ..._53,
      ..._54,
      ..._123,
      ..._131,
      ..._161
    };
  }
  export const ClientFactory = {
    ..._212,
    ..._213,
    ..._214
  };
}