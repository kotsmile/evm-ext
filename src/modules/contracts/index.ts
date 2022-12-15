import type { EvmConfig, Module } from '../../config/type'
import type { ContractsJSONStruct, AppChainIds, ContractsDefinition } from './type'
import { logger } from './utils'

import { useContractsOnChain_config, useContracts_config } from './use'

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
} satisfies Module

export type {
  AppChainIds,
  ContractDefinition,
  ContractNameOnChainId,
  ContractsDefinition,
  ContractsDefinitionOnChain,
  ContractsDefinitionShared,
  ContractsJSONStruct,
} from './type'
export { contractType } from './utils'
