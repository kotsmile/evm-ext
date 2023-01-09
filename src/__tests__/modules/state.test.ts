import { expect } from 'chai'

import { defineEvmConfig } from '@/config'
import { mockState, mockAdapter } from '@/mocks'
import { WalletModule, ContractsModule } from '@/modules'

const useTestEvm = defineEvmConfig({
  modules: {
    ...WalletModule({
      wallets: {},
      options: {},
    }),
    ...ContractsModule({}),
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
