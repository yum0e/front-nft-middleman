import React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query,
  U64Value
} from '@elrondnetwork/erdjs';
import { BigNumber } from '@elrondnetwork/erdjs/node_modules/bignumber.js';
import { contractAddress } from 'config';

import OfferCardHistory from 'pages/Offers/OfferCardHistory';

export default function Trades() {
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyProvider(network.apiAddress);

  const [lastCompletedOffers, setLastCompletedOffers] =
    React.useState<Array<number>>();

  const [nbTrades, setNbTrades] = React.useState<number>(15);

  const increaseTradeNumber = () => {
    const newNbTrades = nbTrades + 25;
    setNbTrades(newNbTrades);
  };

  React.useEffect(() => {
    const queryLastCompletedOffers = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getLastCompletedOffers'),
      args: [new U64Value(new BigNumber(nbTrades))]
    });

    // query offers from
    proxy
      .queryContract(queryLastCompletedOffers)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const array = decoded?.match(/.{1,16}/g);
        const new_array = array?.map((x) => parseInt(x, 16));
        setLastCompletedOffers(new_array);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, [nbTrades]);

  console.log(lastCompletedOffers);

  return (
    <>
      <div className='z-30 w-full px-8 md:px-48 mb-4'>
        <div className='pt-2'>
          <div className='mb-6 text-2xl'>All Trades History</div>
          <div className='text-xs md:text-sm'>
            <div className='py-2 px-4 grid grid-cols-5 bg-gradient-to-r from-gray-800 to-gray-600 rounded-t-lg text-center'>
              <div>NFT</div>
              <div>From</div>
              <div>To</div>
              <div>Collection</div>
              <div>Price</div>
            </div>

            {lastCompletedOffers?.map((x, index) => (
              <div key={index}>
                <OfferCardHistory id={x} sold={false} />
              </div>
            ))}
            <div className='grid grid-cols-5 h-6 bg-gray-900 rounded-b-xl'></div>
          </div>
        </div>
      </div>
      <div className='text-center'>
        <button
          className='my-4 custom-btn-3 text-center'
          onClick={() => increaseTradeNumber()}
        >
          Load more
        </button>
      </div>
    </>
  );
}
