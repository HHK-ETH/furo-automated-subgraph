import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { CreateFuroAutomated } from '../../generated/FuroAutomatedTimeFactory/FuroAutomatedTimeFactory';
import { FuroAutomated, FuroAutomatedAmount, FuroAutomatedTime } from '../../generated/schema';
import { AutomationType } from '../constants';
import { FuroAutomated as FuroTemplate } from './../../generated/templates';
import { getOrCreateFactory } from './factory';

function createFuroAutomated(event: CreateFuroAutomated, data: ethereum.Tuple, type: string): FuroAutomated {
  const factory = getOrCreateFactory(event.address.toHex(), type);

  FuroTemplate.create(event.params.clone);
  let furoAutomated = new FuroAutomated(event.params.clone.toHex());
  furoAutomated.factory = factory.id;
  furoAutomated.type = type;
  furoAutomated.furoId = data[0].toBigInt();
  furoAutomated.owner = event.transaction.from;
  furoAutomated.token = Address.fromString(data[1].toBigInt().toHex());
  furoAutomated.vesting = data[4].toBigInt().isZero();
  furoAutomated.withdrawTo = Address.fromString(data[2].toBigInt().toHex());
  furoAutomated.toBentoBox = data[5].toBigInt().isZero();
  furoAutomated.taskData = Bytes.fromHexString(data[6].toBigInt().toHex());
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

  let furoAutomatedTime = new FuroAutomatedTime(event.params.clone.toHex());
  furoAutomatedTime.furoAutomated = createFuroAutomated(event, decodedData, AutomationType.TIME).id;
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
  furoAutomatedAmount.furoAutomated = createFuroAutomated(event, decodedData, AutomationType.AMOUNT).id;
  furoAutomatedAmount.minAmount = decodedData[3].toBigInt();
  furoAutomatedAmount.save();

  return furoAutomatedAmount;
}
