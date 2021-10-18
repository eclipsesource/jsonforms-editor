/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Container, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

export const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Typography variant='body2' color='textSecondary'>
        {`Copyright © ${new Date().getFullYear()}`}
      </Typography>
    </Container>
  );
};
