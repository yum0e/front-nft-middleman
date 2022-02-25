import React from 'react';
import { DappUI, useGetLoginInfo } from '@elrondnetwork/dapp-core';
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
              <button onClick={handleOpenModal} className='custom-btn'>
                Maiar
              </button>
              <ExtensionLoginButton
                callbackRoute={routeNames.dashboard}
                loginButtonText={'Extension'}
              />

              <WebWalletLoginButton
                callbackRoute={routeNames.dashboard}
                loginButtonText={'Web wallet'}
              />
              {showLoginModal && (
                <div>
                  <div className='my-4 bg-gray-900 rounded p-8'>
                    <div className='d-flex justify-content-between align-items-center pt-spacer px-spacer mb-0'>
                      <div className={'px-3'}>Maiar Login</div>
                      <button
                        type='button'
                        className='btn btn-light px-3 py-2'
                        onClick={handleCloseModal}
                      ></button>
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
