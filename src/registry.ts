import { log } from "@graphprotocol/graph-ts";
import {
  MarketAdded,
  VaultAdded,
  ThresholdUpdated
} from "../generated/Registry/Registry";
import { incrementMarkets, incrementVaults } from "./utils/aggregator";
import { addMarketToRegistry, addVaultToRegistry } from "./utils/registry";

export function handleMarketAdded(event: MarketAdded): void {
  const address = event.params.market;
  addMarketToRegistry(address, event.block.timestamp);
  log.info(`Market registered ${address.toHexString()}`, []);

  // increment markets in aggregator
  incrementMarkets(event.block.timestamp);
}

export function handleVaultAdded(event: VaultAdded): void {
  const address = event.params.vault;
  addVaultToRegistry(address, event.block.timestamp);
  log.info(`Vault registered ${address.toHexString()}`, []);

  // increment vaults in aggregator
  incrementVaults(event.block.timestamp);
}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}