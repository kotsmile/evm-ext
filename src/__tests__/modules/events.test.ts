import type { AdapterDefinition } from '@/adapter'
import { defineEvm } from '@/core'
import { mockAdapter, mockState } from '@/mocks'

import { Events, Store } from '@/modules'

describe('Events Module', () => {
  it('should trigger "init" event on init()', function (done) {
    const useTestEvm = defineEvm({
      DEBUG: false,
      modules: {
        ...Events(),
        ...Store({
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
