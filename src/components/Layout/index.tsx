import React from 'react';
import { AuthenticatedRoutesWrapper } from '@elrondnetwork/dapp-core';
import { useLocation } from 'react-router-dom';
import routes, { routeNames } from 'routes';
import Background from '../../assets/img/landing_page_bg.png';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();
  return (
    <div className='z-10 bg-gradient-to-br from-black to-gray-900 text-white flex flex-col min-h-screen'>
      {/* <div className='absolute w-96 h-96 -inset-x-14 right-50 filter blur-3xl rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500'></div> */}

      <Navbar />

      <div className='background-image' style={backgroundStyle}></div>
      <img
        className='min-w-full min-h-full absolute top-0 left-0 object-cover bg-repeat-space'
        src={Background}
      />
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

const backgroundStyle = {
  backgroundImage: `url(${Background})`
};
