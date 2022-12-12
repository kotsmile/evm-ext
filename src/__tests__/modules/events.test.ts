import type { Adapter } from '../../adapter'
import { defineEvmConfig } from '../../config'

describe('Events Module', () => {
  it('should trigger "init" event on init()', function (done) {
    let testState: any = {
      wallet: {},
      events: {},
    }

    const testAdapter: Adapter = () => ({
      state: testState,
    })

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
