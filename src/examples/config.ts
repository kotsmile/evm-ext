import { mockAdapter } from '@/mocks'
import { defineEvmConfig } from '@/config'

import chain from '@/modules/chain'
import events from '@/modules/events'

import { ankrRpc } from '@/utils/chain/rpc'

const useEvm = defineEvmConfig({
  DEBUG: true,
  modules: {
    chain: chain({
      rpc: ankrRpc(),
    }),
    events,
  },
  adapter: mockAdapter,
})

const { config, init } = useEvm()

// const a = [
//   {
//     b: {
//       b_1: '1',
//       b_2: '2',
//     },
//   },
//   {
//     b: {
//       b_13: '1',
//       b_23: '2',
//     },
//   },
// ] as const

// type A = typeof a
// type Filter<N, M> = N extends M ? N : never

// type B = {
//   [n in keyof A[Filter<keyof A, number>]['b']]: A[Filter<keyof A, number>]['b'][n]
// }
// const b = {} as B
