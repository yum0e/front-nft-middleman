import React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  BinaryCodec,
  ContractFunction,
  ProxyProvider,
  Query,
  U64Value,
  StructType,
  U64Type,
  AddressType,
  BigUIntType,
  EnumVariantDefinition,
  TokenIdentifierType,
  EnumType,
  FieldDefinition
} from '@elrondnetwork/erdjs';
import { BigNumber } from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import { contractAddress } from 'config';
import { Link } from 'react-router-dom';
import { routeNames } from 'routes';
import OffersFrom from './OffersFrom';

export default function Offers() {
  // const { network } = useGetNetworkConfig();
  // const proxy = new ProxyProvider(network.apiAddress);
  // const queryOffersWithId = new Query({
  //   address: new Address(contractAddress),
  //   func: new ContractFunction('getOffersWithId'),
  //   args: [new U64Value(new BigNumber(props.id))]
  // });

  // const proxyQuery = async () => {
  //   await proxy
  //     .queryContract(queryOffersWithId)
  //     .then(({ returnData }) => {
  //       const [encoded] = returnData;
  //       const codec = new BinaryCodec();
  //       const buffer = Buffer.from(encoded, 'base64');
  //       const offerType = new StructType('Offer', [
  //         new FieldDefinition('id', '', new U64Type()),
  //         new FieldDefinition('spender', '', new AddressType()),
  //         new FieldDefinition('nft_holder', '', new AddressType()),
  //         new FieldDefinition('amount', '', new BigUIntType()),
  //         new FieldDefinition('token_id', '', new TokenIdentifierType()),
  //         new FieldDefinition('nonce', '', new U64Type()),
  //         new FieldDefinition(
  //           'status',
  //           '',
  //           new EnumType('Status', [
  //             new EnumVariantDefinition('Submitted', 0),
  //             new EnumVariantDefinition('Completed', 1),
  //             new EnumVariantDefinition('Deleted', 2)
  //           ])
  //         )
  //       ]);
  //       const decoded = codec.decodeTopLevel(buffer, offerType);
  //       const theOffer = decoded.valueOf();
  //       setOffersWithId(theOffer);
  //       getUrl(`${theOffer.token_id}-${numberToHex(theOffer.nonce.valueOf())}`);
  //       setIdOffer(`${theOffer?.id?.valueOf()}`);
  //     })
  //     .catch((err) => {
  //       console.error('Unable to call VM query for queryOffersWithId', err);
  //     });
  // };
  return (
    <div className='px-8 md:px-48 min-h-screen'>
      <div className='font-bold text-3xl '>My Offers</div>
      <button className='my-2 py-1 px-2 rounded-xl text-sm bg-blue-500'>
        <Link to={routeNames.dashboard}>Go back</Link>
      </button>
      <OffersFrom />
    </div>
  );
}
