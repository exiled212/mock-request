/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

export const Column = ({...props}) => {
/* eslint-disable react/prop-types */
  const {children} = props;

  return (
    <React.Fragment>
      {/* eslint-disable-next-line max-len */}
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{children}</td>
    </React.Fragment>
  );
};
