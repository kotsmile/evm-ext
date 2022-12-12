# Evm Ext

## PROJECT IN `ALPHA`

## Example of Usage

- [`vue3-evm-app`](https://github.com/kotsmile/examples-evm-ext)

## What is it for ?

`evm-ext` - tool for interacting with EVM-compliant blockchains and blockchain contracts

### Typescript Disclamer

This package make Blockchain integration stongly typed

## Getting started

```console
# install package
yarn add evm-ext@latest
# init config file
npx evm-ext init -p ./src/evm.config.ts
```

## Config file

```typescript
import { defineEvmConfig, modules, utils } from 'evm-ext'

import type { Token, Staking } from './contracts/typechain'
import contractsJSON from './contracts/contracts.json'

export const useEvm = defineEvmConfig({
  /// contratcts' source file with chains, addresses and ABIs
  contractsJSON,
  /// target chainIds for your DApp
  chainIds: ['97'],
  /// default chainId for your DApp (chain which `evm-ext` will connect your users)
  DEFAULT_CHAINID: '97',
  /// rpc function for provider
  rpc: utils.rpc.universalRpc(),
  /// contracts definition
  contracts: {
    /// contracts shared on all chains in `chainIds`
    shared: {
      /// name of contract
      staking: {
        /// name of contract in `contractsJSON`
        name: 'Staking',
        /// type of contract generated by `typechain` package (optional)
        type: modules.contracts.contractType<Staking>(),
      },
    },
    /// contracts on specific chains
    on: {
      '97': {
        anyToken: {
          /// name of contract in `contractsJSON`
          name: 'Token',
          /// type of contract generated by `typechain` package (optional)
          type: modules.contracts.contractType<Token>(),
          /// you can user this contract with any address and any chain (optional)
          withAddress: true,
        },
      },
    },
  },
  /// objects which will be triggered on specific lifecycles
  stores: {},
  /// adapter for connection `evm-ext` to different frameworks and environments
  adapter,
})
```

## ContractsJSON

It is source file for your contracts (generated by [`hardhat-deploy`](https://www.npmjs.com/package/hardhat-deploy) plugin for [`hardhat`](https://www.npmjs.com/package/hardhat))

```typescript
export type ContractsJSONStruct = {
  [ChainId in string]: {
    name: string
    chainId: ChainId
    contracts: Record<
      string,
      {
        address: string
        abi: any
      }
    >
  }[]
}
```

### Example

```json
{
    "97": {
        [
            {
                "name": "bsc_testnet",
                "chainId": "97",
                "contracts": {
                    "Token": {
                        "address": "0xSomeAddress",
                        "abi": [
                            ...
                        ]
                    }
                }
            }
        ]
    },
    ...
}
```

## Wallet connection

You can use `useEvm` function to connect to different wallets in browser

- Metamask
- WalletConnect
- CoinBase

And more in future

### Exmaple of connection

```typescript
import { useEvm } from './emv.config.ts'

const { useWallet } = useEvm()
const { connect } = useWallet()

connect('metamask')
// connect('walletconnect')
// connect('coinbase')
```

All information about user connection will be saved in state of package
For example for `vue3` state is `pinia` stores

## Contract Interaction

You can interact with contracts by using `useContracts`, everything strongly typed

```typescript
import { useEvm, safeRead } from './emv.config.ts'
const { useContracts } = useEvm()

async function main() {
  const { token } = useContracts()
  const symbol = await safeRead(token.symbol(), 'TKN')
}
```

### Safe calls

`evm-ext` has three function for safe call to contracts

- `safe` - make safe async call and returns `[response, error]`
- `safeRead` - make safe async read call to contract with default value, if call is success returns `response` otherwise `defaultValue`
- `safeWrite` - make safe async write call to contract with auto `tx.wait()` and returns `[tx, rpt]` - Transaction object and Reciept object from `ethers`

## Lifecycles

`evm-ext` has lifecycles

- `init` - lifecycle which runs on start of app
- `login` - lifecycle which runs on user connection
- `logout` - lifecycle which runs on user disconnection
- `final` - lifeycycle which runs every time on any lifecycles
