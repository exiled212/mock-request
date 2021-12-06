/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';
import {formControl} from './stiles.json';

export const InputText = ({
  type,
  label,
  value,
  small,
  placeholder,
  ...props
})=> {
  const {
    disabled,
    readOnly,
  } = props;
  return (
    <React.Fragment>
      <div>
        {(label)?
          <label
            className={[
              'inline-block',
              'mb-2',
            ].join(' ')}
            htmlFor=""
          >{label}</label>:null
        }
        <input
          type={type}
          className={[
            ...formControl,
            (disabled)?'bg-gray-300':null,
            (disabled && !readOnly)?'text-gray-500':null,
          ].join(' ')}
          defaultValue={value}
          placeholder={placeholder}
          {...props}
        />
        {(small)?
          <small
            className={[
              'block',
              'text-gray-500',
              'mt-1',
            ].join(' ')}
          >{small}
          </small>:null
        }
      </div>
    </React.Fragment>
  );
};

InputText.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  small: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

InputText.defaultProps = {
  type: 'text',
};
