import React from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { routeNames } from 'routes';

import WalletConnectLogin from 'UIModifications/WalletConnectLogin.tsx';

export const UnlockRoute: () => JSX.Element = () => {
  const {
    ExtensionLoginButton,
    WebWalletLoginButton
    //LedgerLoginButton,
    //WalletConnectLoginButton
  } = DappUI;

  const [showLoginModal, setShowLoginModal] = React.useState(false);

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
  const { isLoggedIn } = useGetLoginInfo();

  React.useEffect(() => {
    if (isLoggedIn) {
      window.location.href = routeNames.dashboard;
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className='flex flex-fill align-items-center '>
        <div className='m-auto' data-testid='unlockPage'>
          <div className='card my-4 text-center'>
            <div className='py-4 px-2 px-sm-2 mx-lg-4'>
              <h4 className='mb-4 font-bold text-xl'>Login</h4>
              <p className='mb-4 text-lg font-ligth'>Pick a login method</p>
              <div className='grid grid-cols-3 gap-4'>
                <ExtensionLoginButton
                  callbackRoute={routeNames.dashboard}
                  loginButtonText={'Extension'}
                />
                <button
                  onClick={handleOpenModal}
                  className='bg-blue-700 rounded hover:bg-blue-800 '
                >
                  Maiar
                </button>
                <WebWalletLoginButton
                  callbackRoute={routeNames.dashboard}
                  loginButtonText={'Web wallet'}
                />
              </div>
              {showLoginModal && (
                <div>
                  <div className='my-4 grid-cols-1 bg-gray-900 rounded p-8'>
                    <div className='flex justify-between mb-2'>
                      <div></div>
                      <div className={'px-3'}>Maiar Login</div>
                      <button
                        type='button'
                        className=''
                        onClick={handleCloseModal}
                      >
                        <FontAwesomeIcon icon={faTimes} size='lg' />
                      </button>
                    </div>

                    <div className='modal-card-body text-center'>
                      <WalletConnectLogin />
                    </div>
                  </div>

                  {/* <WalletConnectLoginButton
              callbackRoute={routeNames.dashboard}
              loginButtonText={'Maiar'}
            /> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnlockRoute;
