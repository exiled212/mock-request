import React from 'react';
import {InputGroup} from './InputGroup';
import {Button} from '../buttons/Button';
import {InputText} from './InputText';
import '../../index.css';

export default {
  title: 'Input/Group',
  template: InputGroup,
  argTypes: {
  },
};

const Template = (args)=>
  <InputGroup
    {...args}
  >
    <Button>Some BTN</Button>
    <InputText/>
  </InputGroup>;

export const Default = Template.bind({});
Default.args = {};
