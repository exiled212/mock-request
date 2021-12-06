/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';
import btnClass from './btn_class.json';

export const Button = ({typeStyle, actionBtn, ...props}) => {
  const btnType = (btnClass[typeStyle])?btnClass[typeStyle]:btnClass['primary'];
  const {children} = props;
  return (
    <React.Fragment>
      <button
        type="button"
        className= {[
          btnType,
          'py-2 px-4',
          'rounded-lg',
          'font-bold uppercase text-xs',
        ].join(' ')}
        onClick={(...args)=>{
          actionBtn(...args);
        }}
        {...props}
      >
        {children}
      </button>
    </React.Fragment>
  );
};


Button.propTypes = {
  children: PropTypes.any,
  typeStyle: PropTypes.oneOf(Object.keys(btnClass)),
  actionBtn: PropTypes.func,
};

Button.defaultProps = {
  typeStyle: 'primary',
  actionBtn: ()=>({}),
};
