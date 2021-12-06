import React from 'react';
import {InputText} from './InputText';
import '../../index.css';

export default {
  title: 'Input/Text',
  template: InputText,
  argTypes: {
    type: {
      control: {type: 'radio'},
      options: ['text', 'password', 'email'],
    },
    disabled: {control: {type: 'boolean'}},
    readOnly: {control: {type: 'boolean'}},
    label: {control: {type: 'text'}},
    value: {control: {type: 'text'}},
    placeholder: {control: {type: 'text'}},
    small: {control: {type: 'text'}},
  },
};

const Template = (args)=>
  <InputText
    {...args}
  />;

export const Default = Template.bind({});
Default.args = {};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  value: 'Lorem ipsum dolor sit amet elit',
  disabled: false,
  readOnly: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  value: 'Lorem ipsum dolor sit amet elit',
  disabled: true,
  readOnly: false,
};
