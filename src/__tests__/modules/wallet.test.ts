import { defineEvmConfig } from '@/config'
import { useWallet_config } from '@/modules/wallet/use'
import { mockAdapter } from '@/mocks'

const useTestEvm = defineEvmConfig({
  DEBUG: false,
  adapter: mockAdapter,
})
const { config: testConfig, init } = useTestEvm()

describe('Wallet State', () => {
  it('should connect with walletconnect', async () => {
    await init()

    const useWallet = useWallet_config(testConfig)

    // await connect('walletconnect')
  })
})
