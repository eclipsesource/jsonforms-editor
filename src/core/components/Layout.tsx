/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core';
import React from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  container: {
    display: 'grid',
    height: '100vh',
    gridTemplateAreas: 'header content footer',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr auto',
  },
  footer: {
    padding: theme.spacing(2, 2),
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

export const Layout: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <header>
        <Header />
      </header>
      <main className={classes.main}>{children}</main>
      <footer className={classes.footer}>
        <Footer />
      </footer>
    </div>
  );
};
