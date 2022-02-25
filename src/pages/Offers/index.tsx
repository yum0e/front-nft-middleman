import React from 'react';
import { Link } from 'react-router-dom';
import { routeNames } from 'routes';
import OffersFrom from './OffersFrom';

export default function Offers() {
  return (
    <div className='px-8 md:px-48 min-h-screen'>
      <div className='font-bold text-3xl '>My Offers</div>
      <button className='my-2 py-1 px-2 rounded-xl text-sm bg-blue-500'>
        <Link to={routeNames.dashboard}>Go back</Link>
      </button>
      <OffersFrom />
    </div>
  );
}
