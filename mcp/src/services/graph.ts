import { graphql } from "../clients/graphql.js";
import { lcdGet } from "../clients/lcd.js";
import { ipfsGet } from "../clients/ipfs.js";

export interface Cyberlink {
  particle_from: string;
  particle_to: string;
  neuron: string;
  timestamp: string;
  transaction_hash: string;
}

export async function searchCyberlinks(opts: {
  particle?: string;
  neuron?: string;
  limit: number;
  offset: number;
}) {
  const conditions: string[] = [];
  if (opts.particle) {
    conditions.push(
      `_or: [{particle_from: {_eq: "${opts.particle}"}}, {particle_to: {_eq: "${opts.particle}"}}]`,
    );
  }
  if (opts.neuron) {
    conditions.push(`neuron: {_eq: "${opts.neuron}"}`);
  }
  if (conditions.length === 0) throw new Error("Provide at least particle or neuron");

  const where = `{${conditions.join(", ")}}`;
  const result = await graphql<{
    cyberlinks: Cyberlink[];
    cyberlinks_aggregate: { aggregate: { count: number } };
  }>(`{
    cyberlinks(where: ${where}, limit: ${opts.limit}, offset: ${opts.offset}, order_by: {timestamp: desc}) {
      particle_from particle_to neuron timestamp transaction_hash
    }
    cyberlinks_aggregate(where: ${where}) { aggregate { count } }
  }`);

  return {
    total: result.cyberlinks_aggregate.aggregate.count,
    links: result.cyberlinks,
  };
}

export async function getRank(particle: string) {
  const result = await lcdGet<{ rank: string }>(
    `/cyber/rank/v1beta1/rank/rank/${particle}`,
  );
  return { particle, rank: result.rank };
}

export async function getNeuron(address: string) {
  const result = await graphql<{
    cyberlinks_aggregate: { aggregate: { count: number } };
  }>(`{
    cyberlinks_aggregate(where: {neuron: {_eq: "${address}"}}) {
      aggregate { count }
    }
  }`);
  return {
    address,
    cyberlinks_created: result.cyberlinks_aggregate.aggregate.count,
  };
}

export async function getParticle(cid: string) {
  return ipfsGet(cid);
}

export async function getRecentLinks(limit: number) {
  const result = await graphql<{ cyberlinks: Cyberlink[] }>(`{
    cyberlinks(limit: ${limit}, order_by: {timestamp: desc}) {
      particle_from particle_to neuron timestamp transaction_hash
    }
  }`);
  return result.cyberlinks;
}

export async function getGraphStats() {
  const result = await graphql<{
    cyberlinks_aggregate: { aggregate: { count: number } };
    neurons: { aggregate: { count: number } };
  }>(`{
    cyberlinks_aggregate { aggregate { count } }
    neurons: cyberlinks_aggregate(distinct_on: neuron) { aggregate { count } }
  }`);
  return {
    total_cyberlinks: result.cyberlinks_aggregate.aggregate.count,
    active_neurons: result.neurons.aggregate.count,
  };
}
