import type { EvmConfig } from '../../config/type'
import type { ContractsJSONStruct, AppChainIds, ContractsDefinition } from './type'

import { useContractsOnChain_config, useContracts_config } from './use'

export default <
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
}

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
export { init } from './init'
