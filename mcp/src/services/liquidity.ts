import {
  getWalletAddress,
  signAndBroadcast,
  formatTxResult,
} from "../clients/signing.js";
import { lcdGet } from "../clients/lcd.js";

/**
 * Create a liquidity pool. Costs ~1,000 BOOT.
 * Deposit coins must be sorted alphabetically by denom.
 */
export async function createPool(
  denomA: string,
  amountA: string,
  denomB: string,
  amountB: string,
) {
  const depositor = await getWalletAddress();

  // Sort coins alphabetically by denom (required by Gravity DEX)
  const coins = [
    { denom: denomA, amount: amountA },
    { denom: denomB, amount: amountB },
  ].sort((a, b) => a.denom.localeCompare(b.denom));

  const msg = {
    typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
    value: {
      poolCreatorAddress: depositor,
      poolTypeId: 1, // Standard XY=K pool
      depositCoins: coins,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), depositor, depositCoins: coins };
}

/** Deposit tokens into an existing liquidity pool */
export async function deposit(
  poolId: number,
  denomA: string,
  amountA: string,
  denomB: string,
  amountB: string,
) {
  const depositor = await getWalletAddress();

  const coins = [
    { denom: denomA, amount: amountA },
    { denom: denomB, amount: amountB },
  ].sort((a, b) => a.denom.localeCompare(b.denom));

  const msg = {
    typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
    value: {
      depositorAddress: depositor,
      poolId: BigInt(poolId),
      depositCoins: coins,
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), depositor, poolId, depositCoins: coins };
}

/** Withdraw LP tokens from a pool */
export async function withdraw(
  poolId: number,
  poolCoinAmount: string,
  poolCoinDenom: string,
) {
  const withdrawer = await getWalletAddress();
  const msg = {
    typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
    value: {
      withdrawerAddress: withdrawer,
      poolId: BigInt(poolId),
      poolCoin: { denom: poolCoinDenom, amount: poolCoinAmount },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), withdrawer, poolId, poolCoinAmount, poolCoinDenom };
}

/**
 * Swap tokens via a liquidity pool.
 * Gravity DEX batched execution: swap executes at end of block.
 * offerCoinFee is computed as ceil(offerAmount * swapFeeRate / 2).
 */
export async function swap(
  poolId: number,
  offerDenom: string,
  offerAmount: string,
  demandDenom: string,
  orderPrice: string,
  swapType: number = 1, // 1 = instant, 2 = limit (if supported)
) {
  const swapper = await getWalletAddress();

  // Fetch swap fee rate from chain params (default 0.3% if query fails)
  let swapFeeRate = 0.003;
  try {
    const params = await lcdGet<{
      params: { swap_fee_rate: string };
    }>("/cosmos/liquidity/v1beta1/params");
    swapFeeRate = parseFloat(params.params.swap_fee_rate);
  } catch {
    // use default
  }

  // Half the swap fee is charged from the offer coin
  const feeAmount = Math.ceil(Number(offerAmount) * swapFeeRate / 2);

  const msg = {
    typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
    value: {
      swapRequesterAddress: swapper,
      poolId: BigInt(poolId),
      swapTypeId: swapType,
      offerCoin: { denom: offerDenom, amount: offerAmount },
      demandCoinDenom: demandDenom,
      offerCoinFee: { denom: offerDenom, amount: String(feeAmount) },
      orderPrice,
    },
  };
  const result = await signAndBroadcast([msg]);
  return {
    ...formatTxResult(result),
    swapper,
    poolId,
    offerDenom,
    offerAmount,
    demandDenom,
    orderPrice,
    offerCoinFee: String(feeAmount),
    note: "Gravity DEX: swap executes at end of block (batched)",
  };
}

/** Get pool details: reserves, price, LP supply */
export async function getPoolDetail(poolId: number) {
  const [pool, batch] = await Promise.all([
    lcdGet<{ pool: unknown }>(`/cosmos/liquidity/v1beta1/pools/${poolId}`),
    lcdGet<{ batch: unknown }>(`/cosmos/liquidity/v1beta1/pools/${poolId}/batch`).catch(() => ({ batch: null })),
  ]);
  return { pool: pool.pool, batch: batch.batch };
}

interface PoolInfo {
  id: string;
  type_id: number;
  reserve_coin_denoms: string[];
  reserve_account_address: string;
  pool_coin_denom: string;
}

/** Find a liquidity pool for the given denom pair */
export async function findPool(
  denomA: string,
  denomB: string,
): Promise<{ pool: PoolInfo; reserves: Record<string, string> } | null> {
  const data = await lcdGet<{
    pools: PoolInfo[];
  }>("/cosmos/liquidity/v1beta1/pools?pagination.limit=200");

  for (const pool of data.pools) {
    const denoms = pool.reserve_coin_denoms;
    if (
      (denoms[0] === denomA && denoms[1] === denomB) ||
      (denoms[0] === denomB && denoms[1] === denomA)
    ) {
      // Get reserves from pool account balance
      const balData = await lcdGet<{
        balances: Array<{ denom: string; amount: string }>;
      }>(`/cosmos/bank/v1beta1/balances/${pool.reserve_account_address}`);
      const reserves: Record<string, string> = {};
      for (const b of balData.balances) {
        if (b.denom === denomA || b.denom === denomB) {
          reserves[b.denom] = b.amount;
        }
      }
      return { pool, reserves };
    }
  }
  return null;
}

/**
 * High-level swap: auto-discover pool and calculate price.
 * Applies slippage tolerance to the current pool price.
 */
export async function swapTokens(
  offerDenom: string,
  offerAmount: string,
  demandDenom: string,
  slippagePercent: number = 3,
) {
  const found = await findPool(offerDenom, demandDenom);
  if (!found) {
    throw new Error(
      `No liquidity pool found for ${offerDenom}/${demandDenom}. ` +
      "Check available pools with economy_pools.",
    );
  }

  const { pool, reserves } = found;
  const poolId = parseInt(pool.id);
  const offerReserve = Number(reserves[offerDenom] || "0");
  const demandReserve = Number(reserves[demandDenom] || "0");

  if (offerReserve === 0 || demandReserve === 0) {
    throw new Error(`Pool ${poolId} has zero reserves`);
  }

  // Price = offerReserve / demandReserve (how much offer per demand)
  // Apply slippage: willing to pay more offer per demand
  const marketPrice = offerReserve / demandReserve;
  const priceWithSlippage = marketPrice * (1 + slippagePercent / 100);
  const orderPrice = priceWithSlippage.toFixed(18);

  // Estimated output (before fees and slippage)
  const estimatedOutput = Math.floor(
    Number(offerAmount) * demandReserve / offerReserve,
  );

  const result = await swap(poolId, offerDenom, offerAmount, demandDenom, orderPrice);
  return {
    ...result,
    poolId,
    marketPrice: marketPrice.toFixed(8),
    priceWithSlippage: priceWithSlippage.toFixed(8),
    estimatedOutput: String(estimatedOutput),
    slippagePercent,
  };
}
