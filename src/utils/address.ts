import { ethers } from 'ethers'
export type Address = string & { _brand: 'Address' }
export const isAddress = (address: string): address is Address =>
  ethers.utils.isAddress(address)
