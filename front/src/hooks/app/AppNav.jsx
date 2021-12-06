/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {Nav} from '../../components/body/Nav';

const navigationData = [
  {name: 'Dashboard', href: '#', current: true},
  {name: 'Team', href: '#', current: false},
  {name: 'Projects', href: '#', current: false},
  {name: 'Calendar', href: '#', current: false},
];

export const AppNav = () => {
  const [navigation] = React.useState(navigationData);

  return (
    <React.Fragment>
      <Nav navigation={navigation} />
    </React.Fragment>
  );
};
