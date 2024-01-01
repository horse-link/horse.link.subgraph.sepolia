import { log } from "@graphprotocol/graph-ts";
import {
  Borrowed,
  OwnershipTransferred,
  Placed,
  Repaid,
  Settled,
  Transfer
} from "../generated/Market/Market";
import { Bet, Borrow, Repay } from "../generated/schema";
import { getMarketDecimals, isHorseLinkMarket } from "./addresses";
import { createBetEntity, getBetId } from "./utils/bet";
import { amountFromDecimalsToEther } from "./utils/formatting";
import { changeProtocolInPlay, changeProtocolTvl } from "./utils/protocol";
import { changeUserInPlay, changeUserPnl } from "./utils/user";

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfered(event: Transfer): void {
  const address = event.address.toHexString();
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // ease of referencing
  const id = event.params.tokenId.toString().toLowerCase();

  // format id
  const betId = getBetId(id, address);

  const betEntity = Bet.load(betId);
  if (betEntity == null) {
    log.error(`Could not find reference entity with id ${betId}`, []);
    return;
  }

  betEntity.owner = event.params.to.toHexString();
  betEntity.save();
}

export function handlePlaced(event: Placed): void {
  const address = event.address.toHexString();
  // check if event comes from horse link market, if not do nothing
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // get amount and payout to 18 decimal precision
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(event.params.amount, decimals);
  const payout = amountFromDecimalsToEther(event.params.payout, decimals);

  // create new bet entity and return it so its properties can be referenced when updating the protocol entity
  const newBetEntity = createBetEntity(
    event.params,
    amount,
    payout,
    event.block.timestamp,
    address,
    event.transaction.hash
  );

  // exposure is calculated by the payout minus the bet amount
  const exposure = newBetEntity.payout.minus(newBetEntity.amount);

  // placed bets increase total in play by the bet amount which can come from the new entity, exposure increases tvl
  changeProtocolInPlay(amount, true, event.block.timestamp);
  changeProtocolTvl(exposure, true, event.block.timestamp);

  // increase total in play for user
  changeUserInPlay(event.params.owner, amount, true, event.block.timestamp);
}

export function handleSettled(event: Settled): void {
  const WINNER = 0x01;
  const LOSER = 0x02;
  const SCRATCHED = 0x03;
  const address = event.address.toHexString();
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // ease of referencing
  const id = event.params.index.toString().toLowerCase();

  // format id
  const betId = getBetId(id, address);

  const betEntity = Bet.load(betId);
  if (betEntity == null) {
    log.error(`Could not find reference entity with id ${betId}`, []);
    return;
  }
  if (betEntity.settled == true) {
    log.error(`Bet ${betId} is already settled`, []);
    return;
  }

  betEntity.settled = true;
  betEntity.didWin = event.params.result == WINNER;
  betEntity.settledAt = event.block.timestamp;
  betEntity.settledAtTx = event.transaction.hash.toHexString().toLowerCase();

  const decimals = getMarketDecimals(event.address);
  const payout = amountFromDecimalsToEther(event.params.payout, decimals);

  // decrease user in play
  changeUserInPlay(
    event.params.recipient,
    betEntity.amount,
    false,
    event.block.timestamp
  );

  // decrease in play by amount
  changeProtocolInPlay(betEntity.amount, false, event.block.timestamp);

  // if the user win
  if (event.params.result == WINNER) {
    changeProtocolTvl(payout, false, event.block.timestamp);

    // increase user pnl by exposure
    changeUserPnl(
      event.params.recipient,
      payout.minus(betEntity.amount),
      true,
      event.block.timestamp
    );
  } else if (event.params.result == LOSER) {
    // if the user lost, tvl is *increased* by original amount
    changeProtocolTvl(betEntity.amount, true, event.block.timestamp);

    // decrease user pnl
    changeUserPnl(
      event.params.recipient,
      betEntity.amount,
      false,
      event.block.timestamp
    );
  } else if (event.params.result == SCRATCHED) {
    const lay = payout.minus(betEntity.amount);
    changeProtocolTvl(lay, false, event.block.timestamp);

    // increase user pnl by exposure
    changeUserPnl(event.params.recipient, lay, true, event.block.timestamp);
  }

  betEntity.save();
}

export function handleBorrowed(event: Borrowed): void {
  const address = event.address.toHexString();
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // format amount to 18 decimals
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(event.params.amount, decimals);

  const entity = new Borrow(event.transaction.hash.toHexString());

  entity.amount = amount;
  entity.betIndex = event.params.index;
  entity.vaultAddress = event.params.vault.toHexString();

  entity.createdAt = event.block.timestamp;

  entity.save();
}

export function handleRepaid(event: Repaid): void {
  const address = event.address.toHexString();
  if (isHorseLinkMarket(address) == false) {
    log.info(`${address} is not a horse link market`, []);
    return;
  }

  // format amount to 18 decimals
  const decimals = getMarketDecimals(event.address);
  const amount = amountFromDecimalsToEther(event.params.amount, decimals);

  const entity = new Repay(event.transaction.hash.toHexString());

  entity.amount = amount;
  entity.vaultAddress = event.params.vault.toHexString();

  entity.createdAt = event.block.timestamp;

  entity.save();
}
