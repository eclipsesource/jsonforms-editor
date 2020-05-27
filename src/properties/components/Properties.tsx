/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Typography } from '@material-ui/core';
import React from 'react';

import { FormattedJson } from '../../core/components';
import { useSelection } from '../../core/context';
import { toPrintableObject } from '../../core/model';

export const Properties = () => {
  const [selection] = useSelection();
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Properties
      </Typography>
      {selection ? (
        <FormattedJson object={toPrintableObject(selection)} />
      ) : (
        <NoSelection />
      )}
    </>
  );
};
const NoSelection = () => <div>No selection</div>;
