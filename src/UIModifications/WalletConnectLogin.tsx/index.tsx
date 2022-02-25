import React, { useEffect, useState } from 'react';

import { loginServices } from '@elrondnetwork/dapp-core';

import platform from 'platform';
import QRCode from 'qrcode';
import { routeNames } from 'routes';

const WalletConnectLogin = () => {
  const { useWalletConnectLogin } = loginServices;

  const callbackRoute = routeNames.dashboard;
  const logoutRoute = '/';
  const redirectAfterLogin = true;

  const [
    initLoginWithWalletConnect,
    { error },
    { uriDeepLink, walletConnectUri }
  ] = useWalletConnectLogin({
    callbackRoute,
    logoutRoute,
    redirectAfterLogin,
    shouldLoginUser: true
  });

  const [qrCodeSvg, setQrCodeSvg] = useState<string>('');
  const isMobileDevice =
    platform?.os?.family === 'iOS' || platform?.os?.family === 'Android';

  const generateQRCode = async () => {
    if (!walletConnectUri) {
      return;
    }

    const svg = await QRCode.toString(walletConnectUri, {
      type: 'svg'
    });

    setQrCodeSvg(svg);
  };

  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line
  }, [walletConnectUri]);

  useEffect(() => {
    initLoginWithWalletConnect();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='login_container'>
      <div className='login_root'>
        <div className='login_card'>
          <div className='grid grid-cols-1 justify-items-center'>
            <div
              className='login_qrCodeSvgContainer bg-red'
              dangerouslySetInnerHTML={{
                __html: qrCodeSvg
              }}
              style={{
                width: '15rem',
                height: '15rem'
              }}
            />

            {isMobileDevice ? (
              <React.Fragment>
                <a
                  id='accessWalletBtn'
                  data-testid='accessWalletBtn'
                  className='my-4 custom-btn '
                  href={uriDeepLink || undefined}
                  rel='noopener noreferrer nofollow'
                  target='_blank'
                >
                  Login
                </a>
              </React.Fragment>
            ) : (
              <p className='my-4 '>
                Scan the QR code using{' '}
                <span className='text-grad-2'>maiar</span>
              </p>
            )}
            <div>
              {error && <p className='my-4 login_errorMessage'>{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectLogin;
