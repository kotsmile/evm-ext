import type { Module } from '@/config/type'

import type {
  ContractsJSONStruct,
  AppChainIds,
  ContractsDefinition,
  ContractsConfig,
} from './type'
import { debugInfo, logger } from './utils'
import { useContractsOnChain_config, useContracts_config } from './use'

export const contractsModule = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
>(
  contractsConfig: ContractsConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => ({
  contracts: {
    tools: (config) => ({
      useContracts: useContracts_config(config, contractsConfig),
      useContractsOnChain: useContractsOnChain_config(config, contractsConfig),
      getContractsConfig: () => contractsConfig,
    }),
    init: async (config) => {
      try {
        logger.info('List of contracts')
        debugInfo(config, contractsConfig)
      } catch (e) {
        logger.error(e)
        return false
      }
      logger.info('Initiated')
      return true
    },
  } satisfies Module,
})

export default contractsModule

export * from './type'
export * from './utils'
