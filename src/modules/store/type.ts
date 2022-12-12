export const storeLifecycles = ['init', 'login', 'final', 'logout'] as const

export type StoreLifecycle = typeof storeLifecycles[number]

export type OnStoreLifecycle<L extends StoreLifecycle> = `on${Capitalize<L>}`
export type StoreLifecycleCallback = () => Promise<boolean>

export type StoreDefinition = {
  [L in StoreLifecycle as OnStoreLifecycle<L>]: StoreLifecycleCallback
} & {
  isLoading: () => Promise<boolean>
}
export type StoresDefinition = Record<string, StoreDefinition>
