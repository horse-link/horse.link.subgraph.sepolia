import { BigInt } from "@graphprotocol/graph-ts"
import {
  Registry,
  MarketAdded,
  MarketRemoved,
  ThresholdUpdated,
  VaultAdded,
  VaultRemoved
} from "../generated/Registry/Registry"
import { ExampleEntity } from "../generated/schema"

export function handleMarketAdded(event: MarketAdded): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.market = event.params.market

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.marketCount(...)
  // - contract.markets(...)
  // - contract.vaultCount(...)
  // - contract.vaults(...)
}

export function handleMarketRemoved(event: MarketRemoved): void {}

export function handleThresholdUpdated(event: ThresholdUpdated): void {}

export function handleVaultAdded(event: VaultAdded): void {}

export function handleVaultRemoved(event: VaultRemoved): void {}
