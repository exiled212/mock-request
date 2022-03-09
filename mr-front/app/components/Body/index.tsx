import * as React from 'react';
import {
  Divider,
  IconButton,
  Toolbar,
  List,
  CssBaseline,
  Drawer,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import {
  NavLink as RouterLink
} from 'react-router-dom';
import { ListItemProps } from '@mui/material/ListItem';
import { styled, useTheme } from '@mui/material/styles';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import BasicBreadcrumbs, { BreadcrumbMap } from '~/components/BasicBreadcrumbs';
import {
  useLocation,
} from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Body({...props}) {
  const { children } = props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
  setOpen((prevOpen) => !prevOpen);
};

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <BasicBreadcrumbs/>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemLink to="/admin/home" icon={<HomeIcon/>}/>
          <ListItemLink to="/admin/request" icon={<CloudUploadIcon/>}/>
          <ListItemLink to="/admin/response" icon={<CloudDownloadIcon/>}/>
          <ListItemLink to="/admin/config" icon={<BuildIcon/>}/>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

function ListItemLink(props: ListItemLinkProps) {

  const location = useLocation();

  const { to, open, icon, ...other } = props;
  const primary = BreadcrumbMap[to];

  let iconOpen = null;
  if (open != null) {
    iconOpen = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <li>
      <ListItemButton component={RouterLink as any} to={to} {...other} selected={location.pathname.includes(to)} >
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={primary} />
        {iconOpen}
      </ListItemButton>
    </li>
  );
}

interface ListItemLinkProps extends ListItemProps {
  to: string;
  open?: boolean;
  icon?: any;
}
