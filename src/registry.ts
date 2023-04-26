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
"0x6e1312e283D4152d42006dc8Eaf11A433D739fB0"
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

function _updateMarkets(registryAddress: Address): string[] {
  // when a market is added the state is updated
  const totalMarkets = RegistryContract.bind(registryAddress)
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

function _updateVaults(registryAddress: Address): string[] {
  // same for vaults
  const totalVaults = RegistryContract.bind(registryAddress)
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
