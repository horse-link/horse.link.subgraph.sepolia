import { log } from "@graphprotocol/graph-ts";
import {
  Approval,
  Deposit,
  OwnershipTransferred,
  Transfer,
  Withdraw,
} from "../generated/Vault/Vault";
import { getVaultDecimals, isHorseLinkVault } from "./addresses";
import { amountFromDecimalsToEther } from "./utils/formatting";
import { changeProtocolTvl } from "./utils/protocol";
import { changeUserTotalDeposited } from "./utils/user";
import { createDeposit, createWithdrawal } from "./utils/vault-transaction";

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  const address = event.address.toHexString();
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(address) == false) {
    log.info(`${address} is not a horse link vault`, []);
    return;
  }

  // get value to 18 decimal precision
  const decimals = getVaultDecimals(event.address);
  const value = amountFromDecimalsToEther(event.params.assets, decimals);

  // deposits increase the tvl in the protocol
  changeProtocolTvl(value, true, event.block.timestamp);
  createDeposit(event.params, value, event.transaction, event.block.timestamp, address);

  // increase total deposited for user
  changeUserTotalDeposited(event.params.sender, value, true, event.block.timestamp);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {}

export function handleWithdraw(event: Withdraw): void {
  const address = event.address.toHexString();
  // check if the event comes from a horse link vault, if not do nothing
  if (isHorseLinkVault(address) == false) {
    log.info(`${address} is not a horse link vault`, []);
    return;
  }

  // get value to 18 decimal precision
  const decimals = getVaultDecimals(event.address);
  const value = amountFromDecimalsToEther(event.params.assets, decimals);

  // withdraws decrease the tvl in the protocol
  changeProtocolTvl(value, false, event.block.timestamp);
  createWithdrawal(event.params, value, event.transaction, event.block.timestamp, address);

  // decrease total deposited for user
  changeUserTotalDeposited(event.params.sender, value, false, event.block.timestamp);
}
