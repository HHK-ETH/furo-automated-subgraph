import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { FuroAutomatedAmountFactoryCreateFuroAutomated } from "../generated/schema"
import { FuroAutomatedAmountFactoryCreateFuroAutomated as FuroAutomatedAmountFactoryCreateFuroAutomatedEvent } from "../generated/FuroAutomatedAmountFactory/FuroAutomatedAmountFactory"
import { handleFuroAutomatedAmountFactoryCreateFuroAutomated } from "../src/furo-automated-amount-factory"
import { createFuroAutomatedAmountFactoryCreateFuroAutomatedEvent } from "./furo-automated-amount-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let clone = Address.fromString("0x0000000000000000000000000000000000000001")
    let amount = BigInt.fromI32(234)
    let data = Bytes.fromI32(1234567890)
    let newFuroAutomatedAmountFactoryCreateFuroAutomatedEvent = createFuroAutomatedAmountFactoryCreateFuroAutomatedEvent(
      clone,
      amount,
      data
    )
    handleFuroAutomatedAmountFactoryCreateFuroAutomated(
      newFuroAutomatedAmountFactoryCreateFuroAutomatedEvent
    )
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FuroAutomatedAmountFactoryCreateFuroAutomated created and stored", () => {
    assert.entityCount("FuroAutomatedAmountFactoryCreateFuroAutomated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FuroAutomatedAmountFactoryCreateFuroAutomated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "clone",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FuroAutomatedAmountFactoryCreateFuroAutomated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "FuroAutomatedAmountFactoryCreateFuroAutomated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "data",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
