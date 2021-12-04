import React from 'react';
import {Rows} from './Rows';
import '../../index.css';

export default {
  title: 'Table/Rows',
  template: Rows,
  argTypes: {},
};

const Template = (args) => {
  const [headers] = React.useState(['method', 'url']);
  const [rows] = React.useState([
    {
      id: 1,
      id_md5: 'MD5_1',
      method: 'GET',
      url: '/test/url',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
      },
      queryParams: {
        'key': 'value',
      },
      body: {
        message: 'this es a message',
      },
    },
    {
      id: 2,
      id_md5: 'MD5_2',
      method: 'POST',
      url: '/test/url/100',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
      },
      queryParams: {
        'key': 'value',
      },
      body: {
        message: 'this es a message 2',
      },
    },
    {
      id: 3,
      id_md5: 'MD5_3',
      method: 'PUT',
      url: '/test/url/lol',
      headers: {
        'accept-encoding': 'gzip, deflate, br',
      },
      queryParams: {
        'key': 'value',
      },
      body: {
        message: 'this es a message 3',
      },
    },
  ]);
  return (
    <table>
      <Rows
        rows={rows}
        headers={headers}
        {...args}
      />
    </table>
  );
};

export const Default = Template.bind({});
