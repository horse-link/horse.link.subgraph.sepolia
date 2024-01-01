import { Address, BigInt } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";

function _initialiseUser(userAddress: Address): User {
  const address = userAddress.toHexString().toLowerCase();
  const userEntity = new User(address);

  userEntity.totalDeposited = BigInt.zero();
  userEntity.inPlay = BigInt.zero();
  userEntity.pnl = BigInt.zero();

  return userEntity;
};

function _getUser(address: Address): User {
  let userEntity = User.load(address.toHexString().toLowerCase());
  if (userEntity == null) {
    userEntity = _initialiseUser(address);
  }
  return userEntity;
};

export function changeUserPnl(address: Address, pnlDelta: BigInt, isIncrease: boolean, timestamp: BigInt): void {
  const userEntity = _getUser(address);

  const currentPnl = userEntity.pnl;

  if (isIncrease == true) {
    userEntity.pnl = currentPnl.plus(pnlDelta);
  } else {
    userEntity.pnl = currentPnl.minus(pnlDelta);
  }

  userEntity.lastUpdate = timestamp;
  userEntity.save();
};

export function changeUserTotalDeposited(address: Address, depositedDelta: BigInt, isIncrease: boolean, timestamp: BigInt): void {
  const userEntity = _getUser(address);

  const currentDeposited = userEntity.totalDeposited;

  if (isIncrease == true) {
    userEntity.totalDeposited = currentDeposited.plus(depositedDelta);
  } else {
    userEntity.totalDeposited = currentDeposited.minus(depositedDelta);
  }

  userEntity.lastUpdate = timestamp;
  userEntity.save();
};

export function changeUserInPlay(address: Address, inPlayDelta: BigInt, isIncrease: boolean, timestamp: BigInt): void {
  const userEntity = _getUser(address);

  const currentInPlay = userEntity.inPlay;

  if (isIncrease == true) {
    userEntity.inPlay = currentInPlay.plus(inPlayDelta);
  } else {
    userEntity.inPlay = currentInPlay.minus(inPlayDelta);
  }

  userEntity.lastUpdate = timestamp;
  userEntity.save();
};
