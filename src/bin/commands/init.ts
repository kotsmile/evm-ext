import * as fs from 'fs'
import * as path from 'path'

const EVM_CONFIG_TS = `import { defineEvmConfig } from 'evm-ext'

export const useEvm = defineEvmConfig({
  adapter: {} as any,
})
`

export default async function ({ path }: { path: string }) {
  fs.writeFileSync(path, EVM_CONFIG_TS)
}
