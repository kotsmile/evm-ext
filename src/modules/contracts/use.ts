import { Contract } from 'ethers'
import type { BaseContract } from 'ethers'

import type { EvmConfig } from '@/config/type'

import type { INotNullSigner } from '@/utils/chain/type'
import type { ChainId } from '@/utils/chain'
import type { Cast } from '@/utils/type'
import { keyOf } from '@/utils'

import type {
  AppChainIds,
  ContractsJSONStruct,
  ContractsDefinition,
  ContractDefinition,
  ContractsConfig,
} from './type'

import chainModule from '@/modules/chain'
import { logger } from './utils'
import { useModule } from '@/config/utils'

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

    const chain = useModule(config, chainModule)
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
  contractsConfig: ContractsConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return (signer?: INotNullSigner) => {
    if (!contractsConfig.DEFAULT_CHAINID) {
      logger.warn('No `DEFAULT_CHAINID` in config')
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const chainId = contractsConfig.DEFAULT_CHAINID // TODO: get actual chainId from web3 store like

    if (!contractsConfig.contractsJSON) {
      logger.warn('No `contractsJSON` in config')
      return {} as UseContracts<Contracts['shared'], ChainIds[number]>
    }

    const contractsJSON = contractsConfig.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts ?? {}

    return genContractObjects(
      config,
      chainId as ChainId,
      contractsConfig.contracts?.shared ?? {},
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
  contractsConfig: ContractsConfig<ContractsJSON, ChainIds, DefaultChainId, Contracts>
) => {
  return <CurrentChainId extends ChainIds[number]>(
    chainId: CurrentChainId,
    signer?: INotNullSigner
  ) => {
    if (!contractsConfig.contractsJSON) {
      logger.warn('No `contractsJSON` in config')
      return {} as UseContracts<
        Cast<
          Contracts['on'][CurrentChainId],
          Record<string, ContractDefinition<any, any>>
        >,
        ChainIds[number]
      >
    }

    const contractsJSON = contractsConfig.contractsJSON
    const allContracts = contractsJSON[chainId][0].contracts

    return genContractObjects(
      config,
      chainId as ChainId,
      contractsConfig.contracts?.on[chainId] ??
        ({} as Record<string, ContractDefinition<any, any>>),
      allContracts,
      signer
    ) as UseContracts<
      Cast<Contracts['on'][CurrentChainId], Record<string, ContractDefinition<any, any>>>,
      ChainIds[number]
    >
  }
}
