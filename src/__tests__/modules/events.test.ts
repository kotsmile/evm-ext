import type { AdapterDefinition } from '@/adapter'
import { defineEvmConfig } from '@/config'
import { mockAdapter, mockState } from '@/mocks'

describe('Events Module', () => {
  it('should trigger "init" event on init()', function (done) {
    const useTestEvm = defineEvmConfig({
      DEBUG: false,
      stores: {
        testStore: {
          async onInit() {
            done()
            return true
          },
          ...({} as any),
        },
      },
      adapter: mockAdapter,
    })

    const { init } = useTestEvm()
    init()
  })
})
