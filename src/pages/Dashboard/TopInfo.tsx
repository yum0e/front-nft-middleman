import * as React from 'react';
import { useGetAccountInfo, DappUI } from '@elrondnetwork/dapp-core';

interface ConnectedBoolean {
  isConnected: boolean;
}

const TopInfo = (props: ConnectedBoolean) => {
  const { address, account } = useGetAccountInfo();
  const explorer_link = `https://explorer.elrond.com/accounts/${address}`;

  return (
    <>
      <div className='py-4'>
        {props.isConnected ? (
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
              <DappUI.Denominate
                value={account.balance}
                data-testid='balance'
                showLabel={false}
              />{' '}
              EGLD in your wallet
            </div>
          </>
        ) : (
          <div>
            Please connect yourself to see your{' '}
            <span className='text-grad font-semibold'>account balance</span>,
            your <span className='text-grad-2 font-semibold'>offers</span> or
            begin an{' '}
            <span className='text-grad-3 font-semibold'> exchange</span>.
          </div>
        )}
      </div>
    </>
  );
};

export default TopInfo;
