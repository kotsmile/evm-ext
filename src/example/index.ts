import { defineEvmConfig } from '@/config'
import { mockAdapter, mockContractsJSON, type MockContract } from '@/mocks'
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
      // token: {
      //   name: 'Token',
      //   type: contractType<MockContract>(),
      // },
    },
    on: {},
  },
  adapter: mockAdapter,
})

const { useContracts, useContractsOnChain, useEvents, getRpc, getProvider } = useEvm()
const { token } = useContracts()

// const a = 'foo_hack_hello' as const

// ;('{foo}_{hack_hello}')

// type SnakeToCamel<
//   I extends string,
//   A extends string = ''
// > = I extends `${infer T}_${infer R}`
//   ? SnakeToCamel<R, A extends '' ? T : `${A}${Capitalize<T>}`>
//   : `${A}${Capitalize<I>}`

// type B = SnakeToCamel<typeof a>

// const b = 'fooHackHello' as const
