import { BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { VaultTransaction } from "../../generated/schema";
import { Deposit__Params, Withdraw__Params } from "../../generated/Vault/Vault";

export function createDeposit(params: Deposit__Params, value: BigInt, tx: ethereum.Transaction, timestamp: BigInt, eventAddress: string): void {
  // make sure that the type for deposits will always be "deposit"
  const type = "deposit";

  // entity id will be its transaction hash
  const id = tx.hash.toHexString().toLowerCase()

  let entity = VaultTransaction.load(id);
  if (entity !== null) {
    log.error(`VaultTransaction with id ${id} already exists`, []);
    return;
  }

  entity = new VaultTransaction(id);

  // populate entity fields
  entity.type = type;
  entity.amount = value;
  entity.userAddress = params.sender.toHexString().toLowerCase();

  // the vaultAddress will be the zero address if a tx.to is not provided
  entity.vaultAddress = eventAddress.toLowerCase();

  entity.timestamp = timestamp;
  entity.save();
}

export function createWithdrawal(params: Withdraw__Params, value: BigInt, tx: ethereum.Transaction, timestamp: BigInt, eventAddress: string): void {
  // make sure that the type for withdrawals will always be "withdraw"
  const type = "withdraw";

  // entity id will be its transaction hash
  const id = tx.hash.toHexString().toLowerCase()

  let entity = VaultTransaction.load(id);
  if (entity !== null) {
    log.error(`VaultTransaction with id ${id} already exists`, []);
    return;
  }

  entity = new VaultTransaction(id);

  // populate entity fields
  entity.type = type;
  entity.amount = value;
  entity.userAddress = params.sender.toHexString().toLowerCase();

  log.error(`event amount: ${params.assets.toString()}, converted to ${value.toString}`, []);

  // the vaultAddress will be the zero address if a tx.to is not provided
  entity.vaultAddress = eventAddress.toLowerCase();

  entity.timestamp = timestamp;
  entity.save();
}
