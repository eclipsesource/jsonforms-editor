/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Typography } from '@material-ui/core';
import React from 'react';

import { useSelection } from '../../core/context';

export const Properties = () => {
  const [selection] = useSelection();
  const onPropertiesChanged = (newProperties: any) => {
    if (selection) {
      selection.options = newProperties;
    }
  };

  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Properties
      </Typography>
      {selection ? (
        selection.options ? (
          <JsonForms
            data={selection.options}
            onChange={({ data }) => onPropertiesChanged(data)}
            renderers={materialRenderers}
            cells={materialCells}
          />
        ) : (
          <NoProperties />
        )
      ) : (
        <NoSelection />
      )}
    </>
  );
};
const NoSelection = () => <div>No selection</div>;
const NoProperties = () => (
  <div>Selected element does not have any configurable properties.</div>
);
