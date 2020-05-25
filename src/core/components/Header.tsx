import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export const Header: React.FC = () => (
  <AppBar position='static' elevation={0}>
    <Toolbar>
      <Typography variant='h6' color='inherit' noWrap>
        JSON Forms Editor
      </Typography>
    </Toolbar>
  </AppBar>
);
