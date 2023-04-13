import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Vault as VaultContract,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent
} from "../generated/Vault/Vault";
import { Deposit, Withdraw, Registry } from "../generated/schema";

function _isHorseLinkVault(address: string): bool {
  const registry = Registry.load("registry");
  if (!registry) {
    throw new Error("No registry");
  }

  return registry.vaults.includes(address);
}

export function handleDeposit(event: DepositEvent): void {
  if (!_isHorseLinkVault(event.address.toHexString())) {
    return;
  }

  const entity = new Deposit(event.transaction.hash.toHexString());

  entity.sender = event.params.sender.toHexString();
  entity.owner = event.params.owner.toHexString();
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;

  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  if (!_isHorseLinkVault(event.address.toHexString())) {
    return;
  }

  const entity = new Withdraw(event.transaction.hash.toHexString());

  entity.sender = event.params.sender.toHexString();
  entity.receiver = event.params.receiver.toHexString();
  entity.owner = event.params.owner.toHexString();
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;

  entity.timestamp = event.block.timestamp;

  entity.save();
}
