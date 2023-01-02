import type { EventsState } from '@/modules/events'
import type { WalletState } from '@/modules/wallet'

export type State = EventsState & WalletState

export type Namespace = keyof State
export type Key<N extends Namespace> = keyof State[N]
export type Value<N extends Namespace, K extends Key<N>> = State[N][K]
