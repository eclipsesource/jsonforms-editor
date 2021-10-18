/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minHeight: 0,
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

interface LayoutProps {
  HeaderComponent?: React.ComponentType;
  FooterComponent?: React.ComponentType;
}

export const Layout: React.FC<LayoutProps> = ({
  HeaderComponent,
  FooterComponent,
  children,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <header>{HeaderComponent ? <HeaderComponent /> : null}</header>
      <main className={classes.main}>{children}</main>
      <footer className={FooterComponent ? classes.footer : undefined}>
        {FooterComponent ? <FooterComponent /> : null}
      </footer>
    </div>
  );
};
