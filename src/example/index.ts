import { sha256 } from 'ethers/lib/utils'
import { defineEvmConfig } from '../config'
import { mockAdapter, mockContractsJSON, type MockContract } from '../mocks'
import { contractType } from '../modules/contracts'

const useEvm = defineEvmConfig({
  contractsJSON: mockContractsJSON,
  chainIds: ['1', '56'],
  DEFAULT_CHAINID: '56',
  contracts: {
    shared: {
      token: {
        name: 'Token',
        type: contractType<MockContract>(),
      },
    },
    on: {},
  },
  adapter: mockAdapter,
})

const { useContracts, useContractsOnChain, useEvents, getRpc, getProvider } = useEvm()

const { token } = useContracts()

// type F<C extends '1' | '2' = any> = {
//   readonly c: C
// }

// const a = <CE extends '1' | '2', FE extends F<CE>>(fe: FE) => fe

// a({
//   c: '',
// })
