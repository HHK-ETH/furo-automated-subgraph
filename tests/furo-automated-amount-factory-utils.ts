import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { FuroAutomatedAmountFactoryCreateFuroAutomated } from "../generated/FuroAutomatedAmountFactory/FuroAutomatedAmountFactory"

export function createFuroAutomatedAmountFactoryCreateFuroAutomatedEvent(
  clone: Address,
  amount: BigInt,
  data: Bytes
): FuroAutomatedAmountFactoryCreateFuroAutomated {
  let furoAutomatedAmountFactoryCreateFuroAutomatedEvent = changetype<
    FuroAutomatedAmountFactoryCreateFuroAutomated
  >(newMockEvent())

  furoAutomatedAmountFactoryCreateFuroAutomatedEvent.parameters = new Array()

  furoAutomatedAmountFactoryCreateFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("clone", ethereum.Value.fromAddress(clone))
  )
  furoAutomatedAmountFactoryCreateFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  furoAutomatedAmountFactoryCreateFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return furoAutomatedAmountFactoryCreateFuroAutomatedEvent
}
