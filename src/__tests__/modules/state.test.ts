import { expect } from 'chai'

import { defineEvmConfig } from '../../config'

import state_config from '../../modules/state'
import type { State } from '../../modules/state'

import type { Adapter } from '../../adapter'

export let testState: any = {
  wallet: {},
}

export const testAdapter: Adapter = () => ({
  state: <any>{
    wallet: new Proxy({} as State['wallet'], {
      get: (_, k: keyof State['wallet']) => testState.wallet[k],
      set: (_, k: keyof State['wallet'], v: string) => {
        testState.wallet[k] = v
        return true
      },
    }),
  },
})

const useTestEvm = defineEvmConfig({
  adapter: testAdapter,
})
const { config: testConfig } = useTestEvm()

describe('State module', () => {
  beforeEach(
    () =>
      (testState = {
        wallet: {},
      })
  )
  it('should set value', () => {
    const state = state_config(testConfig)

    const n = 'wallet'
    const k = 'wallet'
    const v = '0xtest'

    state[n][k] = v
    expect(testState[n][k]).eq(v)
  })
  it('should get value', () => {
    const state = state_config(testConfig)

    const n = 'wallet'
    const k = 'wallet'
    const v = '0xtest'

    testState[n] = { [k]: v }

    expect(state[n][k]).eq(v)
  })
})
