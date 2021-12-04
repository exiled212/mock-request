import React from 'react';
import {Table} from './Table';
import '../../index.css';

export default {
  title: 'Body/Table',
  template: Table,
  argTypes: {},
};

const Template = (args) => {
  const [headers] = React.useState(['id', 'name', 'lastname']);
  const [rows] = React.useState([
    {id: 1, name: 'Daniel', lastname: 'Ruiz'},
    {id: 2, name: 'Felipe', lastname: 'Avella'},
    {id: 3, name: 'Felipe', lastname: 'Ruiz'},
    {id: 1, name: 'Daniel', lastname: 'Avella'},
  ]);
  return (
    <Table
      headers={headers}
      rows={rows}
      {...args}
    />
  );
};

export const Default = Template.bind({});
