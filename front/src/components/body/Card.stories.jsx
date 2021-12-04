import React from 'react';
import {Card} from './Card';
import '../../index.css';

export default {
  title: 'Body/Card',
  Template: Card,
  argTypes: {},
};

const Template = (args) => {
  return (
    <Card
      {...args}
    >
      <h1>Hola a todos</h1>
    </Card>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Sample Card title',
  titleProps: [],
  footer: 'Sample Card footer',
  footerProps: [],
};


export const OnlyContent = Template.bind({});
OnlyContent.args = {};

export const WithTitle = Template.bind({});
WithTitle.args = {
  title: 'Title',
};

export const WithCenterTitle = Template.bind({});
WithCenterTitle.args = {
  title: 'Title Center',
  titleProps: ['text-center'],
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  footer: 'Footer',
};

export const WithCenterFooter = Template.bind({});
WithCenterFooter.args = {
  footer: 'Footer Center',
  footerProps: ['text-center'],
};
