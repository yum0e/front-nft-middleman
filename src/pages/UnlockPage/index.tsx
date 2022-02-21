import React from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { routeNames } from 'routes';

export const UnlockRoute: () => JSX.Element = () => {
  const {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton
  } = DappUI;
  const { isLoggedIn } = useGetLoginInfo();

  React.useEffect(() => {
    if (isLoggedIn) {
      window.location.href = routeNames.dashboard;
    }
  }, [isLoggedIn]);

  return (
    <div className='flex flex-fill align-items-center '>
      <div className='m-auto' data-testid='unlockPage'>
        <div className='card my-4 text-center'>
          <div className='py-4 px-2 px-sm-2 mx-lg-4'>
            <h4 className='mb-4 font-bold text-xl'>Login</h4>
            <p className='mb-4 text-lg font-ligth'>Pick a login method</p>

            <WalletConnectLoginButton
              callbackRoute={routeNames.dashboard}
              loginButtonText={'Maiar'}
            />
            <ExtensionLoginButton
              callbackRoute={routeNames.dashboard}
              loginButtonText={'Extension'}
            />

            <WebWalletLoginButton
              callbackRoute={routeNames.dashboard}
              loginButtonText={'Web wallet'}
            />
            <LedgerLoginButton
              loginButtonText={'Ledger'}
              callbackRoute={routeNames.dashboard}
              className={'test-class_name'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockRoute;
