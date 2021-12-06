/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

export const Header = ({...props}) => {
  // eslint-disable-next-line react/prop-types
  const {children} = props;
  return (
    <React.Fragment>
      {/* eslint-disable-next-line max-len */}
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
        {children}
      </th>
    </React.Fragment>
  );
};
