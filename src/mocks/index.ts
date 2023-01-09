import type { BaseContract } from 'ethers'

import type { adapter } from '@/index'
import type { ContractsJSONStruct } from '@/modules/contracts'
import type { EvmContext, ToolsFunction } from '@/core/type'

export const mockState = {} as any

export const mockCreateState = <State>(
  name: string,
  state: (ctx: EvmContext) => State
) => {
  return (ctx: EvmContext) => {
    if (name in mockState) return mockState[name]
    return (mockState[name] = state(ctx))
  }
}

export const mockTools = ((ctx) => ({
  helloTool: () => console.log('hello world'),
  printConfig: () => console.log(ctx),
})) satisfies ToolsFunction

export const mockAdapter = {
  state: {
    createState: mockCreateState,
  },
  tools: mockTools,
} satisfies adapter.AdapterDefinition

export const mockContractsJSON = {
  '1': [
    {
      chainId: '1',
      name: 'eth_mainnet',
      contracts: {
        Token: {
          address: '0xTokenAddress',
          abi: [],
        },
        Staking: {
          address: '0xStakingAddress',
          abi: [],
        },
      },
    },
  ],
  '56': [
    {
      chainId: '56',
      name: 'bsc_mainnet',
      contracts: {
        Token: {
          address: '0xTokenAddress',
          abi: [],
        },
        Vesting: {
          address: '0xVestingAddress',
          abi: [],
        },
      },
    },
  ],
} satisfies ContractsJSONStruct

export interface MockContract extends BaseContract {
  _mock: 'mock'
}
