import type { State } from '@/modules/state'

export type Adapter<S = State> = (...args: any) => {
  state: S
}
