/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
import React from 'react';
import {Header} from './Header';

export const Headers = ({
  headers,
  ...props
}) => {
  return (
    <React.Fragment>
      <thead className="bg-gray-50" {...props}>
        <tr>
          {headers.map((header, i)=>(
            <Header key={i}>{header}</Header>
          ))}
        </tr>
      </thead>
    </React.Fragment>
  );
};
