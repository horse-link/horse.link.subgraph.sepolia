import { BigInt } from "@graphprotocol/graph-ts";

export function amountFromDecimalsToEther(amount: BigInt, decimals: number): BigInt {
  const differencePrecision = BigInt.fromString("10").pow(18 - u8(decimals));
  return amount.times(differencePrecision);
}
