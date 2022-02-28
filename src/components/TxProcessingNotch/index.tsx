import React from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TxProcessingNotch() {
  return (
    <FontAwesomeIcon
      icon={faCircleNotch}
      size='xs'
      className='text-green-400'
    />
  );
}
