import React from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CheckBadge() {
  return (
    <FontAwesomeIcon icon={faCheck} size='xs' className='ml-2 text-green-400' />
  );
}
