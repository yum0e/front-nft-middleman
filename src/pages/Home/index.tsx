import * as React from 'react';
import Background from '../../assets/img/landing_page_bg.png';

const Home = () => {
  return (
    <>
      <div className='z-10 min-h-full flex justify-center content-center'>
        <div className='py-48 text-center grid '>
          <div className='flex flex-col gap-4 justify-center'>
            <span className='text-6xl font-bold '>P2P NFT exchange</span>
            <span className='text-5xl text-grad font-bold'>made secure</span>
          </div>
        </div>
      </div>
      <img
        className='min-w-full min-h-full absolute top-0 left-0 object-cover bg-repeat-space filter -hue-rotate-30'
        src={Background}
      />
    </>
  );
};

export default Home;
