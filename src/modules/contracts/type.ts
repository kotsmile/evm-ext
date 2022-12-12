export type ContractsJSONStruct = {
  [ChainId in string]: {
    name: string
    chainId: ChainId
    contracts: Record<
      string,
      {
        address: string
        abi: any
      }
    >
  }[]
}

export type AppChainIds<ContractsJSON extends ContractsJSONStruct> =
  (keyof ContractsJSON)[]

export type ContractNameOnChainId<
  ContractsJSON extends ContractsJSONStruct,
  ChainId extends AppChainIds<ContractsJSON>[number]
> = keyof ContractsJSON[ChainId][0]['contracts']

export type ContractDefinition<
  ContractsJSON extends ContractsJSONStruct,
  ChainId extends AppChainIds<ContractsJSON>[number]
> = {
  name: ContractNameOnChainId<ContractsJSON, ChainId>
  withAddress?: boolean
  type?: any
}

export type ContractsDefinitionShared<
  ContractsJSON extends ContractsJSONStruct,
  ChainId extends AppChainIds<ContractsJSON>[number]
> = Record<string, ContractDefinition<ContractsJSON, ChainId>>

export type ContractsDefinitionOnChain<
  ContractsJSON extends ContractsJSONStruct,
  ChainId extends AppChainIds<ContractsJSON>[number]
> = {
  [CurrentChainId in ChainId]?: Record<
    string,
    ContractDefinition<ContractsJSON, CurrentChainId>
  >
}
export type ContractsDefinition<
  ContractsJSON extends ContractsJSONStruct,
  ChainId extends AppChainIds<ContractsJSON>[number]
> = {
  shared: ContractsDefinitionShared<ContractsJSON, ChainId>
  on: ContractsDefinitionOnChain<ContractsJSON, ChainId>
}
