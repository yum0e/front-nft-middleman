import React from 'react';
import {
  transactionServices,
  refreshAccount,
  useGetPendingTransactions,
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
import CheckBadge from 'components/CheckBadge';
import TxProcessingNotch from 'components/TxProcessingNotch';
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
  buyable: boolean;
  toDelete: boolean;
};

export default function OfferCard(props: Props) {
  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [, /*transactionSessionId*/ setTransactionSessionId] = React.useState<
    string | null
  >(null);
  const { sendTransactions } = transactionServices;
  // const transactionStatus = transactionServices.useTrackTransactionStatus({
  //   transactionId: transactionSessionId
  //   // onSuccess,
  //   // onFail,
  //   // onCancelled,
  //   // onCompleted
  // });
  //console.log(transactionStatus);
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
      .get(`https://api.elrond.com/nfts/${apiIdentifier}`)
      .then((response) => {
        setNftUrl(response?.data?.url);
      })
      .catch((e) => console.log(`Error: ${e}`));
  };

  // query offers with id
  // useEffect if address changes in order to avoid overloading the api by requests
  React.useEffect(() => {
    proxyQuery();
  }, [hasPendingTransactions]);

  //   // accepting offer

  const acceptOfferTransaction = async () => {
    const acceptOfferTx = {
      value: `${offersWithId?.amount}`,
      gasLimit: '5000000',
      data: `acceptOffer@${numberToHex(idOffer)}`, // id to hex with toString(16)
      receiver: contractAddress
    };

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
    const deleteOfferTx = {
      value: 0,
      gasLimit: '5000000',
      data: `deleteOffer@${numberToHex(idOffer)}`, // id to hex with toString(16)
      receiver: contractAddress
    };

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
      {String(offersWithId?.status?.name) === 'Submitted' ? (
        <div className='px-4 py-2 mx-auto md:mx-8 wrap grid grid-cols-1 sm:grid-cols-2 gap-1 justify-items-stretch bg-gray-900 rounded-xl'>
          <div className='my-auto mx-auto flex flex-col gap-1 place-content-center'>
            <div className='flex justify-start'>
              <div className='px-2 py-1 text-xs bg-green-500 rounded-xl '>
                {String(offersWithId?.status?.name)}
              </div>
            </div>

            <div>
              Expected Buyer:{' '}
              <span className='text-grad-2'>
                {String(offersWithId?.spender).slice(0, 5)}...
                {String(offersWithId?.spender).slice(-5)}
              </span>
            </div>
            <div>
              NFT holder:{' '}
              <span className='text-grad-2'>
                {String(offersWithId?.nft_holder).slice(0, 5)}...
                {String(offersWithId?.nft_holder).slice(-5)}
              </span>
            </div>
            <div>
              Collection :{' '}
              <span className='text-grad'>
                {String(offersWithId?.token_id)}
              </span>
              {verified.includes(String(offersWithId?.token_id)) && (
                <span className='ml-2'>
                  <CheckBadge />
                </span>
              )}
            </div>
            {props.buyable && (
              <div className='py-2 flex justify-start'>
                {!hasPendingTransactions ? (
                  <button
                    onClick={acceptOfferTransaction}
                    className='py-2 px-2 text-sm bg-white text-black font-semibold rounded-lg cursor-pointer'
                  >
                    Buy for {+String(offersWithId?.amount) / 10 ** 18} EGLD
                  </button>
                ) : (
                  <>
                    <div>
                      Dealing with the submitted transaction
                      <span className='ml-2'>
                        <TxProcessingNotch />
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
            {props.toDelete && (
              <div className='py-2 flex justify-start'>
                {!hasPendingTransactions ? (
                  <button
                    onClick={deleteOfferTransaction}
                    className='py-2 px-2 text-sm bg-white text-black font-semibold rounded-lg cursor-pointer'
                  >
                    Delete offer
                  </button>
                ) : (
                  <>
                    <div>
                      Dealing with the submitted transaction
                      <span className='ml-2 animate-spin'>
                        <TxProcessingNotch />
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className='w-44 h-full py-4 justify-self-center'>
            {nftUrl.slice(-3) === 'mp4' ? (
              <video autoPlay controls src={nftUrl}></video>
            ) : (
              <img src={nftUrl} alt='default_img' />
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
