import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FuroAutomatedAmount, FuroAutomatedTime, FuroAutomated } from '../../generated/schema';
import { CreateFuroAutomated } from '../../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory';
import {
  Fund,
  Withdraw,
  TaskUpdate,
  TaskCancel,
  TaskExecute
} from '../../generated/templates/FuroAutomated/FuroAutomated';
import { createFuroAutomatedAmount, createFuroAutomatedTime } from '../functions/furoAutomated';
import { createTaskExecuted } from '../functions/taskExecuted';

export function handleCreateFuroAutomatedTime(event: CreateFuroAutomated): void {
  createFuroAutomatedTime(event);
}

export function handleCreateFuroAutomatedAmount(event: CreateFuroAutomated): void {
  createFuroAutomatedAmount(event);
}

export function handleFund(event: Fund): void {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.balance = furoAutomated.balance.plus(event.params.amount);
  furoAutomated.save();
}

export function handleWithdraw(event: Withdraw): void {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.balance = furoAutomated.balance.minus(event.params.amount);
  furoAutomated.save();
}

export function handleTaskUpdate(event: TaskUpdate): void {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  if (furoAutomated.type === 'TIME') {
    const data = ethereum.decode('(address, uint32, bool, bytes)', event.params.data);
    if (!data) throw 'Unable to decode data.';
    const dataTuple = data.toTuple();
    furoAutomated.withdrawTo = dataTuple[0].toAddress();
    furoAutomated.toBentoBox = dataTuple[2].toBoolean();
    furoAutomated.taskData = dataTuple[3].toBytes();
    furoAutomated.save();

    let furoAutomatedTime = FuroAutomatedTime.load(event.address.toHex());
    if (furoAutomatedTime !== null) {
      furoAutomatedTime.withdrawPeriod = dataTuple[1].toBigInt();
      furoAutomatedTime.save();
    }
    return;
  }
  if (furoAutomated.type === 'AMOUNT') {
    const data = ethereum.decode('(address, uint256, bool, bytes)', event.params.data);
    if (!data) throw 'Unable to decode data.';
    const dataTuple = data.toTuple();
    furoAutomated.withdrawTo = dataTuple[0].toAddress();
    furoAutomated.toBentoBox = dataTuple[2].toBoolean();
    furoAutomated.taskData = dataTuple[3].toBytes();
    furoAutomated.save();

    let furoAutomatedAmount = FuroAutomatedAmount.load(event.address.toHex());
    if (furoAutomatedAmount !== null) {
      furoAutomatedAmount.minAmount = dataTuple[1].toBigInt();
      furoAutomatedAmount.save();
    }
    return;
  }
}

export function handleTaskCancel(event: TaskCancel): void {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  furoAutomated.active = false;
  furoAutomated.balance = BigInt.fromU32(0);
  furoAutomated.save();
}

export function handleTaskExecute(event: TaskExecute): void {
  let furoAutomated = FuroAutomated.load(event.address.toHex());
  if (furoAutomated === null) {
    return;
  }

  createTaskExecuted(event);
}
