/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import btnClass from '../buttons/btn_class.json';
import {formControl} from './stiles.json';


export const InputGroup = ({
  ...props
})=> {
  const {children} = props;
  const lastIndex = children.length-1;
  const newChildren = children.map((child, index)=>
    (createElement(child, index, lastIndex)));
  return (
    <React.Fragment>
      <div
        className="flex stretch"
      >
        {newChildren}
      </div>
    </React.Fragment>
  );
};

InputGroup.propTypes = {
  children: PropTypes.any,
};

InputGroup.defaultProps = {
  children: [],
};


function createElement(reactChildren, index, lastIndex) {
  const classElement = [
    getClassFromtype(reactChildren),
    buildBorder(index, lastIndex),
  ].join(' ');
  return createElementByType(reactChildren, classElement, index);
}

function createElementByType(element, classElement, key) {
  return React.cloneElement(element, {
    ...element.props,
    className: classElement,
    key: key,
  });
}

function getClassFromtype(element) {
  let classElement = '';
  const type = element.type.name;
  switch (type) {
    case 'InputText':
      classElement = buildClassFromInput();
      break;
    case 'Button':
      classElement = buildClassFromButton(element.props.typeStyle);
      break;
  }
  return classElement;
}


function buildClassFromButton(typeStyle) {
  return [
    btnClass[typeStyle],
    'px-4 py-2',
    'font-bold uppercase text-xs',
    'outline-none focus:outline-none',
    'ease-linear',
    'transition-all duration-150 transition-all',
  ].join(' ');
}

function buildClassFromInput() {
  return formControl.join(' ').split(' ').filter((i)=>i!='rounded').join(' ');
}

function buildBorder(index, countIndex) {
  let result = 'mx-0';
  if (index === 0) {
    result = 'rounded-l';
  } else if (index === countIndex) {
    result = 'rounded-r ml-0';
  }
  return result;
}
