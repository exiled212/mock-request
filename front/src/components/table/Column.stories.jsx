import React from 'react';
import {Column} from './Column';
import '../../index.css';

export default {
  title: 'Table/Column',
  template: Column,
  argTypes: {},
};

const Template = (args) => {
  const value = 'test value';
  return (
    <table>
      <tbody>
        <tr><Column {...args}>{value}</Column></tr>
      </tbody>
    </table>
  );
};

export const Default = Template.bind({});
