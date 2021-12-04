/* eslint-disable react/prop-types */
import React from 'react';
import {Column} from './Column';

export const Row = ({headers, element, events, ...props}) => {
  return (
    <React.Fragment>
      <tr key={element.id} {...props}>
        {headers.map((header, i)=>(
          <Column key={i}>{element[header]}</Column>
        ))}
      </tr>
    </React.Fragment>
  );
};

