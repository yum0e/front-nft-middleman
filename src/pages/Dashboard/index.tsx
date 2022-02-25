import * as React from 'react';
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
import { Link } from 'react-router-dom';
import { contractAddress } from 'config';
import { routeNames } from 'routes';
import Actions from './Actions';
import TopInfo from './TopInfo';

const Dashboard = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
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
    <>
      <div className='px-4 md:px-48'>
        {isLoggedIn ? (
          <>
            <div className='font-bold'>Hello !</div>

            <TopInfo />
            <div className='mt-4'>
              <Link to={routeNames.offers} className='font-bold custom-btn-2 '>
                My offers{' '}
                {nbSubmitted > 0 ? (
                  <span className='ml-1 px-2 rounded-full bg-green-500'>
                    {nbSubmitted}
                  </span>
                ) : (
                  <span className='ml-1 px-1 rounded-full bg-red-500'>0</span>
                )}
              </Link>
              <div>{}</div>
            </div>
            <div className='py-4'>
              <Actions />
            </div>
            {/* <Transactions /> */}
          </>
        ) : (
          <div>Not connected</div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
