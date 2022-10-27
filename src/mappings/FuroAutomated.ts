import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FuroAutomatedAmount, FuroAutomatedTime, FuroAutomated, TaskExecuted } from './../../generated/schema';
import { CreateFuroAutomated as CreateFuroAutomatedTime } from './../../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory';
import { CreateFuroAutomated as CreateFuroAutomatedAmount } from './../../generated/FuroAutomatedAmountFactory/FuroAutomatedAmountFactory';
import {
  Fund,
  Withdraw,
  TaskUpdate,
  TaskCancel,
  TaskExecute
} from './../../generated/templates/FuroAutomated/FuroAutomated';
import { createFuroAutomatedAmount, createFuroAutomatedTime } from '../functions/furoAutomated';
import { createTaskExecuted } from '../functions/taskExecuted';

export function handleCreateFuroAutomatedTime(event: CreateFuroAutomatedTime) {
  createFuroAutomatedTime(event);
}

export function handleCreateFuroAutomatedAmount(event: CreateFuroAutomatedAmount) {
  createFuroAutomatedAmount(event);
}

export function handleFund(event: Fund) {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.balance = furoAutomated.balance.plus(event.params.amount);
  furoAutomated.save();
}

export function handleWithdraw(event: Withdraw) {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.balance = furoAutomated.balance.minus(event.params.amount);
  furoAutomated.save();
}

export function handleTaskUpdate(event: TaskUpdate) {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  if (furoAutomated.type === 'TIME') {
    const data = ethereum.decode('(address, uint32, bool, bytes)', event.params.data)?.toTuple();
    if (!data) throw 'Unable to decode data.';
    furoAutomated.withdrawTo = data[0].toAddress();
    furoAutomated.toBentoBox = data[2].toBoolean();
    furoAutomated.taskData = data[3].toBytes();
    furoAutomated.save();

    let furoAutomatedTime = FuroAutomatedTime.load(event.address.toHex());
    if (furoAutomatedTime !== null) {
      furoAutomatedTime.withdrawPeriod = data[1].toBigInt();
      furoAutomatedTime.save();
    }
    return;
  }
  if (furoAutomated.type === 'AMOUNT') {
    const data = ethereum.decode('(address, uint256, bool, bytes)', event.params.data)?.toTuple();
    if (!data) throw 'Unable to decode data.';
    furoAutomated.withdrawTo = data[0].toAddress();
    furoAutomated.toBentoBox = data[2].toBoolean();
    furoAutomated.taskData = data[3].toBytes();
    furoAutomated.save();

    let furoAutomatedAmount = FuroAutomatedAmount.load(event.address.toHex());
    if (furoAutomatedAmount !== null) {
      furoAutomatedAmount.minAmount = data[1].toBigInt();
      furoAutomatedAmount.save();
    }
    return;
  }
}

export function handleTaskCancel(event: TaskCancel) {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.active = false;
  furoAutomated.balance = BigInt.fromU32(0);
  furoAutomated.save();
}

export function handleTaskExecute(event: TaskExecute) {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  createTaskExecuted(event);
}
