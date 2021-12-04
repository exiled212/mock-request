import React from 'react';
import {Nav} from './Nav';
import '../../index.css';

export default {
  title: 'Body/Nav',
  template: Nav,
  argTypes: {},
};

const Template = (args) => {
  const [navigation] = React.useState([
    {name: 'Dashboard', href: '#', current: true},
    {name: 'Team', href: '#', current: false},
    {name: 'Projects', href: '#', current: false},
    {name: 'Calendar', href: '#', current: false},
  ]);

  return (
    <Nav
      navigation={navigation}
      {...args}
    />
  );
};

export const Default = Template.bind({});
