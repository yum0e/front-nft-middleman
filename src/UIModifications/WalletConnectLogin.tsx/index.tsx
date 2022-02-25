import React, { useEffect, useState } from 'react';

import { loginServices } from '@elrondnetwork/dapp-core';
import { routeNames } from 'routes';
import platform from 'platform';
import QRCode from 'qrcode';

const WalletConnectLogin = () => {
  const { useWalletConnectLogin } = loginServices;

  const callbackRoute = routeNames.dashboard;
  const loginButtonText = 'Connect';
  const title = 'Maiar Login';
  const logoutRoute = '/';
  const lead = 'Scan the QR code using Maiar';
  const redirectAfterLogin = true;

  const [
    initLoginWithWalletConnect,
    { error },
    { uriDeepLink, walletConnectUri }
  ] = useWalletConnectLogin({
    logoutRoute,
    callbackRoute,
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
          <div className='login_cardBody'>
            <div
              className='login_qrCodeSvgContainer'
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
                <p className='login_leadText'>{loginButtonText}</p>
                <a
                  id='accessWalletBtn'
                  data-testid='accessWalletBtn'
                  className='custom-btn'
                  href={uriDeepLink || undefined}
                  rel='noopener noreferrer nofollow'
                  target='_blank'
                >
                  Login
                </a>
              </React.Fragment>
            ) : (
              <p className='login_leadText'>{lead}</p>
            )}
            <div>{error && <p className='login_errorMessage'>{error}</p>}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectLogin;
