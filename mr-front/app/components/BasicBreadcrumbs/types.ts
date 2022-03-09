import { LinkProps } from '@mui/material';

export interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}
