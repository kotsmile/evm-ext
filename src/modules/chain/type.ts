import type { ChainTag } from '@/utils/chain'

export type RpcDefinition = (chainTag: ChainTag) => string
export type ChainModuleConfig = RpcDefinition
