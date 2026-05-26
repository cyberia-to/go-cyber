//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgCreateRoute, MsgEditRoute, MsgDeleteRoute, MsgEditRouteName, MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cyber.grid.v1beta1.MsgCreateRoute", MsgCreateRoute], ["/cyber.grid.v1beta1.MsgEditRoute", MsgEditRoute], ["/cyber.grid.v1beta1.MsgDeleteRoute", MsgDeleteRoute], ["/cyber.grid.v1beta1.MsgEditRouteName", MsgEditRouteName], ["/cyber.grid.v1beta1.MsgUpdateParams", MsgUpdateParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    createRoute(value: MsgCreateRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
        value: MsgCreateRoute.encode(value).finish()
      };
    },
    editRoute(value: MsgEditRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
        value: MsgEditRoute.encode(value).finish()
      };
    },
    deleteRoute(value: MsgDeleteRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
        value: MsgDeleteRoute.encode(value).finish()
      };
    },
    editRouteName(value: MsgEditRouteName) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
        value: MsgEditRouteName.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    createRoute(value: MsgCreateRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
        value
      };
    },
    editRoute(value: MsgEditRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
        value
      };
    },
    deleteRoute(value: MsgDeleteRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
        value
      };
    },
    editRouteName(value: MsgEditRouteName) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
        value
      };
    }
  },
  toJSON: {
    createRoute(value: MsgCreateRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
        value: MsgCreateRoute.toJSON(value)
      };
    },
    editRoute(value: MsgEditRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
        value: MsgEditRoute.toJSON(value)
      };
    },
    deleteRoute(value: MsgDeleteRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
        value: MsgDeleteRoute.toJSON(value)
      };
    },
    editRouteName(value: MsgEditRouteName) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
        value: MsgEditRouteName.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    }
  },
  fromJSON: {
    createRoute(value: any) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
        value: MsgCreateRoute.fromJSON(value)
      };
    },
    editRoute(value: any) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
        value: MsgEditRoute.fromJSON(value)
      };
    },
    deleteRoute(value: any) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
        value: MsgDeleteRoute.fromJSON(value)
      };
    },
    editRouteName(value: any) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
        value: MsgEditRouteName.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    }
  },
  fromPartial: {
    createRoute(value: MsgCreateRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
        value: MsgCreateRoute.fromPartial(value)
      };
    },
    editRoute(value: MsgEditRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
        value: MsgEditRoute.fromPartial(value)
      };
    },
    deleteRoute(value: MsgDeleteRoute) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
        value: MsgDeleteRoute.fromPartial(value)
      };
    },
    editRouteName(value: MsgEditRouteName) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
        value: MsgEditRouteName.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};