/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({
  title,
  footer,
  mainClass,
  titleProps,
  footerProps,
  ...props
}) => {
  const {children} = props;
  const newRef = React.createRef();
  return (
    <React.Fragment>
      <div
        ref={newRef}
        className={[
          'bg-white',
          'relative flex flex-col',
          'border border-solid border-gray-300 box-border rounded',
          'min-w-0',
          'break-words',
          ...mainClass,
        ].join(' ')}
        {...props}
      >
        {(title)?<div
          className={[
            'py-2 px-4',
            'bg-gray-200',
            'border-b border-gray-300 rounded-t',
            'mb-0',
            'font-bold',
            ...titleProps,
          ].join(' ')}
        >{title}</div>:null}
        <div
          className={[
            'py-4 px-4',
            'flex-auto',
          ].join(' ')}
        >{children}</div>
        {(footer)?<div
          className={[
            'py-2 px-4',
            'bg-gray-200',
            'border-t border-gray-300 rounded-b',
            'mt-0',
            'font-bold',
            ...footerProps,
          ].join(' ')}
        >
          {footer}
        </div>:null}
      </div>
    </React.Fragment>
  );
};

Card.propTypes = {
  children: PropTypes.any,
  title: PropTypes.any,
  titleProps: PropTypes.array,
  footer: PropTypes.any,
  footerProps: PropTypes.array,
  mainClass: PropTypes.array,
};

Card.defaultProps = {
  titleProps: [],
  footerProps: [],
  mainClass: [],
};
