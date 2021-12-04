import React from 'react';
import {GroupButton} from './GroupButton';
import {Button} from './Button';
import '../../index.css';
export default {
  title: 'Buttons/GroupButton',
  template: GroupButton,
  argTypes: {},
};


/**
 * action btn
 * @param {*} value text to alert
 * @return {void}
 */
function actionBtnRun(value) {
  alert(value);
}

const Template = (args)=> <GroupButton {...args}>
  <Button typeStyle="primary" actionBtn={(event)=>{
    actionBtnRun('Left');
  }} >Left</Button>
  <Button typeStyle="primary" actionBtn={()=>{
    actionBtnRun('Mid');
  }} >Mid</Button>
  <Button typeStyle="primary" actionBtn={()=>{
    actionBtnRun('Right');
  }} >Right</Button>
</GroupButton>;

export const Default = Template.bind({});
