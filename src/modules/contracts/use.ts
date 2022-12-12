import { Contract, type BaseContract } from 'ethers'

import type { EvmConfig } from '../../config/type'

import type { INotNullSigner } from '../../utils/chain/type'
import type { ChainId } from '../../utils/chain'

import type { Cast } from '../../utils/type'
import { keyOf } from '../../utils'

import type {
  AppChainIds,
  ContractsJSONStruct,
  ContractsDefinition,
  ContractDefinition,
} from './type'

import { getProvider_config } from '../chain/node'
import { warn } from './utils'

export type DefaultContract<T, D> = T extends undefined ? D : T

export type UseContracts<
  Contracts extends Record<string, ContractDefinition<any, any>>,
  ChainId
> = {
  [name in keyof Contracts]: Contracts[name]['withAddress'] extends true
    ? (
        address: string,
        chainId?: ChainId
      ) => DefaultContract<Contracts[name]['type'], BaseContract>
    : DefaultContract<Contracts[name]['type'], BaseContract>
}

export const genContractObjects = (
  config: EvmConfig,
  chainId: ChainId,
  contracts: Record<string, ContractDefinition<any, any>>,
  allContracts: Record<
    string,
    {
      address: string
      abi: any
    }
  >,
  signer?: INotNullSigner
) => {
  const obj: any = {}

  for (const contractName of keyOf(contracts)) {
    const { name, withAddress } = contracts[contractName]
    const { abi, address } = allContracts[name.toString()]
    const cFunc = (address: string, chainId: ChainId) =>
      new Contract(address, abi, signer ?? getProvider_config(config)(chainId))
    obj[contractName] = withAddress ? cFunc : cFunc(address, chainId as ChainId)
  }
  return obj
}

export const useContracts_config = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
>(
  config: EvmConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return (signer?: INotNullSigner) => {
    if (!config.DEFAULT_CHAINID) {
      warn('No `DEFAULT_CHAINID` in config', config)
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const chainId = config.DEFAULT_CHAINID // TODO: get actual chainId from web3 store like

    if (!config.contractsJSON) {
      warn('No `contractsJSON` in config', config)
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const contractsJSON = config.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts ?? {}

    return genContractObjects(
      config,
      chainId as ChainId,
      config.contracts?.shared ?? {},
      allContracts,
      signer
    ) as UseContracts<Contracts['shared'], ChainIds[number]>
  }
}

export const useContractsOnChain_config = <
  ContractsJSON extends ContractsJSONStruct,
  ChainIds extends AppChainIds<ContractsJSON>,
  DefaultChainId extends ChainIds[number],
  Contracts extends ContractsDefinition<ContractsJSON, ChainIds[number]>
>(
  config: EvmConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return <CurrentChainId extends ChainIds[number]>(
    chainId: CurrentChainId,
    signer?: INotNullSigner
  ) => {
    if (!config.contractsJSON) {
      warn('No `contractsJSON` in config', config)
      return {} as UseContracts<
        Cast<
          Contracts['on'][CurrentChainId],
          Record<string, ContractDefinition<any, any>>
        >,
        ChainIds[number]
      >
    }

    const contractsJSON = config.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts

    return genContractObjects(
      config,
      chainId as ChainId,
      config.contracts?.on[chainId] ??
        ({} as Record<string, ContractDefinition<any, any>>),
      allContracts,
      signer
    ) as UseContracts<
      Cast<Contracts['on'][CurrentChainId], Record<string, ContractDefinition<any, any>>>,
      ChainIds[number]
    >
  }
}
