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

// TODO: fill in
const ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

function _getRegistry(): Registry {
  let entity = Registry.load("registry");
  if (!entity) {
    entity = new Registry("registry");
  }

  return entity;
}

function _updateMarkets(): string[] {
  // when a market is added the state is updated
  const totalMarkets = RegistryContract.bind(ADDRESS)
    .marketCount()
    .toI32();
  const newMarketsArray = new Array<string>(totalMarkets).map<string>(
    (_, index) => {
      return RegistryContract.bind(ADDRESS)
        .markets(BigInt.fromI32(index))
        .toHexString();
    }
  );

  return newMarketsArray;
}

function _updateVaults(): string[] {
  // same for vaults
  const totalVaults = RegistryContract.bind(ADDRESS)
    .vaultCount()
    .toI32();
  const newVaultsArray = new Array<string>(totalVaults).map<string>(
    (_, index) => {
      return RegistryContract.bind(ADDRESS)
        .vaults(BigInt.fromI32(index))
        .toHexString();
    }
  );

  return newVaultsArray;
}

export function handleMarketAdded(event: MarketAdded): void {
  const entity = _getRegistry();

  const markets = _updateMarkets();

  entity.markets = markets;

  entity.save();
}

export function handleMarketRemoved(event: MarketRemoved): void {
  const entity = _getRegistry();

  const markets = _updateMarkets();

  entity.markets = markets;

  entity.save();
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}

export function handleVaultAdded(event: VaultAdded): void {
  const entity = _getRegistry();

  const vaults = _updateVaults();

  entity.vaults = vaults;

  entity.save();
}

export function handleVaultRemoved(event: VaultRemoved): void {
  const entity = _getRegistry();

  const vaults = _updateVaults();

  entity.vaults = vaults;

  entity.save();
}
