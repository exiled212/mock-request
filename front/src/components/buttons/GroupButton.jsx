/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import btnClass from './btn_class.json';
import PropTypes from 'prop-types';

export const GroupButton = ({...props})=> {
  const {children} = props;
  const lastIndex = children.length-1;

  const newChildren = children.map((child, index)=>{
    const border = buildBorder(index, lastIndex);
    const {typeStyle, actionBtn} = child.props;
    return React.cloneElement(child, {
      key: index,
      actionBtn: actionBtn,
      className: [
        btnClass[typeStyle],
        border,
        'px-4 py-2',
        'font-bold uppercase text-xs',
        'outline-none focus:outline-none',
        'mb-1',
        'ease-linear',
        'transition-all duration-150 transition-all mb-1',
      ].join(' '),
    });
  });

  return (
    <React.Fragment>
      <div {...props} >
        {newChildren}
      </div>
    </React.Fragment>
  );

  /**
   * Build Style from button group
   * @param {number} index
   * @param {number} countIndex
   * @return {string}
   */
  function buildBorder(index, countIndex) {
    let result = 'mx-0';
    if (index === 0) {
      result = 'rounded-l';
    } else if (index === countIndex) {
      result = 'rounded-r ml-0';
    }
    return result;
  }
};

GroupButton.propTypes = {
  children: PropTypes.any,
};

GroupButton.defaultProps = {
  children: [],
};
