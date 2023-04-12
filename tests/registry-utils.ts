import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MarketAdded,
  MarketRemoved,
  ThresholdUpdated,
  VaultAdded,
  VaultRemoved
} from "../generated/Registry/Registry"

export function createMarketAddedEvent(market: Address): MarketAdded {
  let marketAddedEvent = changetype<MarketAdded>(newMockEvent())

  marketAddedEvent.parameters = new Array()

  marketAddedEvent.parameters.push(
    new ethereum.EventParam("market", ethereum.Value.fromAddress(market))
  )

  return marketAddedEvent
}

export function createMarketRemovedEvent(market: Address): MarketRemoved {
  let marketRemovedEvent = changetype<MarketRemoved>(newMockEvent())

  marketRemovedEvent.parameters = new Array()

  marketRemovedEvent.parameters.push(
    new ethereum.EventParam("market", ethereum.Value.fromAddress(market))
  )

  return marketRemovedEvent
}

export function createThresholdUpdatedEvent(
  threshold: BigInt
): ThresholdUpdated {
  let thresholdUpdatedEvent = changetype<ThresholdUpdated>(newMockEvent())

  thresholdUpdatedEvent.parameters = new Array()

  thresholdUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "threshold",
      ethereum.Value.fromUnsignedBigInt(threshold)
    )
  )

  return thresholdUpdatedEvent
}

export function createVaultAddedEvent(vault: Address): VaultAdded {
  let vaultAddedEvent = changetype<VaultAdded>(newMockEvent())

  vaultAddedEvent.parameters = new Array()

  vaultAddedEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )

  return vaultAddedEvent
}

export function createVaultRemovedEvent(vault: Address): VaultRemoved {
  let vaultRemovedEvent = changetype<VaultRemoved>(newMockEvent())

  vaultRemovedEvent.parameters = new Array()

  vaultRemovedEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )

  return vaultRemovedEvent
}
