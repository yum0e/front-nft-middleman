import React from 'react';
import {
  transactionServices,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
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
import { contractAddress } from 'config';

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
  toDelete: boolean;
};

export default function OfferCardHistory(props: Props) {
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyProvider(network.apiAddress);

  const [offersWithId, setOffersWithId] = React.useState<Offer>();
  const [idOffer, setIdOffer] = React.useState<string>('');
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
      .get(`https://devnet-api.elrond.com/nfts/${apiIdentifier}`)
      .then((response) => {
        setNftUrl(response?.data?.url);
      })
      .catch((e) => console.log(`Error: ${e}`));
  };

  // query offers with id
  // useEffect if address changes in order to avoid overloading the api by requests
  React.useEffect(() => {
    proxyQuery();
  }, []);

  //   // accepting offer
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);
  const { sendTransactions } = transactionServices;
  const acceptOfferTransaction = async () => {
    // pair length for hex
    let acceptOfferTx;
    if (idOffer.length % 2 != 0) {
      acceptOfferTx = {
        value: `${offersWithId?.amount}`,
        gasLimit: '5000000',
        data: `acceptOffer@0${numberToHex(idOffer)}`, // id to hex with toString(16)
        receiver: contractAddress
      };
    } else {
      acceptOfferTx = {
        value: `${offersWithId?.amount}`,
        gasLimit: '5000000',
        data: `acceptOffer@${numberToHex(idOffer)}`, // id to hex with toString(16)
        receiver: contractAddress
      };
    }

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: acceptOfferTx,
      transactionsDisplayInfo: {
        processingMessage: 'Accepting offer',
        errorMessage: 'An error has occured during accepting',
        successMessage: 'Offer accepted and NFT received'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  const deleteOfferTransaction = async () => {
    // pair length for hex
    let deleteOfferTx;
    if (idOffer.length % 2 != 0) {
      deleteOfferTx = {
        value: 0,
        gasLimit: '5000000',
        data: `deleteOffer@0${numberToHex(idOffer)}`, // id to hex with toString(16)
        receiver: contractAddress
      };
    } else {
      deleteOfferTx = {
        value: 0,
        gasLimit: '5000000',
        data: `deleteOffer@${numberToHex(idOffer)}`, // id to hex with toString(16)
        receiver: contractAddress
      };
    }

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: deleteOfferTx,
      transactionsDisplayInfo: {
        processingMessage: 'Deleting offer',
        errorMessage: 'An error has occured during deleting',
        successMessage: 'Offer deleted with success'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  return (
    <>
      {/* we only display the offer if the offer is Submitted */}
      {String(offersWithId?.status?.name) === 'Completed' ? (
        <div className='px-4 py-2 mx-auto md:mx-8 wrap grid grid-cols-1 sm:grid-cols-2 gap-1 justify-items-stretch bg-gray-900 rounded-xl'>
          <div className='my-auto mx-auto flex flex-col gap-1 place-content-center'>
            <div className='flex justify-start'>
              <div className='px-2 py-1 text-xs bg-blue-500 rounded-xl '>
                {String(offersWithId?.status?.name)}
              </div>
            </div>

            <div>
              Buyer:{' '}
              <span className='text-grad-2'>
                {String(offersWithId?.spender).slice(0, 5)}...
                {String(offersWithId?.spender).slice(-5)}
              </span>
            </div>
            <div>
              Collection :{' '}
              <span className='text-grad'>
                {String(offersWithId?.token_id)}
              </span>
            </div>
            {props.sold ? (
              <div className='py-2 flex justify-start'>
                <button
                  onClick={acceptOfferTransaction}
                  className='py-2 px-2 text-sm bg-green-500 text-white font-semibold rounded-lg cursor-pointer'
                >
                  Sold for {+String(offersWithId?.amount) / 10 ** 18} EGLD
                </button>
              </div>
            ) : (
              <div className='py-2 flex justify-start'>
                <button
                  onClick={acceptOfferTransaction}
                  className='py-2 px-2 text-sm bg-red-500 text-white font-semibold rounded-lg cursor-pointer'
                >
                  Bought for {+String(offersWithId?.amount) / 10 ** 18} EGLD
                </button>
              </div>
            )}
            {props.toDelete && (
              <div className='py-2 flex justify-start'>
                <button
                  onClick={deleteOfferTransaction}
                  className='py-2 px-2 text-sm bg-white text-black font-semibold rounded-lg cursor-pointer'
                >
                  Delete offer
                </button>
              </div>
            )}
          </div>
          <div className='w-44 h-full py-4 justify-self-center'>
            <img src={nftUrl} alt='default_img' />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
