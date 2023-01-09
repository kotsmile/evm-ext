import { Contract } from 'ethers'
import type { BaseContract } from 'ethers'

import type { EvmConfig } from '@/config/type'
import type { ChainId, Cast, INotNullSigner } from '@/utils'

import { useModule } from '@/config/utils'
import { ChainModule } from '@/modules'

import { keyOf } from '@/utils'

import type {
  AppChainIds,
  ContractsJSONStruct,
  ContractsDefinition,
  ContractDefinition,
  ContractsParams,
} from './type'

import { logger } from './utils'

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

    const chain = useModule(config, ChainModule)
    if (!chain) return obj

    const cFunc = (address: string, chainId: ChainId) =>
      new Contract(address, abi, signer ?? chain.getProvider(chainId))
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
  config: EvmConfig,
  params: ContractsParams<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return (signer?: INotNullSigner) => {
    if (!params.DEFAULT_CHAINID) {
      logger.warn('No `DEFAULT_CHAINID` in "params"')
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const chainId = params.DEFAULT_CHAINID // TODO: get actual chainId from web3 store like

    if (!params.contractsJSON) {
      logger.warn('No `contractsJSON` in "params"')
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const contractsJSON = params.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts ?? {}

    return genContractObjects(
      config,
      chainId as ChainId,
      params.contracts?.shared ?? {},
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
  config: EvmConfig,
  params: ContractsParams<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return <CurrentChainId extends ChainIds[number]>(
    chainId: CurrentChainId,
    signer?: INotNullSigner
  ) => {
    if (!params.contractsJSON) {
      logger.warn('No `contractsJSON` in "params"')
      return {} as UseContracts<
        Cast<
          Contracts['on'][CurrentChainId],
          Record<string, ContractDefinition<any, any>>
        >,
        ChainIds[number]
      >
    }

    const contractsJSON = params.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts

    return genContractObjects(
      config,
      chainId as ChainId,
      params.contracts?.on[chainId] ??
        ({} as Record<string, ContractDefinition<any, any>>),
      allContracts,
      signer
    ) as UseContracts<
      Cast<Contracts['on'][CurrentChainId], Record<string, ContractDefinition<any, any>>>,
      ChainIds[number]
    >
  }
}
