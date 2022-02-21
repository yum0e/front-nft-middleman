import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();
  return (
    <div className='bg-black text-white flex flex-col min-h-screen'>
      <Navbar />
      <AuthenticatedRoutesWrapper
        routes={routes}
        unlockRoute={`${routeNames.unlock}${search}`}
      >
        {children}
      </AuthenticatedRoutesWrapper>
      <Footer />
    </div>
  );
};

export default Layout;
