import { Address } from '@graphprotocol/graph-ts';

export const TIME_FACTORY = Address.fromString('0xfDb37D0B81Dd83c2a842E498913Ae968E3629360');
export const TIME_IMPLEMENTATION = Address.fromString('0xf385923a02f30669c62914DA5B547E5eE509385A');

export const AMOUNT_FACTORY = Address.fromString('0xf51c779f635b5412e2a129a7fdd76409aceb3b18');
export const AMOUNT_IMPLEMENTATION = Address.fromString('0x0a2bA55A98e1C7d3DA853D1f00DD1Be27c27A074');

export const BENTOBOX = Address.fromString('0xF5BCE5077908a1b7370B9ae04AdC565EBd643966');
export const FURO_STREAMING = Address.fromString('0x4ab2FC6e258a0cA7175D05fF10C5cF798A672cAE');
export const FURO_VESTING = Address.fromString('0x0689640d190b10765f09310fCfE9C670eDe4E25B');
export const GELATO_OPS = Address.fromString('0xc1c6805b857bef1f412519c4a842522431afed39');

export namespace AutomationType {
  export const TIME = 'TIME';
  export const AMOUNT = 'AMOUNT';
}
