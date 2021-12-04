import React from 'react';
import {Row} from './Row';
import '../../index.css';

export default {
  title: 'Table/Row',
  template: Row,
  argTypes: {},
};

const Template = (args) =>{
  const [headers] = React.useState(['method', 'url', 'actions']);
  const [element] = React.useState({
    id: 1,
    id_md5: '8749c80200d1ef8f535bef3d37706b49',
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
  });
  return (
    <table>
      <tbody>
        <Row
          headers={headers}
          element={element}
          {...args}
        />
      </tbody>
    </table>
  );
};

export const Default = Template.bind({});
