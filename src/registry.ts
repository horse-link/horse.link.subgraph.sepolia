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

const ADDRESS = Address.fromString(
"0xBE0007d2A90fE50569374d5AA78644424D49F568"
);

function _getRegistry(): Registry {
  let entity = Registry.load("registry");
  if (!entity) {
    entity = new Registry("registry");
    entity.markets = [];
    entity.vaults = [];
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

  incrementMarkets();
}

export function handleMarketRemoved(event: MarketRemoved): void {
  const entity = _getRegistry();

  const markets = _updateMarkets();

  entity.markets = markets;

  entity.save();

  decrementMarkets();
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}

export function handleVaultAdded(event: VaultAdded): void {
  const entity = _getRegistry();

  const vaults = _updateVaults();

  entity.vaults = vaults;

  entity.save();

  incrementVaults();
}

export function handleVaultRemoved(event: VaultRemoved): void {
  const entity = _getRegistry();

  const vaults = _updateVaults();

  entity.vaults = vaults;

  entity.save();

  decrementVaults();
}
