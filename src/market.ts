import { Placed, Settled, Borrowed, Repaid } from "../generated/Market/Market";
import { Borrow, Repay, Registry, Bet } from "../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { incrementBets } from "./aggregator";

function _isHorseLinkMarket(address: string): bool {
  const registry = Registry.load("registry");
  if (!registry) {
    throw new Error("No Registry");
  }

  return registry.markets.includes(address);
}

function _createBetId(address: string, id: i32): string {
  return `BET_${address}_${id}`;
}

export function handlePlaced(event: Placed): void {
  const marketAddress = event.address.toHexString();
  if (!_isHorseLinkMarket(marketAddress)) {
    return;
  }

  const id = _createBetId(marketAddress, event.params.index.toI32());
  const entity = new Bet(id);

  entity.marketId = event.params.marketId.toString();
  entity.propositionId = event.params.propositionId.toString();
  entity.amount = event.params.amount;
  entity.payout = event.params.payout;
  entity.owner = event.params.owner.toHexString();

  entity.createdAt = event.block.timestamp;

  // zeroed
  entity.settled = false;
  entity.result = 0;
  entity.recipient = Address.zero().toHexString();
  entity.settledAt = BigInt.zero();

  entity.save();

  // increase bets
  incrementBets();
}

export function handleSettled(event: Settled): void {
  const marketAddress = event.address.toHexString();
  if (!_isHorseLinkMarket(marketAddress)) {
    return;
  }

  const id = _createBetId(marketAddress, event.params.index.toI32());
  const entity = Bet.load(id);
  if (!entity) {
    throw new Error(`Cannot get bet, ${id}`);
  }

  entity.settled = true;
  entity.result = event.params.result;
  entity.recipient = event.params.recipient.toHexString();
  entity.settledAt = event.block.timestamp;

  entity.save();
}

export function handleBorrowed(event: Borrowed): void {
  const marketAddress = event.address.toHexString();
  if (!_isHorseLinkMarket(marketAddress)) {
    return;
  }

  const entity = new Borrow(event.transaction.hash.toHexString());
  const betId = _createBetId(marketAddress, event.params.index.toI32());

  entity.betId = betId;
  entity.amount = event.params.amount;
  entity.createdAt = event.block.timestamp;

  entity.save();
}

export function handleRepaid(event: Repaid): void {
  if (!_isHorseLinkMarket(event.address.toHexString())) {
    return;
  }

  const entity = new Repay(event.transaction.hash.toHexString());
  entity.vault = event.params.vault.toHexString();
  entity.amount = event.params.amount;
  entity.createdAt = event.block.timestamp;

  entity.save();
}
