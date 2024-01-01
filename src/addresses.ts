import { Address } from "@graphprotocol/graph-ts";
import { Registry } from "../generated/schema";
import { Market } from "../generated/Market/Market";
import { Vault } from "../generated/Vault/Vault";

function _makeLowerCase(value: string, index: i32, self: Array<string>): string {
  return value.toLowerCase();
}

export function isHorseLinkMarket(address: string): bool {
  const registry = Registry.load("registry");
  if (registry == null) return false;

  const markets = registry.markets;
  return markets.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function isHorseLinkVault(address: string): bool {
  const registry = Registry.load("registry");
  if (registry == null) return false;

  const vaults = registry.vaults;
  return vaults.map<string>(_makeLowerCase).includes(address.toLowerCase());
}

export function getVaultDecimals(vaultAddress: Address): number {
  const vaultContract = Vault.bind(vaultAddress);
  return vaultContract.decimals();
}

export function getMarketDecimals(marketAddress: Address): number {
  const marketContract = Market.bind(marketAddress);
  const vaultAddress = marketContract.getVaultAddress();
  return getVaultDecimals(vaultAddress);
}

export function getMarketAssetAddress(marketAddress: Address): string {
  const marketContract = Market.bind(marketAddress);
  const vaultAddress = marketContract.getVaultAddress();
  const vaultContract = Vault.bind(vaultAddress);
  return vaultContract.asset().toHexString().toLowerCase();
}