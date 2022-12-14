import { TaskExecuted } from '../../generated/schema';
import { TaskExecute } from '../../generated/templates/FuroAutomated/FuroAutomated';

export function createTaskExecuted(event: TaskExecute): TaskExecuted {
  let taskExecuted = new TaskExecuted(event.transaction.hash.toHex() + '-' + event.logIndex.toString());
  taskExecuted.fee = event.params.fee;
  taskExecuted.timestamp = event.block.timestamp;
  taskExecuted.furoAutomated = event.address.toHex();
  taskExecuted.save();

  return taskExecuted;
}
