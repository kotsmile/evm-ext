import type { State } from '@/modules/state'
import type { ToolsFunction } from '@/config/type'

export type Adapter<AdapterTools = any> = {
  state: () => State
  tools?: ToolsFunction<AdapterTools>
}
