import { BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
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
import { AutomationType } from '../constants';

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

  if (furoAutomated.type == AutomationType.TIME) {
    const data = ethereum.decode('(address, uint32, bool, bytes)', event.params.data)!.toTuple();
    furoAutomated.withdrawTo = data[0].toAddress();
    furoAutomated.toBentoBox = data[2].toBigInt().isZero();
    furoAutomated.taskData = Bytes.fromHexString(data[3].toBigInt().toHex());
    furoAutomated.save();

    let furoAutomatedTime = FuroAutomatedTime.load(event.address.toHex());
    if (furoAutomatedTime !== null) {
      furoAutomatedTime.withdrawPeriod = data[1].toBigInt();
      furoAutomatedTime.save();
    }
    return;
  }
  if (furoAutomated.type == AutomationType.AMOUNT) {
    const data = ethereum.decode('(address, uint256, bool, bytes)', event.params.data)!.toTuple();
    furoAutomated.withdrawTo = data[0].toAddress();
    furoAutomated.toBentoBox = data[2].toBigInt().isZero();
    furoAutomated.taskData = Bytes.fromHexString(data[3].toBigInt().toHex());
    furoAutomated.save();

    let furoAutomatedAmount = FuroAutomatedAmount.load(event.address.toHex());
    if (furoAutomatedAmount !== null) {
      furoAutomatedAmount.minAmount = data[1].toBigInt();
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
  furoAutomated.balance = furoAutomated.balance.minus(event.params.fee);
  furoAutomated.save();

  if (furoAutomated.type == AutomationType.TIME) {
    let furoAutomatedTime = FuroAutomatedTime.load(event.address.toHex());
    if (furoAutomatedTime === null) {
      return;
    }
    furoAutomatedTime.lastWihdraw = event.block.timestamp;
    furoAutomatedTime.save();
  }

  createTaskExecuted(event);
}
