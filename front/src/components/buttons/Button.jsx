import React from 'react';
import PropTypes from 'prop-types';
import btnClass from './btn_class.json';

export const Button = ({typeStyle, actionBtn, ...props}) => {
  const btnType = (btnClass[typeStyle])?btnClass[typeStyle]:btnClass['primary'];
  // eslint-disable-next-line react/prop-types
  const {children} = props;
  return (
    <React.Fragment>
      <button
        type="button"
        // eslint-disable-next-line max-len
        className= {`py-2 px-4 rounded-lg ${btnType} font-bold uppercase text-xs`}
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
  typeStyle: PropTypes.oneOf(Object.keys(btnClass)),
  actionBtn: PropTypes.func,
};

Button.defaultProps = {
  typeStyle: 'primary',
  actionBtn: ()=>({}),
};
