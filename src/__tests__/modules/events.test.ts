import type { AdapterDefinition } from '@/adapter'
import { defineEvmConfig } from '@/config'

describe('Events Module', () => {
  it('should trigger "init" event on init()', function (done) {
    let state: any = {
      wallet: {},
      events: {},
    }

    const testAdapter: AdapterDefinition = {
      state: () => state,
    }

    const useTestEvm = defineEvmConfig({
      stores: {
        testStore: {
          async onInit() {
            done()
            return true
          },
          ...({} as any),
        },
      },
      adapter: testAdapter,
    })

    const { init } = useTestEvm()
    init()
  })
})
