import React from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';
import OfferCardHistory from '../OfferCardHistory';

export default function OffersHistory() {
  const account = useGetAccountInfo();

  const { network } = useGetNetworkConfig();
  const { address } = account;
  const proxy = new ProxyProvider(network.apiAddress);

  const address_target = address;

  const [offersFromId, setOffersFromId] = React.useState<Array<number>>();
  const [offersToId, setOffersToId] = React.useState<Array<number>>();

  React.useEffect(() => {
    const queryOffersFrom = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getOffersFrom'),
      args: [new AddressValue(new Address(address_target))]
    });

    const queryOffersTo = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getOffersTo'),
      args: [new AddressValue(new Address(address_target))]
    });

    // query offers from
    proxy
      .queryContract(queryOffersFrom)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const array = decoded?.match(/.{1,16}/g);
        const new_array = array?.map((x) => parseInt(x, 16));
        setOffersFromId(new_array);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });

    // query offers to
    proxy
      .queryContract(queryOffersTo)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const array = decoded?.match(/.{1,16}/g);
        const new_array = array?.map((x) => parseInt(x, 16));
        setOffersToId(new_array);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className='pt-2'>
        <div className='mb-4 text-2xl'>Your Offers History </div>
        <div className='text-xs md:text-sm'>
          <div className='py-2 px-4 grid grid-cols-5 bg-gradient-to-r from-gray-800 to-gray-600 rounded-t-lg'>
            <div>NFT</div>
            <div>From</div>
            <div>To</div>
            <div>Collection</div>
            <div>Price</div>
          </div>

          {offersToId?.map((x, index) => (
            <div key={index}>
              <OfferCardHistory id={x} sold={false} />
            </div>
          ))}
          {offersFromId?.map((x, index) => (
            <div key={index}>
              <OfferCardHistory id={x} sold={true} />
            </div>
          ))}
          <div className='grid grid-cols-5 h-6 bg-gray-900 rounded-b-xl'></div>
        </div>
      </div>
    </>
  );
}
