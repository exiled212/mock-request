import React from 'react';
import {Headers} from './Headers';
import '../../index.css';

export default {
  title: 'Table/Headers',
  template: Headers,
  argTypes: {},
};

const Template = (args) => {
  const [headers] = React.useState([
    'name',
    'age',
    'address',
    'date',
  ]);
  return (
    <table>
      <Headers
        headers={headers}
        {...args}
      />
    </table>
  );
};

export const Default = Template.bind({});
