import * as React from 'react';
import { useGetAccountInfo, DappUI } from '@elrondnetwork/dapp-core';

const TopInfo = () => {
  const { address, account } = useGetAccountInfo();
  const explorer_link = `https://explorer.elrond.com/accounts/${address}`;

  return (
    <>
      <div>
        Connected with
        <a href={explorer_link} target='_blanck'>
          <span className='text-grad'>
            {' '}
            {address.slice(0, 5)}...{address.slice(-5)}
          </span>
        </a>
      </div>

      <div>
        <DappUI.Denominate value={account.balance} /> in your wallet
      </div>
    </>
  );
};

export default TopInfo;
