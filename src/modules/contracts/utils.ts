import { ethers } from 'ethers'
import type { EvmConfig } from '../../config/type'
import { createLogger } from '../../utils'
import { getRpc_config } from '../chain/node'

export const contractType = <C>(): C => ({} as C)

export const logger = createLogger('Contracts Module')

export const getContracts = (config: EvmConfig) => {
  const contracts = config.contractsJSON
  if (!contracts) return

  try {
    const allContracts: {
      [key: string]: { contracts: { [key: string]: string }; chainId: string }
    } = {}

    for (const chainId of Object.keys(contracts)) {
      const contractInfo = (contracts as any)[chainId][0].contracts
      const chainName = (contracts as any)[chainId][0].name
      const table: { [key: string]: string } = {}

      for (const contr of Object.keys(contractInfo)) {
        if (contractInfo[contr].address === ethers.constants.AddressZero) continue
        table[contr] = contractInfo[contr].address
      }

      allContracts[chainName] = { contracts: table, chainId }
    }
    return allContracts
  } catch (e) {
    return {}
  }
}

export const debugInfo = (config: EvmConfig) => {
  const contractsAll = getContracts(config)
  if (!contractsAll) return

  for (const chainName of Object.keys(contractsAll)) {
    const chainId = contractsAll[chainName].chainId
    const table = contractsAll[chainName].contracts
    console.group(
      `%c${chainId}) ${chainName}`,
      `
          color: #${'f'.repeat(6 - (chainId.length % 6))}${chainId}; 
          background: #${'0'.repeat(6 - (chainId.length % 6))}${chainId}; 
        `
    )
    console.table(table)
    console.groupEnd()
  }

  for (const chainId of config.chainIds)
    console.log(chainId, getRpc_config(config)(chainId))

  // console.log('')
  // console.log("Pretend user: \n%cprentend('user address')", 'font-family: monospace')
  // console.log('')
  // }
}
