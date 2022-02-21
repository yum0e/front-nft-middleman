import * as React from 'react';
import Actions from './Actions';
import TopInfo from './TopInfo';
import Transactions from './Transactions';
import axios from 'axios';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

const Dashboard = () => {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  return (
    <>
      <div className='px-48'>
        {isLoggedIn ? (
          <>
            <div className='font-bold'>Hello !</div>
            <TopInfo />
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
