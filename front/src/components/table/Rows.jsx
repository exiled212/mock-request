import React from 'react';
import PropTypes from 'prop-types';
import {Row} from './Row';
export const Rows = ({
  headers,
  rows,
  ...props
}) => {
  return (<React.Fragment>
    <tbody className="bg-white divide-y divide-gray-200" {...props}>
      {rows.map((row, i)=>(
        <Row key={i} headers={headers} element={row}></Row>
      ))}
    </tbody>
  </React.Fragment>);
};
Rows.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

Rows.defaultProps = {
  headers: [],
  rows: [],
};
