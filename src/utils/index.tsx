import { Address } from '@elrondnetwork/erdjs/out';

export const stringToHex = (string: any) => {
  return string
    .split('')
    .map((c: any) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

export const numberToHex = (number: any) => {
  return Number(number)
    .toString(16)
    .padStart(
      Number(number).toString(16).padStart(2, '0').length +
        (Number(number).toString(16).padStart(2, '0').length % 2),
      '0'
    );
};

export const numberToHexForBigUint = (number: any) => {
  let hex = number.toString(16);
  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }
  return hex;
};

export const bechToHex = (bech: any) => {
  let hex = new Address(bech).hex();
  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }
  return hex;
};
