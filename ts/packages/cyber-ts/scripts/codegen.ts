import { TelescopeInput } from '@cosmology/telescope';
import telescope from '@cosmology/telescope';
import { join, resolve } from 'path';
import { rimrafSync as rimraf } from 'rimraf';

import { AMINO_MAP } from './aminos';

const protoDirs: string[] = [join(__dirname, '/../proto')];
const outPath: string = join(__dirname, '../src');
rimraf(outPath);

const contractsDir = resolve(join(__dirname, '/../contracts'));
const contracts = [
  {
    name: 'Gift',
    dir: join(contractsDir, 'gift')
  },
  {
    name: 'Passport',
    dir: join(contractsDir, 'passport')
  }
];

export const options: TelescopeInput = {
  protoDirs,
  outPath,
  options: {
    env: 'default',
    bundle: {
      enabled: true
    },
    removeUnusedImports: true,
    tsDisable: {
      disableAll: true
    },
    reactQuery: {
      enabled: true
    },
    interfaces: {
      enabled: true,
      useUnionTypes: true,
      useGlobalDecoderRegistry: true
    },
    prototypes: {
      enabled: true,
      addTypeUrlToDecoders: true,
      addTypeUrlToObjects: true,
      enableRegistryLoader: true,
      enableMessageComposer: true,
      // addAminoTypeToObjects: true,
      parser: {
        keepCase: false
      },
      excluded: {
        packages: [
          'cosmos.app.**',
          'cosmos.autocli.**',
          'cosmos.base.kv.v1beta1',
          'cosmos.base.reflection.v1beta1',
          'cosmos.base.snapshots.v1beta1',
          'cosmos.base.store.v1beta1',
          'cosmos.base.tendermint.v1beta1',
          'cosmos.circuit.**',
          'cosmos.consensus.**',
          'cosmos.crisis.**',
          'cosmos.evidence.**',
          'cosmos.feegrant.**',
          'cosmos.genutil.**',
          'cosmos.group.**',
          'cosmos.msg.**',
          'cosmos.nft.**',
          'cosmos.capability.**',
          'cosmos.orm.**',
          'cosmos.reflection.**',
          'cosmos.store.**',
          'cosmos.slashing.**',
          'google.api',
          'ibc.core.port.v1',
          'ibc.core.types.v1',
          'ibc.applications.fee.**',
        ]
      },
      methods: {
        fromJSON: true,
        toJSON: true,
        encode: true,
        decode: true,
        fromPartial: true,
        toAmino: true,
      },
      typingsFormat: {
        duration: 'duration',
        timestamp: 'date',
        useExact: false,
        useDeepPartial: false,
        num64: 'bigint',
        customTypes: {
          useCosmosSDKDec: true
        }
      }
    },
    aminoEncoding: {
      enabled: true,
      omitEmptyTags: ['omitempty', 'dont_omitempty'],
      disableMsgTypes: false,
      exceptions: {
        ...AMINO_MAP
      },
    },
    stargateClients: {
      enabled: true,
      includeCosmosDefaultTypes: true,
      addGetTxRpc: true
    },
    lcdClients: {
      enabled: true,
      bundle: true,
    },
    rpcClients: {
      enabled: true,
      bundle: true,
      camelCase: true,
      useConnectComet: true
    },
  }
};


telescope(options)
  .then(() => {
    console.log('✨ all done!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
