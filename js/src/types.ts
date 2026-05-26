import { logs } from "@cosmjs/stargate";

export interface CyberlinkResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface InvestmintResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface CreateRouteResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface EditRouteResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface DeleteRouteResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface EditRouteNameResult {
  readonly logs: readonly logs.Log[];
  readonly transactionHash: string;
}

export interface Link {
  from: string;
  to: string;
}

export interface CyberSearchTxFilter {
  readonly minHeight?: number;
  readonly maxHeight?: number;
}

export interface CyberSearchTxQuery {
  sentFromOrTo?: string;
  height?: number;
  tags?: ReadonlyArray<{ readonly key: string; readonly value: string }>;
}
