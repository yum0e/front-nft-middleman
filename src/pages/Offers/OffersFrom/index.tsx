import React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  BinaryCodec,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import OfferCard from '../OfferCard';
import { contractAddress } from 'config';

export default function OffersFrom() {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
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
  console.log(offersToId);
  return (
    <>
      <div className='py-2'>
        <div className='text-xl'>Offers to me </div>
        <ul className='flex flex-col gap-3'>
          {offersToId?.map((x, index) => (
            <li key={index}>
              <OfferCard id={x} buyable={true} toDelete={false} />
            </li>
          ))}
        </ul>
      </div>
      <div className='py-4'>
        <div className='text-xl'>Offers from me </div>
        <ul className='flex flex-col gap-3'>
          {offersFromId?.map((x: any, index: any) => (
            <li key={index}>
              <OfferCard id={x} buyable={false} toDelete={true} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
