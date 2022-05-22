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
        <div className='flex justify-end items-center font-semibold gap-5'>
          <div>
            {isLoggedIn ? (
              <button className='custom-btn' onClick={handleLogout}>
                Close
              </button>
            ) : (
              <>
                {window.location.pathname == '/offers' ||
                window.location.pathname == '/dashboard' ? (
                  <Link
                    className='px-4 py-3 rounded-xl bg-gradient-to-r from-white to-white text-black hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-500 hover:text-white cursor-pointer no-underline'
                    to={routeNames.unlock}
                    style={{ textDecoration: 'none' }}
                  >
                    Connect
                  </Link>
                ) : (
                  <Link
                    className='px-4 py-3 rounded-xl bg-gradient-to-r from-white to-white text-black hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-500 hover:text-white cursor-pointer no-underline'
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
      </div>
    </>
  );
};

export default Navbar;
