import React from 'react';
import btnClass from './btn_class.json';

export const GroupButton = ({...props})=> {
  // eslint-disable-next-line react/prop-types
  const {children} = props;
  // eslint-disable-next-line react/prop-types
  const lastIndex = children.length-1;

  // eslint-disable-next-line react/prop-types
  const newChildren = children.map((child, index)=>{
    const border = buildBorder(index, lastIndex);
    const {typeStyle, actionBtn} = child.props;
    return React.cloneElement(child, {
      key: index,
      actionBtn: actionBtn,
      // eslint-disable-next-line max-len
      className: `${btnClass[typeStyle]} px-4 py-2 font-bold uppercase text-xs outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 ease-linear transition-all mb-1 ${border}`,
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

GroupButton.defaultProps = {
  children: [],
};
