/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import 'react-reflex/styles.css';
import './index.css';

import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { defaultSchemaDecorators } from './properties/schemaDecorators';
import { propertySchemaProvider } from './properties/schemaProviders';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App
      schemaProviders={[propertySchemaProvider]}
      schemaDecorators={defaultSchemaDecorators}
    />
  </React.StrictMode>,
  document.getElementById('root')
);
