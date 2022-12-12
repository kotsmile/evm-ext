import type { EvmConfig } from '../../config/type'

export default (config: EvmConfig) => ({})

export { init } from './init'
export type {
  OnStoreLifecycle,
  StoreDefinition,
  StoreLifecycle,
  StoreLifecycleCallback,
  StoresDefinition,
} from './type'
