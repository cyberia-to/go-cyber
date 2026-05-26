//@ts-nocheck
import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryRankRequest, QueryRankResponseSDKType, QuerySearchRequest, QuerySearchResponseSDKType, QueryTopRequest, QueryIsLinkExistRequest, QueryLinkExistResponseSDKType, QueryIsAnyLinkExistRequest, QueryNegentropyPartilceRequest, QueryNegentropyParticleResponseSDKType, QueryNegentropyRequest, QueryNegentropyResponseSDKType, QueryKarmaRequest, QueryKarmaResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.params = this.params.bind(this);
    this.rank = this.rank.bind(this);
    this.search = this.search.bind(this);
    this.backlinks = this.backlinks.bind(this);
    this.top = this.top.bind(this);
    this.isLinkExist = this.isLinkExist.bind(this);
    this.isAnyLinkExist = this.isAnyLinkExist.bind(this);
    this.particleNegentropy = this.particleNegentropy.bind(this);
    this.negentropy = this.negentropy.bind(this);
    this.karma = this.karma.bind(this);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/rank/v1beta1/rank/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* Rank */
  async rank(params: QueryRankRequest): Promise<QueryRankResponseSDKType> {
    const endpoint = `cyber/rank/v1beta1/rank/rank/${params.particle}`;
    return await this.req.get<QueryRankResponseSDKType>(endpoint);
  }
  /* Search */
  async search(params: QuerySearchRequest): Promise<QuerySearchResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cyber/rank/v1beta1/rank/search/${params.particle}`;
    return await this.req.get<QuerySearchResponseSDKType>(endpoint, options);
  }
  /* Backlinks */
  async backlinks(params: QuerySearchRequest): Promise<QuerySearchResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cyber/rank/v1beta1/rank/backlinks/${params.particle}`;
    return await this.req.get<QuerySearchResponseSDKType>(endpoint, options);
  }
  /* Top */
  async top(params: QueryTopRequest = {
    pagination: undefined
  }): Promise<QuerySearchResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cyber/rank/v1beta1/rank/top`;
    return await this.req.get<QuerySearchResponseSDKType>(endpoint, options);
  }
  /* IsLinkExist */
  async isLinkExist(params: QueryIsLinkExistRequest): Promise<QueryLinkExistResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.from !== "undefined") {
      options.params.from = params.from;
    }
    if (typeof params?.to !== "undefined") {
      options.params.to = params.to;
    }
    if (typeof params?.address !== "undefined") {
      options.params.address = params.address;
    }
    const endpoint = `cyber/rank/v1beta1/is_link_exist`;
    return await this.req.get<QueryLinkExistResponseSDKType>(endpoint, options);
  }
  /* IsAnyLinkExist */
  async isAnyLinkExist(params: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.from !== "undefined") {
      options.params.from = params.from;
    }
    if (typeof params?.to !== "undefined") {
      options.params.to = params.to;
    }
    const endpoint = `cyber/rank/v1beta1/is_any_link_exist`;
    return await this.req.get<QueryLinkExistResponseSDKType>(endpoint, options);
  }
  /* ParticleNegentropy */
  async particleNegentropy(params: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponseSDKType> {
    const endpoint = `cyber/rank/v1beta1/negentropy/${params.particle}`;
    return await this.req.get<QueryNegentropyParticleResponseSDKType>(endpoint);
  }
  /* Negentropy */
  async negentropy(_params: QueryNegentropyRequest = {}): Promise<QueryNegentropyResponseSDKType> {
    const endpoint = `cyber/rank/v1beta1/negentropy`;
    return await this.req.get<QueryNegentropyResponseSDKType>(endpoint);
  }
  /* Karma */
  async karma(params: QueryKarmaRequest): Promise<QueryKarmaResponseSDKType> {
    const endpoint = `cyber/rank/v1beta1/karma/${params.neuron}`;
    return await this.req.get<QueryKarmaResponseSDKType>(endpoint);
  }
}