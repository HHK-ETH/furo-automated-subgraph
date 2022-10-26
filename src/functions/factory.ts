import { Factory } from '../../generated/schema';
import {
  AMOUNT_IMPLEMENTATION,
  BENTOBOX,
  FURO_STREAMING,
  FURO_VESTING,
  GELATO_OPS,
  TIME_IMPLEMENTATION
} from '../constants';

export function getOrCreateFactory(id: string, type: string): Factory {
  let factory = Factory.load(id);

  if (factory === null) {
    factory = new Factory(id);
    factory.bentobox = BENTOBOX;
    factory.furoStreaming = FURO_STREAMING;
    factory.furoVesting = FURO_VESTING;
    factory.ops = GELATO_OPS;
    factory.type = type;
    factory.implementation = type === 'TIME' ? TIME_IMPLEMENTATION : AMOUNT_IMPLEMENTATION;
    factory.save();
  }

  return factory;
}
