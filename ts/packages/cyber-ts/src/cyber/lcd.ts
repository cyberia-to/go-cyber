//@ts-nocheck
import { LCDClient } from "@cosmology/lcd";
export const createLCDClient = async ({
  restEndpoint
}: {
  restEndpoint: string;
}) => {
  const requestClient = new LCDClient({
    restEndpoint
  });
  return {
    cosmos: {
      auth: {
        v1beta1: new (await import("../cosmos/auth/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      authz: {
        v1beta1: new (await import("../cosmos/authz/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      bank: {
        v1beta1: new (await import("../cosmos/bank/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      distribution: {
        v1beta1: new (await import("../cosmos/distribution/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      gov: {
        v1: new (await import("../cosmos/gov/v1/query.lcd")).LCDQueryClient({
          requestClient
        }),
        v1beta1: new (await import("../cosmos/gov/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      mint: {
        v1beta1: new (await import("../cosmos/mint/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      params: {
        v1beta1: new (await import("../cosmos/params/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      staking: {
        v1beta1: new (await import("../cosmos/staking/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      tx: {
        v1beta1: new (await import("../cosmos/tx/v1beta1/service.lcd")).LCDQueryClient({
          requestClient
        })
      },
      upgrade: {
        v1beta1: new (await import("../cosmos/upgrade/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      }
    },
    cyber: {
      bandwidth: {
        v1beta1: new (await import("./bandwidth/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      clock: {
        v1: new (await import("./clock/v1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      dmn: {
        v1beta1: new (await import("./dmn/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      graph: {
        v1beta1: new (await import("./graph/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      grid: {
        v1beta1: new (await import("./grid/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      liquidity: {
        v1beta1: new (await import("./liquidity/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      rank: {
        v1beta1: new (await import("./rank/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      },
      resources: {
        v1beta1: new (await import("./resources/v1beta1/query.lcd")).LCDQueryClient({
          requestClient
        })
      }
    }
  };
};