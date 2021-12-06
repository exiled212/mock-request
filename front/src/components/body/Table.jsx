/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';
import {Rows} from '../table/Rows';
import {Headers} from '../table/Headers';

export const Table = ({
  headers,
  rows,
  ...props
}) => {
  return (
    <React.Fragment>
      <div className="flex flex-col" {...props}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          {/* eslint-disable-next-line max-len */}
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {/* eslint-disable-next-line max-len */}
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <Headers headers={headers}/>
                <Rows headers={headers} rows={rows} />
              </table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

Table.propTypes= {
  rows: PropTypes.array,
  headers: PropTypes.array.isRequired,
};
