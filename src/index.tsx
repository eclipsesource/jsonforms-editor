import 'react-reflex/styles.css';
import './index.css';

import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
