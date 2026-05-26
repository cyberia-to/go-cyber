import {
  Code,
  CodeDetails,
  Contract,
  ContractCodeHistoryEntry,
  JsonObject,
  setupWasmExtension,
  WasmExtension,
} from "@cosmjs/cosmwasm-stargate";
import { fromAscii, toHex } from "@cosmjs/encoding";
import { Uint53 } from "@cosmjs/math";
import {
  Account,
  accountFromAny,
  AuthExtension,
  BankExtension,
  Block,
  Coin,
  DeliverTxResponse,
  DistributionExtension,
  GovExtension,
  GovParamsType,
  GovProposalId,
  IbcExtension,
  IndexedTx,
  QueryClient,
  SequenceResponse,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupGovExtension,
  setupIbcExtension,
  setupStakingExtension,
  setupTxExtension,
  StakingExtension,
  TxExtension,
} from "@cosmjs/stargate";
import {
  BlockResultsResponse,
  Tendermint34Client,
  TendermintClient,
  toRfc3339WithNanoseconds,
} from "@cosmjs/tendermint-rpc";
import { assert } from "@cosmjs/utils";
import {
  QueryCommunityPoolResponse,
  QueryDelegationRewardsResponse,
  QueryDelegationTotalRewardsResponse,
  QueryDelegatorValidatorsResponse as QueryDelegatorValidatorsResponseDistribution,
  QueryDelegatorWithdrawAddressResponse,
  QueryParamsResponse as QueryParamsResponseDistribution,
  QueryValidatorCommissionResponse,
  QueryValidatorOutstandingRewardsResponse,
  QueryValidatorSlashesResponse,
} from "cosmjs-types/cosmos/distribution/v1beta1/query";
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import {
  QueryDepositResponse,
  QueryDepositsResponse,
  QueryParamsResponse as QueryParamsResponseGovernance,
  QueryProposalResponse,
  QueryProposalsResponse,
  QueryTallyResultResponse,
  QueryVoteResponse,
  QueryVotesResponse,
} from "cosmjs-types/cosmos/gov/v1beta1/query";
import {
  QueryDelegationResponse,
  QueryDelegatorDelegationsResponse,
  QueryDelegatorUnbondingDelegationsResponse,
  QueryDelegatorValidatorResponse,
  QueryDelegatorValidatorsResponse,
  QueryHistoricalInfoResponse,
  QueryParamsResponse as QueryParamsResponseStaking,
  QueryPoolResponse,
  QueryRedelegationsResponse,
  QueryUnbondingDelegationResponse,
  QueryValidatorDelegationsResponse,
  QueryValidatorResponse,
  QueryValidatorsResponse,
  QueryValidatorUnbondingDelegationsResponse,
} from "cosmjs-types/cosmos/staking/v1beta1/query";
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import {
  CodeInfoResponse,
  QueryCodesResponse,
  QueryContractsByCodeResponse,
} from "cosmjs-types/cosmwasm/wasm/v1/query";
import { ContractCodeHistoryOperationType } from "cosmjs-types/cosmwasm/wasm/v1/types";
import {
  QueryDenomTraceResponse,
  QueryDenomTracesResponse,
} from "cosmjs-types/ibc/applications/transfer/v1/query";

import {
  QueryLoadResponse,
  QueryNeuronBandwidthResponse,
  QueryPriceResponse,
} from "./codec/cyber/bandwidth/v1beta1/query";
import { QueryGraphStatsResponse } from "./codec/cyber/graph/v1beta1/query";
import {
  QueryParamsResponse as QueryParamsResponseEnergy,
  QueryRoutedEnergyResponse,
  QueryRouteResponse,
  QueryRoutesResponse,
} from "./codec/cyber/grid/v1beta1/query";
import {
  QueryKarmaResponse,
  QueryLinkExistResponse,
  QueryNegentropyResponse,
  QueryRankResponse,
  QuerySearchResponse,
} from "./codec/cyber/rank/v1beta1/query";
import { QueryParamsResponse as QueryParamsResponseResources } from "./codec/cyber/resources/v1beta1/query";
import {
  QueryLiquidityPoolResponse,
  QueryLiquidityPoolsResponse,
  QueryParamsResponse as QueryParamsResponseLiquidity,
} from "./codec/tendermint/liquidity/v1beta1/query";
import {
  BandwidthExtension,
  GraphExtension,
  GridExtension,
  LiquidityExtension,
  RankExtension,
  ResourcesExtension,
  setupBandwidthExtension,
  setupGraphExtension,
  setupGridExtension,
  setupLiquidityExtension,
  setupRankExtension,
  setupResourcesExtension,
} from "./queries/index";
import { CyberSearchTxFilter, CyberSearchTxQuery } from "./types";

export { Code, CodeDetails, Contract, ContractCodeHistoryEntry };

type QueryClientType = QueryClient &
  AuthExtension &
  BankExtension &
  DistributionExtension &
  StakingExtension &
  GraphExtension &
  RankExtension &
  BandwidthExtension &
  GridExtension &
  WasmExtension &
  LiquidityExtension &
  GovExtension &
  ResourcesExtension &
  TxExtension &
  IbcExtension;

export interface PrivateCyberClient {
  readonly tmClient: TendermintClient | undefined;
  readonly queryClient: QueryClientType | undefined;
}

export declare type BondStatusString = Exclude<
  keyof typeof BondStatus,
  "BOND_STATUS_UNSPECIFIED" | "UNRECOGNIZED"
>;

export class CyberClient {
  private readonly tmClient: TendermintClient | undefined;
  private readonly queryClient: QueryClientType | undefined;
  private readonly codesCache = new Map<number, CodeDetails>();
  private chainId: string | undefined;

  public static async connect(endpoint: string): Promise<CyberClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new CyberClient(tmClient);
  }

  protected constructor(tmClient: Tendermint34Client | undefined) {
    if (tmClient) {
      this.tmClient = tmClient;
      this.queryClient = QueryClient.withExtensions(
        tmClient,
        setupAuthExtension,
        setupBankExtension,
        setupDistributionExtension,
        setupStakingExtension,
        setupGraphExtension,
        setupRankExtension,
        setupBandwidthExtension,
        setupGridExtension,
        setupWasmExtension,
        setupLiquidityExtension,
        setupGovExtension,
        setupResourcesExtension,
        setupTxExtension,
        setupIbcExtension,
      );
    }
  }

  protected getTmClient(): TendermintClient | undefined {
    return this.tmClient;
  }

  protected forceGetTmClient(): TendermintClient {
    if (!this.tmClient) {
      throw new Error(
        "Tendermint client not available. You cannot use online functionality in offline mode.",
      );
    }
    return this.tmClient;
  }

  protected getQueryClient(): QueryClientType | undefined {
    return this.queryClient;
  }

  protected forceGetQueryClient(): QueryClient &
    AuthExtension &
    BankExtension &
    DistributionExtension &
    StakingExtension &
    GraphExtension &
    RankExtension &
    BandwidthExtension &
    GridExtension &
    WasmExtension &
    LiquidityExtension &
    GovExtension &
    ResourcesExtension &
    IbcExtension &
    TxExtension {
    if (!this.queryClient) {
      throw new Error("Query client not available. You cannot use online functionality in offline mode.");
    }
    return this.queryClient;
  }

  public async getChainId(): Promise<string> {
    if (!this.chainId) {
      const response = await this.forceGetTmClient().status();
      const chainId = response.nodeInfo.network;
      if (!chainId) throw new Error("Chain ID must not be empty");
      this.chainId = chainId;
    }

    return this.chainId;
  }

  public async getHeight(): Promise<number> {
    const status = await this.forceGetTmClient().status();
    return status.syncInfo.latestBlockHeight;
  }

  public async getAccount(searchAddress: string): Promise<Account | null> {
    try {
      const account = await this.forceGetQueryClient().auth.account(searchAddress);
      return account ? accountFromAny(account) : null;
    } catch (error) {
      if (/rpc error: code = NotFound/i.test(String(error))) {
        return null;
      }
      throw error;
    }
  }

  public async getSequence(address: string): Promise<SequenceResponse> {
    const account = await this.getAccount(address);
    if (!account) {
      throw new Error(
        "Account does not exist on chain. Send some tokens there before trying to query sequence.",
      );
    }
    return {
      accountNumber: account.accountNumber,
      sequence: account.sequence,
    };
  }

  public async getBlock(height?: number): Promise<Block> {
    const response = await this.forceGetTmClient().block(height);
    return {
      id: toHex(response.blockId.hash).toUpperCase(),
      header: {
        version: {
          block: new Uint53(response.block.header.version.block).toString(),
          app: new Uint53(response.block.header.version.app).toString(),
        },
        height: response.block.header.height,
        chainId: response.block.header.chainId,
        time: toRfc3339WithNanoseconds(response.block.header.time),
      },
      txs: response.block.txs,
    };
  }

  public async getBlockResults(height?: number): Promise<BlockResultsResponse> {
    return this.forceGetTmClient().blockResults(height);
  }

  public async getBalance(address: string, searchDenom: string): Promise<Coin> {
    return this.forceGetQueryClient().bank.balance(address, searchDenom);
  }

  public async getAllBalances(address: string): Promise<readonly Coin[]> {
    return this.forceGetQueryClient().bank.allBalances(address);
  }

  public async totalSupply(): Promise<Coin[]> {
    const result = await this.forceGetQueryClient().bank.totalSupply();
    return result.supply;
  }

  public async getTx(id: string): Promise<IndexedTx | null> {
    const results = await this.txsQuery(`tx.hash='${id}'`);
    return results[0] ?? null;
  }

  public async searchTx(
    query: CyberSearchTxQuery,
    filter: CyberSearchTxFilter = {},
  ): Promise<readonly IndexedTx[]> {
    const minHeight = filter.minHeight || 0;
    const maxHeight = filter.maxHeight || Number.MAX_SAFE_INTEGER;

    if (maxHeight < minHeight) return []; // optional optimization

    function withFilters(originalQuery: string): string {
      return `${originalQuery} AND tx.height>=${minHeight} AND tx.height<=${maxHeight}`;
    }

    let txs: readonly IndexedTx[];

    if (query?.height !== undefined) {
      txs =
        query.height >= minHeight && query.height <= maxHeight
          ? await this.txsQuery(`tx.height=${query.height}`)
          : [];
    } else if (query?.sentFromOrTo !== undefined) {
      const sentQuery = withFilters(`message.module='bank' AND transfer.sender='${query.sentFromOrTo}'`);
      const receivedQuery = withFilters(
        `message.module='bank' AND transfer.recipient='${query.sentFromOrTo}'`,
      );
      const [sent, received] = await Promise.all(
        [sentQuery, receivedQuery].map((rawQuery) => this.txsQuery(rawQuery)),
      );
      const sentHashes = sent.map((t) => t.hash);
      txs = [...sent, ...received.filter((t) => !sentHashes.includes(t.hash))];
    } else if (query?.tags !== undefined) {
      const rawQuery = withFilters(query.tags.map((t) => `${t.key}='${t.value}'`).join(" AND "));
      txs = await this.txsQuery(rawQuery);
    } else {
      throw new Error("Unknown query type");
    }

    const filtered = txs.filter((tx) => tx.height >= minHeight && tx.height <= maxHeight);
    return filtered;
  }

  public disconnect(): void {
    if (this.tmClient) this.tmClient.disconnect();
  }

  public async broadcastTx(tx: Uint8Array): Promise<DeliverTxResponse> {
    const broadcasted = await this.forceGetTmClient().broadcastTxSync({ tx });
    const transactionId = toHex(broadcasted.hash).toUpperCase();

    return {
      code: broadcasted.code,
      height: 0,
      rawLog: broadcasted.log,
      transactionHash: transactionId,
      gasUsed: broadcasted.gasUsed,
      gasWanted: broadcasted.gasWanted,
      txIndex: 0,
      events: [], // TODO:  broadcasted.events,
      msgResponses: [],
    };
  }

  // Graph module

  public async graphStats(): Promise<QueryGraphStatsResponse> {
    const response = await this.forceGetQueryClient().graph.graphStats();
    return QueryGraphStatsResponse.toJSON(response) as QueryGraphStatsResponse;
  }

  // Rank module

  public async search(particle: string, page?: number, perPage?: number): Promise<QuerySearchResponse> {
    const response = await this.forceGetQueryClient().rank.search(particle, page, perPage);
    return QuerySearchResponse.toJSON(response) as QuerySearchResponse;
  }

  public async backlinks(particle: string, page?: number, perPage?: number): Promise<QuerySearchResponse> {
    const response = await this.forceGetQueryClient().rank.backlinks(particle, page, perPage);
    return QuerySearchResponse.toJSON(response) as QuerySearchResponse;
  }

  public async rank(particle: string): Promise<QueryRankResponse> {
    const response = await this.forceGetQueryClient().rank.rank(particle);
    return QueryRankResponse.toJSON(response) as QueryRankResponse;
  }

  public async karma(neuron: string): Promise<QueryKarmaResponse> {
    const response = await this.forceGetQueryClient().rank.karma(neuron);
    return QueryKarmaResponse.toJSON(response) as QueryKarmaResponse;
  }

  public async isLinkExist(from: string, to: string, agent: string): Promise<QueryLinkExistResponse> {
    const response = await this.forceGetQueryClient().rank.isLinkExist(from, to, agent);
    return QueryLinkExistResponse.toJSON(response) as QueryLinkExistResponse;
  }

  public async isAnyLinkExist(from: string, to: string): Promise<QueryLinkExistResponse> {
    const response = await this.forceGetQueryClient().rank.isAnyLinkExist(from, to);
    return QueryLinkExistResponse.toJSON(response) as QueryLinkExistResponse;
  }

  public async negentropy(): Promise<QueryNegentropyResponse> {
    const response = await this.forceGetQueryClient().rank.negentropy();
    return QueryNegentropyResponse.toJSON(response) as QueryNegentropyResponse;
  }

  // Bandwidth module

  public async load(): Promise<QueryLoadResponse> {
    const response = await this.forceGetQueryClient().bandwidth.load();
    return QueryLoadResponse.toJSON(response) as QueryLoadResponse;
  }

  public async price(): Promise<QueryPriceResponse> {
    const response = await this.forceGetQueryClient().bandwidth.price();
    return QueryPriceResponse.toJSON(response) as QueryPriceResponse;
  }

  public async accountBandwidth(agent: string): Promise<QueryNeuronBandwidthResponse> {
    const response = await this.forceGetQueryClient().bandwidth.account(agent);
    return QueryNeuronBandwidthResponse.toJSON(response) as QueryNeuronBandwidthResponse;
  }

  // Staking module

  public async delegation(
    delegatorAddress: string,
    validatorAddress: string,
  ): Promise<QueryDelegationResponse> {
    const response = await this.forceGetQueryClient().staking.delegation(delegatorAddress, validatorAddress);
    return QueryDelegationResponse.toJSON(response) as QueryDelegationResponse;
  }

  public async delegatorDelegations(
    delegatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryDelegatorDelegationsResponse> {
    const response = await this.forceGetQueryClient().staking.delegatorDelegations(
      delegatorAddress,
      paginationKey,
    );
    return QueryDelegatorDelegationsResponse.toJSON(response) as QueryDelegatorDelegationsResponse;
  }

  public async delegatorUnbondingDelegations(
    delegatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryDelegatorUnbondingDelegationsResponse> {
    const response = await this.forceGetQueryClient().staking.delegatorUnbondingDelegations(
      delegatorAddress,
      paginationKey,
    );
    return QueryDelegatorUnbondingDelegationsResponse.toJSON(
      response,
    ) as QueryDelegatorUnbondingDelegationsResponse;
  }

  public async delegatorValidator(
    delegatorAddress: string,
    validatorAddress: string,
  ): Promise<QueryDelegatorValidatorResponse> {
    const response = await this.forceGetQueryClient().staking.delegatorValidator(
      delegatorAddress,
      validatorAddress,
    );
    return QueryDelegatorValidatorResponse.toJSON(response) as QueryDelegatorValidatorResponse;
  }

  public async delegatorValidators(
    delegatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryDelegatorValidatorsResponse> {
    const response = await this.forceGetQueryClient().staking.delegatorValidators(
      delegatorAddress,
      paginationKey,
    );
    return QueryDelegatorValidatorsResponse.toJSON(response) as QueryDelegatorValidatorsResponse;
  }

  public async historicalInfo(height: number): Promise<QueryHistoricalInfoResponse> {
    const response = await this.forceGetQueryClient().staking.historicalInfo(height);
    return QueryHistoricalInfoResponse.toJSON(response) as QueryHistoricalInfoResponse;
  }

  public async stakingParams(): Promise<QueryParamsResponseStaking> {
    const response = await this.forceGetQueryClient().staking.params();
    return QueryParamsResponseStaking.toJSON(response) as QueryParamsResponseStaking;
  }

  public async stakingPool(): Promise<QueryPoolResponse> {
    const response = await this.forceGetQueryClient().staking.pool();
    return QueryPoolResponse.toJSON(response) as QueryPoolResponse;
  }

  public async redelegations(
    delegatorAddress: string,
    sourceValidatorAddress: string,
    destinationValidatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryRedelegationsResponse> {
    const response = await this.forceGetQueryClient().staking.redelegations(
      delegatorAddress,
      sourceValidatorAddress,
      destinationValidatorAddress,
      paginationKey,
    );
    return QueryRedelegationsResponse.toJSON(response) as QueryRedelegationsResponse;
  }
  public async unbondingDelegation(
    delegatorAddress: string,
    validatorAddress: string,
  ): Promise<QueryUnbondingDelegationResponse> {
    const response = await this.forceGetQueryClient().staking.unbondingDelegation(
      delegatorAddress,
      validatorAddress,
    );
    return QueryUnbondingDelegationResponse.toJSON(response) as QueryUnbondingDelegationResponse;
  }
  public async validator(validatorAddress: string): Promise<QueryValidatorResponse> {
    const response = await this.forceGetQueryClient().staking.validator(validatorAddress);
    return QueryValidatorResponse.toJSON(response) as QueryValidatorResponse;
  }
  public async validatorDelegations(
    validatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryValidatorDelegationsResponse> {
    const response = await this.forceGetQueryClient().staking.validatorDelegations(
      validatorAddress,
      paginationKey,
    );
    return QueryValidatorDelegationsResponse.toJSON(response) as QueryValidatorDelegationsResponse;
  }

  public async validators(
    status: BondStatusString,
    paginationKey?: Uint8Array,
  ): Promise<QueryValidatorsResponse> {
    const response = await this.forceGetQueryClient().staking.validators(status, paginationKey);
    return QueryValidatorsResponse.toJSON(response) as QueryValidatorsResponse;
  }

  public async validatorUnbondingDelegations(
    validatorAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryValidatorUnbondingDelegationsResponse> {
    const response = await this.forceGetQueryClient().staking.validatorUnbondingDelegations(
      validatorAddress,
      paginationKey,
    );
    return QueryValidatorUnbondingDelegationsResponse.toJSON(
      response,
    ) as QueryValidatorUnbondingDelegationsResponse;
  }

  // Distribution module

  public async communityPool(): Promise<QueryCommunityPoolResponse> {
    const response = await this.forceGetQueryClient().distribution.communityPool();
    return QueryCommunityPoolResponse.toJSON(response) as QueryCommunityPoolResponse;
  }

  public async delegationRewards(
    delegatorAddress: string,
    validatorAddress: string,
  ): Promise<QueryDelegationRewardsResponse> {
    const response = await this.forceGetQueryClient().distribution.delegationRewards(
      delegatorAddress,
      validatorAddress,
    );
    return QueryDelegationRewardsResponse.toJSON(response) as QueryDelegationRewardsResponse;
  }

  public async delegationTotalRewards(
    delegatorAddress: string,
  ): Promise<QueryDelegationTotalRewardsResponse> {
    const response = await this.forceGetQueryClient().distribution.delegationTotalRewards(delegatorAddress);
    return QueryDelegationTotalRewardsResponse.toJSON(response) as QueryDelegationTotalRewardsResponse;
  }

  public async delegatorValidatorsDistribution(
    delegatorAddress: string,
  ): Promise<QueryDelegatorValidatorsResponseDistribution> {
    const response = await this.forceGetQueryClient().distribution.delegatorValidators(delegatorAddress);
    return QueryDelegatorValidatorsResponseDistribution.toJSON(
      response,
    ) as QueryDelegatorValidatorsResponseDistribution;
  }

  public async delegatorWithdrawAddress(
    delegatorAddress: string,
  ): Promise<QueryDelegatorWithdrawAddressResponse> {
    const response = await this.forceGetQueryClient().distribution.delegatorWithdrawAddress(delegatorAddress);
    return QueryDelegatorWithdrawAddressResponse.toJSON(response) as QueryDelegatorWithdrawAddressResponse;
  }

  public async distributionParams(): Promise<QueryParamsResponseDistribution> {
    const response = await this.forceGetQueryClient().distribution.params();
    return QueryParamsResponseDistribution.toJSON(response) as QueryParamsResponseDistribution;
  }

  public async validatorCommission(validatorAddress: string): Promise<QueryValidatorCommissionResponse> {
    const response = await this.forceGetQueryClient().distribution.validatorCommission(validatorAddress);
    return QueryValidatorCommissionResponse.toJSON(response) as QueryValidatorCommissionResponse;
  }

  public async validatorOutstandingRewards(
    validatorAddress: string,
  ): Promise<QueryValidatorOutstandingRewardsResponse> {
    const response = await this.forceGetQueryClient().distribution.validatorOutstandingRewards(
      validatorAddress,
    );
    return QueryValidatorOutstandingRewardsResponse.toJSON(
      response,
    ) as QueryValidatorOutstandingRewardsResponse;
  }

  public async validatorSlashes(
    validatorAddress: string,
    startingHeight: number,
    endingHeight: number,
    paginationKey?: Uint8Array,
  ): Promise<QueryValidatorSlashesResponse> {
    const response = await this.forceGetQueryClient().distribution.validatorSlashes(
      validatorAddress,
      startingHeight,
      endingHeight,
      paginationKey,
    );
    return QueryValidatorSlashesResponse.toJSON(response) as QueryValidatorSlashesResponse;
  }

  // Grid module

  public async sourceRoutes(source: string): Promise<QueryRoutesResponse> {
    const response = await this.forceGetQueryClient().grid.sourceRoutes(source);
    return QueryRoutesResponse.toJSON(response) as QueryRoutesResponse;
  }

  public async destinationRoutes(destination: string): Promise<QueryRoutesResponse> {
    const response = await this.forceGetQueryClient().grid.destinationRoutes(destination);
    return QueryRoutesResponse.toJSON(response) as QueryRoutesResponse;
  }

  public async destinationRoutedEnergy(destination: string): Promise<QueryRoutedEnergyResponse> {
    const response = await this.forceGetQueryClient().grid.destinationRoutedEnergy(destination);
    return QueryRoutedEnergyResponse.toJSON(response) as QueryRoutedEnergyResponse;
  }

  public async sourceRoutedEnergy(source: string): Promise<QueryRoutedEnergyResponse> {
    const response = await this.forceGetQueryClient().grid.sourceRoutedEnergy(source);
    return QueryRoutedEnergyResponse.toJSON(response) as QueryRoutedEnergyResponse;
  }

  public async route(source: string, destination: string): Promise<QueryRouteResponse> {
    const response = await this.forceGetQueryClient().grid.route(source, destination);
    return QueryRouteResponse.toJSON(response) as QueryRouteResponse;
  }

  public async routes(): Promise<QueryRoutesResponse> {
    const response = await this.forceGetQueryClient().grid.routes();
    return QueryRoutesResponse.toJSON(response) as QueryRoutesResponse;
  }

  public async energyParams(): Promise<QueryParamsResponseEnergy> {
    const response = await this.forceGetQueryClient().grid.params();
    return QueryParamsResponseEnergy.toJSON(response) as QueryParamsResponseEnergy;
  }

  // Resources module

  public async resourcesParams(): Promise<QueryParamsResponseResources> {
    const response = await this.forceGetQueryClient().resources.params();
    return QueryParamsResponseResources.toJSON(response) as QueryParamsResponseResources;
  }

  // Liquidity module

  public async liquidityParams(): Promise<QueryParamsResponseLiquidity> {
    const response = await this.forceGetQueryClient().liquidity.params();
    return QueryParamsResponseLiquidity.toJSON(response) as QueryParamsResponseLiquidity;
  }

  public async pool(id: number): Promise<QueryLiquidityPoolResponse> {
    const response = await this.forceGetQueryClient().liquidity.pool(id);
    return QueryLiquidityPoolResponse.toJSON(response) as QueryLiquidityPoolResponse;
  }

  public async pools(): Promise<QueryLiquidityPoolsResponse> {
    const response = await this.forceGetQueryClient().liquidity.pools();
    return QueryLiquidityPoolsResponse.toJSON(response) as QueryLiquidityPoolsResponse;
  }

  // Gov module

  public async govParams(parametersType: GovParamsType): Promise<QueryParamsResponseGovernance> {
    const response = await this.forceGetQueryClient().gov.params(parametersType);
    return QueryParamsResponseGovernance.toJSON(response) as QueryParamsResponseGovernance;
  }

  public async proposals(
    proposalStatus: ProposalStatus,
    depositorAddress: string,
    voterAddress: string,
    paginationKey?: Uint8Array,
  ): Promise<QueryProposalsResponse> {
    const response = await this.forceGetQueryClient().gov.proposals(
      proposalStatus,
      depositorAddress,
      voterAddress,
      paginationKey,
    );
    return QueryProposalsResponse.toJSON(response) as QueryProposalsResponse;
  }

  public async proposal(proposalId: GovProposalId): Promise<QueryProposalResponse> {
    const response = await this.forceGetQueryClient().gov.proposal(proposalId);
    return QueryProposalResponse.toJSON(response) as QueryProposalResponse;
  }

  public async deposits(proposalId: GovProposalId): Promise<QueryDepositsResponse> {
    const response = await this.forceGetQueryClient().gov.deposits(proposalId);
    return QueryDepositsResponse.toJSON(response) as QueryDepositsResponse;
  }

  public async deposit(proposalId: GovProposalId, depositorAddress: string): Promise<QueryDepositResponse> {
    const response = await this.forceGetQueryClient().gov.deposit(proposalId, depositorAddress);
    return QueryDepositResponse.toJSON(response) as QueryDepositResponse;
  }

  public async tally(proposalId: GovProposalId): Promise<QueryTallyResultResponse> {
    const response = await this.forceGetQueryClient().gov.tally(proposalId);
    return QueryTallyResultResponse.toJSON(response) as QueryTallyResultResponse;
  }

  public async votes(proposalId: GovProposalId): Promise<QueryVotesResponse> {
    const response = await this.forceGetQueryClient().gov.votes(proposalId);
    return QueryVotesResponse.toJSON(response) as QueryVotesResponse;
  }

  public async vote(proposalId: GovProposalId, voterAddress: string): Promise<QueryVoteResponse> {
    const response = await this.forceGetQueryClient().gov.vote(proposalId, voterAddress);
    return QueryVoteResponse.toJSON(response) as QueryVoteResponse;
  }

  // Wasm module

  public async getCodes(): Promise<readonly Code[]> {
    const allCodes = [];

    let startAtKey: Uint8Array | undefined = undefined;
    do {
      const { codeInfos, pagination }: QueryCodesResponse =
        await this.forceGetQueryClient().wasm.listCodeInfo(startAtKey);
      const loadedCodes = codeInfos || [];
      allCodes.push(...loadedCodes);
      startAtKey = pagination?.nextKey;
    } while (startAtKey?.length !== 0);

    return allCodes.map((entry: CodeInfoResponse): Code => {
      assert(entry.creator && entry.codeId && entry.dataHash, "entry incomplete");
      return {
        id: entry.codeId.toNumber(),
        creator: entry.creator,
        checksum: toHex(entry.dataHash),
      };
    });
  }

  public async getCodeDetails(codeId: number): Promise<CodeDetails> {
    const cached = this.codesCache.get(codeId);
    if (cached) return cached;

    const { codeInfo, data } = await this.forceGetQueryClient().wasm.getCode(codeId);
    assert(
      codeInfo && codeInfo.codeId && codeInfo.creator && codeInfo.dataHash && data,
      "codeInfo missing or incomplete",
    );
    const codeDetails: CodeDetails = {
      id: codeInfo.codeId.toNumber(),
      creator: codeInfo.creator,
      checksum: toHex(codeInfo.dataHash),
      data: data,
    };
    this.codesCache.set(codeId, codeDetails);
    return codeDetails;
  }

  public async getContracts(codeId: number): Promise<readonly string[]> {
    const allContracts = [];
    let startAtKey: Uint8Array | undefined = undefined;
    do {
      const { contracts, pagination }: QueryContractsByCodeResponse =
        await this.forceGetQueryClient().wasm.listContractsByCodeId(codeId, startAtKey);
      const loadedContracts = contracts || [];
      allContracts.push(...loadedContracts);
      startAtKey = pagination?.nextKey;
    } while (startAtKey?.length !== 0 && startAtKey !== undefined);

    return allContracts;
  }

  // IBC module
  public async allDenomTraces(): Promise<QueryDenomTracesResponse> {
    const response = await this.forceGetQueryClient().ibc.transfer.allDenomTraces();
    return response;
  }

  public async denomTrace(hash: string): Promise<QueryDenomTraceResponse> {
    const response = await this.forceGetQueryClient().ibc.transfer.denomTrace(hash);
    return response;
  }

  /**
   * Throws an error if no contract was found at the address
   */
  public async getContract(address: string): Promise<Contract> {
    const { address: retrievedAddress, contractInfo } = await this.forceGetQueryClient().wasm.getContractInfo(
      address,
    );
    if (!contractInfo) throw new Error(`No contract found at address "${address}"`);
    assert(retrievedAddress, "address missing");
    assert(contractInfo.codeId && contractInfo.creator && contractInfo.label, "contractInfo incomplete");
    return {
      address: retrievedAddress,
      codeId: contractInfo.codeId.toNumber(),
      creator: contractInfo.creator,
      admin: contractInfo.admin || undefined,
      label: contractInfo.label,
      ibcPortId: contractInfo.ibcPortId || undefined,
    };
  }

  /**
   * Throws an error if no contract was found at the address
   */
  public async getContractCodeHistory(address: string): Promise<readonly ContractCodeHistoryEntry[]> {
    const result = await this.forceGetQueryClient().wasm.getContractCodeHistory(address);
    if (!result) throw new Error(`No contract history found for address "${address}"`);
    const operations: Record<number, "Init" | "Genesis" | "Migrate"> = {
      [ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT]: "Init",
      [ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS]: "Genesis",
      [ContractCodeHistoryOperationType.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE]: "Migrate",
    };
    return (result.entries || []).map((entry): ContractCodeHistoryEntry => {
      assert(entry.operation && entry.codeId && entry.msg);
      return {
        operation: operations[entry.operation],
        codeId: entry.codeId.toNumber(),
        msg: JSON.parse(fromAscii(entry.msg)),
      };
    });
  }

  /**
   * Returns the data at the key if present (raw contract dependent storage data)
   * or null if no data at this key.
   *
   * Promise is rejected when contract does not exist.
   */
  public async queryContractRaw(address: string, key: Uint8Array): Promise<Uint8Array | null> {
    // just test contract existence
    await this.getContract(address);

    const { data } = await this.forceGetQueryClient().wasm.queryContractRaw(address, key);
    return data ?? null;
  }

  /**
   * Makes a smart query on the contract, returns the parsed JSON document.
   *
   * Promise is rejected when contract does not exist.
   * Promise is rejected for invalid query format.
   * Promise is rejected for invalid response format.
   */
  public async queryContractSmart(address: string, queryMsg: Record<string, unknown>): Promise<JsonObject> {
    try {
      return await this.forceGetQueryClient().wasm.queryContractSmart(address, queryMsg);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith("not found: contract")) {
          throw new Error(`No contract found at address "${address}"`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  private async txsQuery(query: string): Promise<readonly IndexedTx[]> {
    const results = await this.forceGetTmClient().txSearchAll({ query: query });
    return results.txs.map((tx) => {
      return {
        height: tx.height,
        hash: toHex(tx.hash).toUpperCase(),
        code: tx.result.code,
        rawLog: tx.result.log || "",
        tx: tx.tx,
        gasUsed: tx.result.gasUsed,
        gasWanted: tx.result.gasWanted,
        txIndex: tx.index,
        events: [], // TODO:  tx.result.events || [],
        msgResponses: [],
      };
    });
  }
}
