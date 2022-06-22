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
import axios from 'axios';
import CheckBadge from 'components/CheckBadge';
import { contractAddress, verified } from 'config';

import { numberToHex } from 'utils';

interface Offer {
  id: number;
  spender: { bech32: string; pubkey: string };
  nft_holder: { bech32: string };
  amount: number;
  token_id: string;
  nonce: number;
  status: { name: string };
}

type Props = {
  id: number;
  sold: boolean;
};

export default function OfferCardHistory(props: Props) {
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyProvider(network.apiAddress);

  const [offersWithId, setOffersWithId] = React.useState<Offer>();
  const [, setIdOffer] = React.useState<string>('');
  const [nftUrl, setNftUrl] = React.useState<string>(
    'https://media.elrond.com/nfts/thumbnail/default.png'
  );

  const queryOffersWithId = new Query({
    address: new Address(contractAddress),
    func: new ContractFunction('getOffersWithId'),
    args: [new U64Value(new BigNumber(props.id))]
  });

  const proxyQuery = async () => {
    await proxy
      .queryContract(queryOffersWithId)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const codec = new BinaryCodec();
        const buffer = Buffer.from(encoded, 'base64');
        const offerType = new StructType('Offer', [
          new FieldDefinition('id', '', new U64Type()),
          new FieldDefinition('spender', '', new AddressType()),
          new FieldDefinition('nft_holder', '', new AddressType()),
          new FieldDefinition('amount', '', new BigUIntType()),
          new FieldDefinition('token_id', '', new TokenIdentifierType()),
          new FieldDefinition('nonce', '', new U64Type()),
          new FieldDefinition(
            'status',
            '',
            new EnumType('Status', [
              new EnumVariantDefinition('Submitted', 0),
              new EnumVariantDefinition('Completed', 1),
              new EnumVariantDefinition('Deleted', 2)
            ])
          )
        ]);
        const decoded = codec.decodeTopLevel(buffer, offerType);
        const theOffer = decoded.valueOf();
        setOffersWithId(theOffer);
        getUrl(`${theOffer.token_id}-${numberToHex(theOffer.nonce.valueOf())}`);
        setIdOffer(`${theOffer?.id?.valueOf()}`);
      })
      .catch((err) => {
        console.error('Unable to call VM query for queryOffersWithId', err);
      });
  };

  const getUrl = async (apiIdentifier: string) => {
    await axios
      .get(`https://api.elrond.com/nfts/${apiIdentifier}`)
      .then((response) => {
        setNftUrl(response?.data?.media[0].thumbnailUrl);
      })
      .catch((e) => console.log(`Error: ${e}`));
  };

  // query offers with id
  // useEffect if address changes in order to avoid overloading the api by requests
  React.useEffect(() => {
    proxyQuery();
  }, []);

  console.log(nftUrl);

  return (
    <>
      {/* we only display the offer if the offer is Submitted */}
      {String(offersWithId?.status?.name) === 'Completed' ? (
        <div className='px-2 py-2 grid grid-cols-5 gap-2 bg-gray-900 text-center'>
          <div className='w-16 h-16'>
            <a
              href={`https://explorer.elrond.com/nfts/${
                offersWithId?.token_id
              }-${numberToHex(offersWithId?.nonce)}`}
            >
              {nftUrl.slice(-3) === 'mp4' ? (
                <video autoPlay className='rounded-sm' src={nftUrl}></video>
              ) : (
                <img className='rounded-sm' src={nftUrl} alt='default_img' />
              )}
            </a>
          </div>
          <a
            href={`https://explorer.elrond.com/accounts/${String(
              offersWithId?.nft_holder
            )}`}
            target='_blank'
            rel='noreferrer'
            className='my-auto text-grad-2'
          >
            {String(offersWithId?.nft_holder).slice(0, 4)}...
            {String(offersWithId?.nft_holder).slice(-4)}
          </a>
          <a
            href={`https://explorer.elrond.com/accounts/${String(
              offersWithId?.spender
            )}`}
            target='_blank'
            rel='noreferrer'
            className='my-auto text-grad-2'
          >
            {String(offersWithId?.spender).slice(0, 4)}...
            {String(offersWithId?.spender).slice(-4)}
          </a>

          <a
            href={`https://explorer.elrond.com/collections/${String(
              offersWithId?.token_id
            )}`}
            target='_blank'
            rel='noreferrer'
            className='my-auto text-grad'
          >
            {String(offersWithId?.token_id)}{' '}
            {verified.includes(String(offersWithId?.token_id)) && (
              <CheckBadge />
            )}
          </a>

          <div className='my-auto'>
            {+String(offersWithId?.amount) / 10 ** 18} EGLD
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
