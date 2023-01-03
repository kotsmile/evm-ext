import { expect } from 'chai'

import { defineEvmConfig } from '@/config'
import type { AdapterDefinition } from '@/adapter'
import { mockState, mockAdapter } from '@/mocks'

const useTestEvm = defineEvmConfig({
  adapter: mockAdapter,
  DEBUG: false,
})

describe('State module', () => {
  it('should set value', () => {
    const { useWalletState } = useTestEvm()

    const k = 'wallet'
    const v = '0xtest1'

    useWalletState()[k] = v
    expect(mockState['$wallet'][k]).eq(v)
  })
  it('should get value', () => {
    const { useWalletState } = useTestEvm()

    const n = '$wallet'
    const k = 'wallet'
    const v = '0xtest2'

    mockState[n] = { [k]: v }

    expect(useWalletState()[k]).eq(v)
  })
})
