import * as React from 'react';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';

const Home = () => {
  return (
    <>
      <div className='min-h-full flex justify-center content-center'>
        <div className='py-32 text-center grid '>
          <div className='flex flex-col gap-4 justify-center'>
            <span className='text-6xl font-bold '>P2P NFT exchange</span>
            <span className='text-5xl text-grad font-bold'>made secure</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
