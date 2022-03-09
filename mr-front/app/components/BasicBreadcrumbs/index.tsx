import {
  Typography,
  Breadcrumbs,
  Link,
  Box
} from '@mui/material';
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { LinkRouterProps } from './types';

export const BasicBreadcrumbs = ({...props}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 360 }}>
      <Routes>
        <Route path="*" element={<Page />} />
      </Routes>
    </Box>
  );
}

const Page = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} >
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="primary.contrastText" key={to} sx={{ fontWeight: 'bold' }}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="grey.900" to={to} key={to} sx={{ fontWeight: 'bold' }}>
            {breadcrumbNameMap[to]}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

const breadcrumbNameMap: { [key: string]: string } = {
  '/admin': 'Main',
  '/admin/home': 'Home',
  '/admin/request': 'Request',
  '/admin/response': 'Response',
  '/admin/config': 'Config',
  '/admin/request/pendings': 'Pendientes',
  '/admin/request/all': 'Existentes'
};


export default BasicBreadcrumbs;

export const BreadcrumbMap = breadcrumbNameMap;
