import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Link } from 'react-router-dom';
import { routeNames } from 'routes';
import Actions from './Actions';
import TopInfo from './TopInfo';

const Dashboard = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  return (
    <>
      <div className='px-4 md:px-48'>
        {isLoggedIn ? (
          <>
            <div className='font-bold'>Hello !</div>

            <TopInfo />
            <div className='mt-4'>
              <Link to={routeNames.offers} className='font-bold custom-btn-2 '>
                My offers
              </Link>
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
