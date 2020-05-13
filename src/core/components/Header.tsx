import AppBar from '@material-ui/core/AppBar';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export const Header: React.FC = () => (
  <AppBar position='static' elevation={0}>
    <Toolbar>
      <Typography variant='h6' color='inherit' noWrap>
        JSON Forms Editor
      </Typography>
    </Toolbar>
  </AppBar>
);
