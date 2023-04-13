import { Aggregator } from "../generated/schema";

function _getAggregator(): Aggregator {
  let entity = Aggregator.load("aggregator");
  if (!entity) {
    entity = new Aggregator("aggregator");
    entity.totalMarkets = 0;
    entity.totalVaults = 0;
    entity.totalBets = 0;
  }

  return entity;
}

export function incrementMarkets(): void {
  const entity = _getAggregator();

  const current = entity.totalMarkets;
  entity.totalMarkets = current + 1;

  entity.save();
}

export function decrementMarkets(): void {
  const entity = _getAggregator();

  const current = entity.totalMarkets;
  entity.totalMarkets = current - 1;

  entity.save();
}

export function incrementVaults(): void {
  const entity = _getAggregator();

  const current = entity.totalVaults;
  entity.totalVaults = current + 1;

  entity.save();
}

export function decrementVaults(): void {
  const entity = _getAggregator();

  const current = entity.totalVaults;
  entity.totalVaults = current - 1;

  entity.save();
}

export function incrementBets(): void {
  const entity = _getAggregator();

  const current = entity.totalBets;
  entity.totalBets = current + 1;

  entity.save();
}

export function decrementBets(): void {
  const entity = _getAggregator();

  const current = entity.totalBets;
  entity.totalBets = current - 1;

  entity.save();
}
