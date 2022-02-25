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

  return (
    <>
      <div className='grid grid-cols-2 px-4 pt-12 pb-4 md:px-48'>
        <div className='flex items-center font-bold md:text-3xl text-2xl'>
          <Link to={isLoggedIn ? routeNames.dashboard : routeNames.home}>
            middleman.
            <span className='text-grad'>nft</span>
          </Link>
        </div>
        <ul className='flex justify-end items-center font-semibold gap-5'>
          <li>
            {isLoggedIn ? (
              <button className='custom-btn' onClick={handleLogout}>
                Close
              </button>
            ) : (
              <Link
                className='px-4 py-3 rounded-xl bg-gradient-to-r from-white to-white text-black hover:bg-gradient-to-r hover:from-red-500 hover:to-yellow-500 hover:text-white cursor-pointer no-underline'
                to={routeNames.unlock}
                style={{ textDecoration: 'none' }}
              >
                Connect
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
