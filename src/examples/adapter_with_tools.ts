import { defineEvmConfig } from '@/config'
import { mockAdapter, mockContractsJSON, mockState, type MockContract } from '@/mocks'
import { contractType } from '@/modules/contracts'
import { typeOf } from '@/utils'

const useEvm = defineEvmConfig({
  contractsJSON: mockContractsJSON,
  chainIds: ['1', '56'],
  DEFAULT_CHAINID: '1',
  contracts: {
    shared: {
      token: {
        name: 'Token',
        type: typeOf<MockContract>(),
      },
    },
    on: {},
  },
  adapter: {
    state: mockState,
    tools: () => ({
      helloTool: () => {
        console.log('hello world')
      },
    }),
  },
})

const { tools } = useEvm()
const { helloTool } = tools
