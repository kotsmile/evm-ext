import type { EvmConfig, Module } from '@/config/type'
import type {
  ContractsJSONStruct,
  AppChainIds,
  ContractsDefinition,
} from '@/modules/contracts/type'
import { debugInfo, logger } from '@/modules/contracts/utils'

import { useContractsOnChain_config, useContracts_config } from '@/modules/contracts/use'

export default {
  tools: <
    ContractsJSON extends ContractsJSONStruct,
    ChainIds extends AppChainIds<ContractsJSON>,
    DefaultChainId extends ChainIds[number],
    Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
  >(
    config: EvmConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
  ) => {
    return {
      useContracts: useContracts_config(config),
      useContractsOnChain: useContractsOnChain_config(config),
    }
  },
  init: async (config) => {
    logger.info('List of contracts')
    debugInfo(config)
    return true
  },
} satisfies Module

export type {
  AppChainIds,
  ContractDefinition,
  ContractNameOnChainId,
  ContractsDefinition,
  ContractsDefinitionOnChain,
  ContractsDefinitionShared,
  ContractsJSONStruct,
} from '@/modules/contracts/type'
export { contractType } from '@/modules/contracts/utils'
