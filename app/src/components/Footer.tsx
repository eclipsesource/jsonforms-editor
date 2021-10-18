/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Container, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

const Copyright: React.FC = () => (
  <Typography variant='body2' color='textSecondary'>
    {'Copyright © '}
    <Link color='inherit' href='https://eclipsesource.com' target='_blank'>
      EclipseSource
    </Link>
    {' ' + new Date().getFullYear()}
  </Typography>
);

export const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Copyright />
    </Container>
  );
};
