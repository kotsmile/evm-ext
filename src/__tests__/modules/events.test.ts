import type { AdapterDefinition } from '@/adapter'
import { defineEvmConfig } from '@/config'
import { mockAdapter, mockState } from '@/mocks'

import { EventsModule, StoreModule } from '@/modules'

describe('Events Module', () => {
  it('should trigger "init" event on init()', function (done) {
    const useTestEvm = defineEvmConfig({
      DEBUG: false,
      modules: {
        ...EventsModule(),
        ...StoreModule({
          stores: {
            testStore: {
              async onInit() {
                done()
                return true
              },
              ...({} as any),
            },
          },
        }),
      },
      adapter: mockAdapter,
    })

    const { init } = useTestEvm()
    init()
  })
})
