import { expect } from 'chai'

import { defineEvm } from '@/core'
import { mockState, mockAdapter } from '@/mocks'
import { Wallet, Contracts } from '@/modules'

const useTestEvm = defineEvm({
  modules: {
    ...Wallet({
      wallets: {},
      options: {},
    }),
    ...Contracts({}),
  },
  adapter: mockAdapter,
  DEBUG: false,
})

describe('State module', () => {
  it('should set value', () => {
    const { wallet } = useTestEvm()

    const k = 'wallet'
    const v = '0xtest1'

    wallet.useWalletState()[k] = v
    expect(mockState['$wallet'][k]).eq(v)
  })
  it('should get value', () => {
    const { wallet } = useTestEvm()

    const n = '$wallet'
    const k = 'wallet'
    const v = '0xtest2'

    mockState[n] = { [k]: v }

    expect(wallet.useWalletState()[k]).eq(v)
  })
})
