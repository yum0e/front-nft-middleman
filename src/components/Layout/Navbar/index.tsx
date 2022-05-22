import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Link } from 'react-router-dom';
import { routeNames } from 'routes';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}`);
  };

  const isLoggedIn = Boolean(address);

  console.log(window.location.pathname);

  return (
    <>
      <div className='z-30 px-4 pt-8 md:pt-12 pb-4 md:px-48 flex justify-between '>
        <div className='flex items-center font-bold md:text-3xl text-2xl'>
          <Link to={isLoggedIn ? routeNames.dashboard : routeNames.home}>
            middleman.
            <span className='text-grad'>nft</span>
          </Link>
        </div>
        <div className='flex justify-end items-center font-semibold gap-4 '>
          <Link
            className='custom-btn-3'
            to={routeNames.trades}
            style={{ textDecoration: 'none' }}
          >
            All trades
          </Link>
          {isLoggedIn ? (
            <button className='custom-btn' onClick={handleLogout}>
              Disconnect
            </button>
          ) : (
            <>
              {window.location.pathname == '/offers' ||
              window.location.pathname == '/dashboard' ? (
                <Link
                  className='custom-btn'
                  to={routeNames.unlock}
                  style={{ textDecoration: 'none' }}
                >
                  Connect
                </Link>
              ) : (
                <Link
                  className='custom-btn'
                  to={routeNames.dashboard}
                  style={{ textDecoration: 'none' }}
                >
                  Launch App
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
