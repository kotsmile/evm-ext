import type { Module } from '@/config/type'

import type {
  ContractsJSONStruct,
  AppChainIds,
  ContractsDefinition,
  ContractsParams,
} from './type'
import { debugInfo, logger } from './utils'
import { useContractsOnChain_config, useContracts_config } from './use'

export const ContractsModule = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
>(
  params: ContractsParams<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => ({
  contracts: {
    tools: (config) => ({
      useContracts: useContracts_config(config, params),
      useContractsOnChain: useContractsOnChain_config(config, params),
      getContractsParams: () => params,
    }),
    init: async (config) => {
      try {
        logger.info('List of contracts')
        debugInfo(config, params)
      } catch (e) {
        logger.error(e)
        return false
      }
      logger.info('Initiated')
      return true
    },
  } satisfies Module,
})

export * from './type'
export * from './utils'
