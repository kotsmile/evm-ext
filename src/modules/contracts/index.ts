import type { Module } from '@/core/type'

import type {
  ContractsJSONStruct,
  AppChainIds,
  ContractsDefinition,
  ContractsParams,
} from './type'
import { debugInfo, logger } from './utils'
import { useContractsOnChain_ctx, useContracts_ctx } from './use'

export const Contracts = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
>(
  params: ContractsParams<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => ({
  contracts: {
    tools: (ctx) => ({
      useContracts: useContracts_ctx(ctx, params),
      useContractsOnChain: useContractsOnChain_ctx(ctx, params),
      getContractsParams: () => params,
    }),
    init: async (ctx) => {
      try {
        logger.info('List of contracts')
        debugInfo(ctx, params)
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
