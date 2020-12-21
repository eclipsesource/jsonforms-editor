/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';

import { DrawerContextInstance } from '../context';

const footerHeight = '40px';
const drawerWidth = '400px';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  main: {
    minHeight: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    height: '100vh',
    display: 'flex',
  },
  footer: {
    zIndex: theme.zIndex.drawer + 1,
    padding: theme.spacing(1, 1),
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    height: footerHeight,
    bottom: 0,
    left: 'auto',
    right: 0,
    position: 'fixed',
    width: '100%',
  },
  fakeFooter: {
    marginBottom: footerHeight,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
}));

interface LayoutProps {
  HeaderComponent?: React.ComponentType;
  FooterComponent?: React.ComponentType;
  drawerContent?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  HeaderComponent,
  FooterComponent,
  drawerContent,
  children,
}) => {
  const [open, setOpen] = React.useState(true);

  // const toggleDrawerClose = () => {
  //   setOpen(!open);
  // };
  const openDrawer = () => {
    setOpen(true);
  };
  const classes = useStyles();
  const classNameOpen = open ? classes.drawerOpen : classes.drawerClose;

  return (
    <div className={classes.container}>
      <AppBar position='fixed' elevation={0} className={classes.appBar}>
        {HeaderComponent ? <HeaderComponent /> : null}
      </AppBar>
      <Drawer
        variant='permanent'
        className={`${classes.drawer} ${classNameOpen}`}
        classes={{
          paper: classNameOpen,
        }}
      >
        <DrawerContextInstance.Provider value={{ open, openDrawer }}>
          <Toolbar />
          {/* <IconButton onClick={toggleDrawerClose}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Divider /> */}
          {drawerContent}
          <div className={classes.fakeFooter} />
        </DrawerContextInstance.Provider>
      </Drawer>
      <main className={classes.main}>
        <Toolbar />
        {children}
        <div className={classes.fakeFooter} />
      </main>
      <footer className={FooterComponent ? classes.footer : undefined}>
        {FooterComponent ? <FooterComponent /> : null}
      </footer>
    </div>
  );
};
