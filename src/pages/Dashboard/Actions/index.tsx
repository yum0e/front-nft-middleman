import * as React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions,
  refreshAccount
} from '@elrondnetwork/dapp-core';
import { Address } from '@elrondnetwork/erdjs';

import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import CheckBadge from 'components/CheckBadge';
import TxProcessingNotch from 'components/TxProcessingNotch';
import { contractAddress, verified } from 'config';
import { routeNames } from 'routes';
import { numberToHex, numberToHexForBigUint, stringToHex } from 'utils';

interface IFormInput {
  spender: string;
  identifier: string;
  amount: number;
}

interface Offer {
  spender: string;
  identifier: string;
  nonce: number;
  amount: number;
}

const Actions = () => {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { address } = account;

  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const { sendTransactions } = transactionServices;

  const [collections, setCollections] = React.useState<Array<any>>();
  const { register, handleSubmit } = useForm<IFormInput>();
  const [offer, setOffer] = React.useState<Offer>({
    spender: '',
    identifier: '',
    nonce: 0,
    amount: 1
  });
  const [nft_url, setNftUrl] = React.useState(
    'https://media.elrond.com/nfts/thumbnail/default.png'
  );
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [exists, setExists] = React.useState(false);
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    getNftUrl(data?.identifier, data?.spender, data?.amount);
  };

  const getCollections = () => {
    axios
      .get(
        `https://api.elrond.com/accounts/${address}/nfts?size=2000&type=NonFungibleESDT`
      )
      .then((response) => {
        const myCollections = response?.data;
        setCollections(myCollections);
      })
      .catch((error) => console.log(`Error: ${error}`));
  };
  const getNftUrl = (identifier: string, spender: string, amount: number) => {
    axios
      .get(`https://api.elrond.com/nfts/${identifier}`)
      .then((response) => {
        const nft_url_api = response?.data?.url;
        setNftUrl(nft_url_api);
        // save the offer parameters in the same time
        setOffer({
          spender: spender,
          identifier: response?.data?.collection,
          nonce: response?.data?.nonce,
          amount: amount
        });
        // we check if the spender address exists
        axios
          .get(`https://api.elrond.com/accounts/${spender}`)
          .then(() => {
            setIsSubmitted(true);
            setExists(true);
          })
          .catch((error) => {
            console.log(error);
            setIsSubmitted(true); // we indicate that the user submitted
            setExists(false);
          });
      })
      .catch((error) => console.log(`Error: ${error}`));
  };

  React.useEffect(() => {
    getCollections();
  }, [address, hasPendingTransactions]);

  const createOfferTransaction = async () => {
    const createOfferTx = {
      value: '0',
      gasLimit: '5000000',
      data: `ESDTNFTTransfer@${stringToHex(offer.identifier)}@${numberToHex(
        offer.nonce
      )}@01@${new Address(contractAddress).hex()}@${stringToHex(
        'createOffer'
      )}@${new Address(offer.spender).hex()}@${numberToHexForBigUint(
        offer.amount * 10 ** 18
      )}`,
      receiver: address
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: createOfferTx,
      transactionsDisplayInfo: {
        processingMessage: `Creating offer to ${offer.spender}`,
        errorMessage: 'An error has occured during the creation of the offer',
        successMessage: 'Offer created with success'
      },
      callbackRoute: routeNames.dashboard,
      redirectAfterSign: true
    });
    if (sessionId != null) {
      setTransactionSessionId(sessionId);
    }
  };

  return (
    <>
      <div className='z-30 mt-4 pb-4 mx-auto md:mx-16 lg:mx-32 xl:mx-42 2xl:mx-64 h-auto bg-gray-900 rounded-xl shadow-xl'>
        {!isSubmitted ? (
          <>
            <div className='pt-8 pb-4 flex justify-center font-semibold'>
              Choose the NFT you want to sell
            </div>
            <form
              className='px-8 pb-8 flex flex-col gap-3'
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* <label className='font-bold'>Buyer Address</label> */}
              <input
                {...register('spender')}
                placeholder='Buyer address'
                className='py-2 px-2 rounded-lg text-black font-semibold focus:ring-2 focus:ring-red-600'
                required
              />
              {/* <label className='font-bold'>NFT Selection</label> */}
              <select
                {...register('identifier')}
                className=' py-2 px-2 rounded-lg text-black font-semibold'
                required
              >
                <option key='0'>Select your NFT</option>
                {collections?.map((json, index) => {
                  return <option key={index}>{json.identifier}</option>;
                })}
              </select>
              {/* <label className='font-bold'>Offer price</label> */}
              <input
                {...register('amount')}
                placeholder='Offer price'
                className='py-2 px-2 rounded-lg text-black font-semibold'
                required
              />
              <div className='flex justify-center text-xs text-grad-2'>
                Charging fees 2%
              </div>
              {!hasPendingTransactions ? (
                <input
                  type='submit'
                  value='Submit'
                  className='mx-auto mt-6 custom-btn'
                />
              ) : (
                <div className='flex justify-center mt-4'>
                  Creating the offer{' '}
                  <span className=' ml-2 '>
                    <TxProcessingNotch />{' '}
                  </span>
                </div>
              )}
            </form>
          </>
        ) : (
          <div>
            {exists ? (
              <>
                <img
                  className='w-48 mx-auto py-4'
                  src={nft_url}
                  alt='nft_url'
                />
                <div className='py-2 flex flex-col justify-center text-center mx-2 md:mx-24'>
                  <div className='font-bold'>
                    Do you want to allow{' '}
                    <span className='text-grad'>
                      {JSON.stringify(offer.spender).slice(1, 6)}...
                      {JSON.stringify(offer.spender).slice(-6, -1)}
                    </span>{' '}
                    to purchase{' '}
                    <span className='text-grad-2'>
                      {JSON.stringify(offer.identifier).slice(1, -1)}-
                      {numberToHex(offer.nonce)}{' '}
                    </span>
                    {verified.includes(
                      JSON.stringify(offer.identifier).slice(1, -1)
                    ) && (
                      <span className='mr-1'>
                        <CheckBadge />
                      </span>
                    )}
                    for {JSON.stringify(offer.amount).slice(1, -1)} EGLD ? (You
                    will receive{' '}
                    {JSON.stringify(offer.amount * 0.98).slice(0, 5)} EGLD)
                  </div>
                  <div className='mt-2 flex justify-center text-xs'>
                    Charging fees 2%
                  </div>
                  <div className='mx-auto grid grid-cols-2 gap-5'>
                    <button
                      onClick={createOfferTransaction}
                      className='mx-auto mt-4 custom-btn'
                    >
                      Yes
                    </button>
                    <button
                      className='mx-auto mt-4 custom-btn-2'
                      onClick={() => window.location.reload()}
                    >
                      No
                    </button>
                  </div>
                </div>
                {/* {JSON.stringify(offer)} */}
              </>
            ) : (
              // the message to provide if the spender does not exist
              <>
                <div className='mb-8'>
                  <div className='font-bold text-center py-8 text-grad'>
                    Sorry, the buyer that you referenced does not exist
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className='flex custom-btn mx-auto'
                  >
                    Retry
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Actions;
