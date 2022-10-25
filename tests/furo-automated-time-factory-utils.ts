import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { CreateFuroAutomated } from "../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory"

export function createCreateFuroAutomatedEvent(
  clone: Address,
  amount: BigInt,
  data: Bytes
): CreateFuroAutomated {
  let createFuroAutomatedEvent = changetype<CreateFuroAutomated>(newMockEvent())

  createFuroAutomatedEvent.parameters = new Array()

  createFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("clone", ethereum.Value.fromAddress(clone))
  )
  createFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  createFuroAutomatedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return createFuroAutomatedEvent
}
