import React from 'react';
import {Header} from './Header';
import '../../index.css';

export default {
  title: 'Table/Header',
  template: Header,
  argTypes: {},
};

const Template = (args) => {
  const value = 'test value';
  return (
    <table>
      <thead>
        <tr>
          <Header {...args}>{value}</Header>
        </tr>
      </thead>
    </table>
  );
};
export const Default = Template.bind({});
