import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Registry } from "../../generated/schema";

function _initialiseRegistry(): Registry {
  const registryEntity = new Registry("registry");

  const emptyArray: string[] = [];

  registryEntity.vaults = emptyArray;
  registryEntity.markets = emptyArray;
  registryEntity.lastUpdate = BigInt.zero();

  return registryEntity;
};

function _getRegistry(): Registry {
  let registryEntity = Registry.load("registry");
  if (registryEntity == null) {
    registryEntity = _initialiseRegistry();
  }
  return registryEntity;
};

export function addMarketToRegistry(address: Address, timestamp: BigInt): void {
  const registryEntity = _getRegistry();

  const markets = registryEntity.markets;
  markets.push(address.toHexString().toLowerCase());

  registryEntity.markets = markets;

  registryEntity.lastUpdate = timestamp;
  registryEntity.save();
}

export function addVaultToRegistry(address: Address, timestamp: BigInt): void {
  const registryEntity = _getRegistry();

  const vaults = registryEntity.vaults;
  vaults.push(address.toHexString().toLowerCase());

  registryEntity.vaults = vaults;

  registryEntity.lastUpdate = timestamp;
  registryEntity.save();
};
