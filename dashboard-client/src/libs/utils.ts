import { WalletContext } from '@/store/GlobalContext';
import { EIP1193Provider } from '@web3-onboard/core';
import { ethers } from 'ethers';
import { useContext } from 'react';

export const addressToDetNum = (walletAddress: string, maxValue: number) => {
  const parsedHashValue = ethers.utils.keccak256(walletAddress).slice(-6);
  const decimal = parseInt(parsedHashValue, 16);
  return (decimal % maxValue) + 1;
};

export const reviseAddress = (walletAddress: string) => {
  return walletAddress.slice(0, 6).concat('...').concat(walletAddress.slice(-4));
};

export type providerType = ethers.providers.JsonRpcProvider;

export const getProvider = (walletProvider: EIP1193Provider) => {
  return new ethers.providers.Web3Provider(walletProvider) as providerType;
};

export const getSigner = (walletProvider: EIP1193Provider) => {
  const provider = getProvider(walletProvider);
  return provider.getSigner();
};

export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function decimals() view returns (uint)',
  'function transfer(address to, uint256 amount)',
];
