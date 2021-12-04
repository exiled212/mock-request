import React from 'react';
import {Button} from './Button';
import '../../index.css';

export default {
  title: 'Buttons/Button',
  template: Button,
  argTypes: {},
};

const Template = (args) => {
  const [count, setCount] = React.useState(0);
  return (
    <React.Fragment>
      <div>
        {/* eslint-disable-next-line max-len */}
        <label><span className='font-bold'> Click count:</span> {count}</label>
      </div>
      <div>
        <Button
          {...args}
          actionBtn={()=>{
            setCount(count+1);
          }}
        >
          Add count
        </Button>
      </div>
    </React.Fragment>
  );
};

export const Default = Template.bind({});
Default.args = {
  typeStyle: 'primary',
};

export const Primary = Template.bind({});
Primary.args = {
  typeStyle: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  typeStyle: 'secondary',
};

export const Success = Template.bind({});
Success.args = {
  typeStyle: 'success',
};

export const Danger = Template.bind({});
Danger.args = {
  typeStyle: 'danger',
};

export const Warning = Template.bind({});
Warning.args = {
  typeStyle: 'warning',
};

export const Info = Template.bind({});
Info.args = {
  typeStyle: 'info',
};

export const Light = Template.bind({});
Light.args = {
  typeStyle: 'light',
};

export const Dark = Template.bind({});
Dark.args = {
  typeStyle: 'dark',
};

export const Link = Template.bind({});
Link.args = {
  typeStyle: 'link',
};
