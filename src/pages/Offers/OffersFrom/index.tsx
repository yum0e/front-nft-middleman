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
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';

export default function OffersFrom() {
  const account = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const { address } = account;

  const address_target =
    'erd1wx7h5rnyxre7avl5pkgj3c2fha9aknrwms8mspelfcapwvjac3vqncm7nm';

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
    const proxy = new ProxyProvider(network.apiAddress);

    // query offers from
    proxy
      .queryContract(queryOffersFrom)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        const array = decoded?.match(/.{1,16}/g);
        const new_array = array?.map((x) => parseInt(x, 16));
        console.log(new_array);
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
        console.log(new_array);
        setOffersToId(new_array);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div>
        Offers id from me :{' '}
        <ul>
          {offersFromId?.map((x, index) => (
            <li key={index}>{x}</li>
          ))}
        </ul>
      </div>
      <div>
        Offers id to me :{' '}
        <ul>
          {offersToId?.map((x, index) => (
            <li key={index}>{x}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
