import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { CreateFuroAutomated as CreateFuroAutomatedTime } from '../../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory';
import { CreateFuroAutomated as CreateFuroAutomatedAmount } from '../../generated/FuroAutomatedAmountFactory/FuroAutomatedAmountFactory';
import { FuroAutomatedCreationParams } from '../constants';
import { FuroAutomated, FuroAutomatedAmount, FuroAutomatedTime } from '../../generated/schema';
import { getOrCreateFactory } from './factory';

function createFuroAutomated(
  event: CreateFuroAutomatedTime | CreateFuroAutomatedAmount,
  data: FuroAutomatedCreationParams,
  type: string
): FuroAutomated {
  const factory = getOrCreateFactory(event.address.toHex(), type);

  let furoAutomated = new FuroAutomated(event.params.clone.toHex());
  furoAutomated.factory = factory.id;
  furoAutomated.type = type;
  furoAutomated.furoId = data.furoId;
  furoAutomated.owner = event.transaction.from;
  furoAutomated.token = data.token;
  furoAutomated.vesting = data.vesting;
  furoAutomated.withdrawTo = data.withdrawTo;
  furoAutomated.toBentoBox = data.toBentoBox;
  furoAutomated.taskData = data.taskData;
  furoAutomated.balance = BigInt.fromU32(0);
  furoAutomated.taskId = event.params.taskId;
  furoAutomated.active = true;
  furoAutomated.save();

  return furoAutomated;
}

function parseAmountOrTimeCreationData(
  _data: Bytes,
  type: string
): { furoAutomatedParams: FuroAutomatedCreationParams; extraParam: any } {
  let data;
  if (type === 'TIME') {
    data = ethereum.decode('(uint256, address, address, uint32, bool, bool, bytes)', _data)?.toTuple();
  } else {
    data = ethereum.decode('(uint256, address, address, uint256, bool, bool, bytes)', _data)?.toTuple();
  }
  if (!data) throw 'Unable to decode data.';
  const furoAutomatedParams: FuroAutomatedCreationParams = {
    furoId: data[0].toBigInt(),
    token: data[1].toAddress(),
    withdrawTo: data[2].toAddress(),
    vesting: data[4].toBoolean(),
    toBentoBox: data[5].toBoolean(),
    taskData: data[6].toBytes()
  };

  return { furoAutomatedParams, extraParam: data[3] };
}

export function createFuroAutomatedTime(event: CreateFuroAutomatedTime): FuroAutomatedTime {
  const { furoAutomatedParams, extraParam } = parseAmountOrTimeCreationData(event.params.data, 'TIME');

  let furoAutomatedTime = new FuroAutomatedTime(event.params.clone.toHex());
  furoAutomatedTime.furoAutomated = createFuroAutomated(event, furoAutomatedParams, 'TIME').id;
  furoAutomatedTime.withdrawPeriod = extraParam.toBigInt();
  furoAutomatedTime.lastWihdraw = BigInt.fromU32(0);
  furoAutomatedTime.save();

  return furoAutomatedTime;
}

export function createFuroAutomatedAmount(event: CreateFuroAutomatedAmount): FuroAutomatedAmount {
  const { furoAutomatedParams, extraParam } = parseAmountOrTimeCreationData(event.params.data, 'AMOUNT');

  let furoAutomatedAmount = new FuroAutomatedAmount(event.params.clone.toHex());
  furoAutomatedAmount.furoAutomated = createFuroAutomated(event, furoAutomatedParams, 'AMOUNT').id;
  furoAutomatedAmount.minAmount = extraParam.toBigInt();
  furoAutomatedAmount.save();

  return furoAutomatedAmount;
}
