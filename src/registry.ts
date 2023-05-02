import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Registry as RegistryContract,
  MarketAdded,
  MarketRemoved,
  ThresholdUpdated,
  VaultAdded,
  VaultRemoved
} from "../generated/Registry/Registry";
import { Registry } from "../generated/schema";
import {
  incrementMarkets,
  decrementMarkets,
  incrementVaults,
  decrementVaults
} from "./aggregator";

function _getRegistry(): Registry {
  let entity = Registry.load("registry");
  if (!entity) {
    entity = new Registry("registry");
    entity.markets = [];
    entity.vaults = [];
  }

  return entity;
}

function _updateMarkets(registryAddress: Address): string[] {
  // when a market is added the state is updated
  const registry = RegistryContract.bind(registryAddress);
  const totalMarkets = registry.marketCount().toI32();
  const newMarketsArray = new Array<string>(totalMarkets);
  for (let i = 0; i < totalMarkets; i++) {
    newMarketsArray[i] = registry.markets(BigInt.fromI32(i)).toHexString();
  }
  return newMarketsArray;
}

function _updateVaults(registryAddress: Address): string[] {
  // same for vaults
  const registry = RegistryContract.bind(registryAddress);
  const totalVaults = registry.vaultCount().toI32();
  const newVaultsArray = new Array<string>(totalVaults);
  for (let i = 0; i < totalVaults; i++) {
    newVaultsArray[i] = registry.vaults(BigInt.fromI32(i)).toHexString();
  }
  return newVaultsArray;
}

export function handleMarketAdded(event: MarketAdded): void {
  const entity = _getRegistry();

  const markets = _updateMarkets(event.address);

  entity.markets = markets;

  entity.save();

  incrementMarkets();
}

export function handleMarketRemoved(event: MarketRemoved): void {
  const entity = _getRegistry();

  const markets = _updateMarkets(event.address);

  entity.markets = markets;

  entity.save();

  decrementMarkets();
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}

export function handleVaultAdded(event: VaultAdded): void {
  const entity = _getRegistry();

  const vaults = _updateVaults(event.address);

  entity.vaults = vaults;

  entity.save();

  incrementVaults();
}

export function handleVaultRemoved(event: VaultRemoved): void {
  const entity = _getRegistry();

  const vaults = _updateVaults(event.address);

  entity.vaults = vaults;

  entity.save();

  decrementVaults();
}
