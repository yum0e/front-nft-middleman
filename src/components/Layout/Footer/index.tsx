import React from 'react';
import { contractAddress } from 'config';

const Footer = () => {
  const contractLink = `https://devnet-explorer.elrond.com/accounts/${contractAddress}`;
  return (
    <div className='z-30 pb-2 flex flex-col gap-2 text-center text-xs md:text-md font-bold'>
      <div className='font-ligth text-xs'>
        Contract address:{' '}
        <a target='_blanck' href={contractLink}>
          {contractAddress.slice(0, 7)}...{contractAddress.slice(-7)}
        </a>
      </div>
      <a
        href='https://github.com/yum0e/middleman-nft'
        target='_blanck'
        className='font-ligth text-xs'
      >
        See the github repo
      </a>
      <div>Made for the community</div>
    </div>
  );
};

export default Footer;
