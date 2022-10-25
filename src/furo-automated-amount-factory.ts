import { FuroAutomatedAmountFactoryCreateFuroAutomated as FuroAutomatedAmountFactoryCreateFuroAutomatedEvent } from "../generated/FuroAutomatedAmountFactory/FuroAutomatedAmountFactory"
import { FuroAutomatedAmountFactoryCreateFuroAutomated } from "../generated/schema"

export function handleFuroAutomatedAmountFactoryCreateFuroAutomated(
  event: FuroAutomatedAmountFactoryCreateFuroAutomatedEvent
): void {
  let entity = new FuroAutomatedAmountFactoryCreateFuroAutomated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.clone = event.params.clone
  entity.amount = event.params.amount
  entity.data = event.params.data
  entity.save()
}
