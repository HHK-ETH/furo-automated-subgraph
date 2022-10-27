import { BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { CreateFuroAutomated } from '../../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory';
import { FuroAutomated, FuroAutomatedAmount, FuroAutomatedTime } from '../../generated/schema';
import { getOrCreateFactory } from './factory';

function createFuroAutomated(event: CreateFuroAutomated, data: ethereum.Tuple, type: string): FuroAutomated {
  const factory = getOrCreateFactory(event.address.toHex(), type);

  let furoAutomated = new FuroAutomated(event.params.clone.toHex());
  furoAutomated.factory = factory.id;
  furoAutomated.type = type;
  furoAutomated.furoId = data[0].toBigInt();
  furoAutomated.owner = event.transaction.from;
  furoAutomated.token = data[1].toAddress();
  furoAutomated.vesting = data[4].toBoolean();
  furoAutomated.withdrawTo = data[2].toAddress();
  furoAutomated.toBentoBox = data[5].toBoolean();
  furoAutomated.taskData = data[6].toBytes();
  furoAutomated.balance = BigInt.fromU32(0);
  furoAutomated.taskId = event.params.taskId;
  furoAutomated.active = true;
  furoAutomated.save();

  return furoAutomated;
}

export function createFuroAutomatedTime(event: CreateFuroAutomated): FuroAutomatedTime {
  const data = ethereum.decode('(uint256, address, address, uint32, bool, bool, bytes)', event.params.data);
  if (!data) throw 'Unable to decode data.';
  const decodedData = data.toTuple();
  log.debug('{}', [decodedData.toString()]);

  let furoAutomatedTime = new FuroAutomatedTime(event.params.clone.toHex());
  furoAutomatedTime.furoAutomated = createFuroAutomated(event, decodedData, 'TIME').id;
  furoAutomatedTime.withdrawPeriod = decodedData[3].toBigInt();
  furoAutomatedTime.lastWihdraw = BigInt.fromU32(0);
  furoAutomatedTime.save();

  return furoAutomatedTime;
}

export function createFuroAutomatedAmount(event: CreateFuroAutomated): FuroAutomatedAmount {
  const data = ethereum.decode('(uint256, address, address, uint256, bool, bool, bytes)', event.params.data);
  if (!data) throw 'Unable to decode data.';
  const decodedData = data.toTuple();

  let furoAutomatedAmount = new FuroAutomatedAmount(event.params.clone.toHex());
  furoAutomatedAmount.furoAutomated = createFuroAutomated(event, decodedData, 'AMOUNT').id;
  furoAutomatedAmount.minAmount = decodedData[3].toBigInt();
  furoAutomatedAmount.save();

  return furoAutomatedAmount;
}
