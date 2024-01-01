import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Protocol } from "../../generated/schema";

function _getPerformanceDifference(a: BigDecimal, b: BigDecimal): BigDecimal {
  const difference = a.times(BigDecimal.fromString("100")).div(b);
  return difference.minus(BigDecimal.fromString("100"));
};

function _initialiseProtocol(tvlDelta: BigInt | null = null): Protocol {
  const protocolEntity = new Protocol("protocol");

  protocolEntity.inPlay = BigInt.zero();
  protocolEntity.initialTvl = BigInt.zero();
  protocolEntity.currentTvl = BigInt.zero();

  if (tvlDelta !== null) protocolEntity.initialTvl = tvlDelta;

  return protocolEntity;
};

function _getProtocol(tvlDelta: BigInt | null = null): Protocol {
  let registryEntity = Protocol.load("protocol");
  if (registryEntity == null) {
    registryEntity = _initialiseProtocol(tvlDelta);
  }
  return registryEntity;
};

export function changeProtocolInPlay(inPlayDelta: BigInt, isIncrease: boolean, timestamp: BigInt): void {
  const protocolEntity = _getProtocol(null);

  const currentInPlay = protocolEntity.inPlay;

  if (isIncrease == true) {
    protocolEntity.inPlay = currentInPlay.plus(inPlayDelta);
  } else {
    protocolEntity.inPlay = currentInPlay.minus(inPlayDelta);
  }

  protocolEntity.lastUpdate = timestamp;
  protocolEntity.save();
};

export function changeProtocolTvl(tvlDelta: BigInt, isIncrease: boolean, timestamp: BigInt): void {
  const protocolEntity = _getProtocol(tvlDelta);

  const currentTvl = protocolEntity.currentTvl;

  if (isIncrease == true) {
    protocolEntity.currentTvl = currentTvl.plus(tvlDelta);
  } else {
    protocolEntity.currentTvl = currentTvl.minus(tvlDelta);
  }

  protocolEntity.performance = _getPerformanceDifference(new BigDecimal(protocolEntity.currentTvl), new BigDecimal(protocolEntity.initialTvl));

  protocolEntity.lastUpdate = timestamp;
  protocolEntity.save();
};
