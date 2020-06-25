/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Typography } from '@material-ui/core';
import React from 'react';

import { Properties } from './Properties';

export const PropertiesPanel = () => {
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Properties
      </Typography>
      <Properties />
    </>
  );
};
