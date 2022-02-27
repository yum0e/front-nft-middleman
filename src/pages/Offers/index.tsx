import React from 'react';
import {
  useGetNetworkConfig,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query,
  AddressValue
} from '@elrondnetwork/erdjs';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { contractAddress } from 'config';
import { routeNames } from 'routes';
import OffersFrom from './OffersFrom';
import OffersHistory from './OffersHistory';

export default function Offers() {
  const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const proxy = new ProxyProvider(network.apiAddress);

  const [nbSubmitted, setNbSubmitted] = React.useState<number>(0);

  // know how many submitted offers from and to the address
  const queryNbOffersSubmitted = new Query({
    address: new Address(contractAddress),
    func: new ContractFunction('getNbSubmittedFor'),
    args: [new AddressValue(new Address(address))]
  });

  const nbOffersSubmittedQuery = async () => {
    await proxy
      .queryContract(queryNbOffersSubmitted)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const buffer = Buffer.from(encoded, 'base64');
        setNbSubmitted(buffer[0]);
      })
      .catch((err) => {
        console.error('Unable to call VM query for queryOffersWithId', err);
      });
  };

  React.useEffect(() => {
    nbOffersSubmittedQuery();
  }, []);
  return (
    <div className='z-10 w-full px-8 md:px-48 mb-4'>
      <div className='font-bold text-3xl '>My Offers</div>
      <button className='my-2 py-1 px-2 rounded-xl text-sm bg-blue-500'>
        <Link to={routeNames.dashboard}>Go back</Link>
      </button>

      <div className='text-center'>
        <span className='text-grad'>Disclaimer</span> - Only verified
        collections have the verified tick
        <FontAwesomeIcon
          icon={faCheck}
          size='sm'
          className='ml-3 text-green-400'
        />
        , when you don&apos;t see this tick near the collection in the offer, be
        very careful.
      </div>

      {nbSubmitted > 0 ? (
        <>
          <OffersFrom />
        </>
      ) : (
        <div className='my-4 flex justify-center'>
          Sorry, you don&apos;t have any offers yet!
        </div>
      )}

      <OffersHistory />
    </div>
  );
}
