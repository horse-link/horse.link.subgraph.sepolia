import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { Market, Placed__Params } from "../../generated/Market/Market";
import { Bet } from "../../generated/schema";
import { getMarketAssetAddress } from "../addresses";
import { incrementBets } from "./aggregator";

export function getBetId(id: string, marketAddress: string): string {
  return `BET_${marketAddress.toLowerCase()}_${id}`;
}

export function createBetEntity(params: Placed__Params, amount: BigInt, payout: BigInt, timestamp: BigInt, marketAddress: string, hash: Bytes): Bet {
  // check if entity exists already
  let entity = Bet.load(params.index.toString());
  // if the bet does not exist already
  if (entity == null) {
    // increment bets in aggregator
    incrementBets(timestamp);
    // create the entity with the index param as the id - this will allow it to be fetched from a settled event by its id
    entity = new Bet(getBetId(params.index.toString(), marketAddress));
  }

  // assign bet params
  entity.propositionId = params.propositionId;
  entity.marketId = params.marketId;

  // amount and payout are formatted to 18 decimals
  entity.amount = amount;
  entity.payout = payout;

  // get payout date
  const marketContract = Market.bind(Address.fromString(marketAddress));
  const struct = marketContract.getBetByIndex(params.index);
  const payoutDate = struct.getValue2();
  entity.payoutAt = payoutDate;

  // toHexString is best for formatting addresses to strings
  entity.owner = params.owner.toHexString().toLowerCase();

  // store the market address
  entity.marketAddress = marketAddress.toLowerCase();

  // store the asset address
  entity.assetAddress = getMarketAssetAddress(Address.fromString(marketAddress));

  // store the timestamp for when the bet is created, and the hash for the tx
  entity.createdAt = timestamp;
  entity.createdAtTx = hash.toHexString().toLowerCase();

  // intialize bets as being unsettled
  entity.settled = false;

  // initialize bets as a loss - will reflect accurately when settled is true
  entity.didWin = false;

  // set default value for settledAt and settledAtTx
  entity.settledAt = BigInt.zero();
  entity.settledAtTx = "";

  entity.save();

  // return newly created entity
  return entity;
};
