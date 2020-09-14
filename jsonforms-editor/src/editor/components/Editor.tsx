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
import { createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import React from 'react';

import { useUiSchema } from '../../core/context';
import { DroppableArrayControlRegistration } from '../../core/renderers/DroppableArrayControl';
import { DroppableElementRegistration } from '../../core/renderers/DroppableElement';
import { DroppableGroupLayoutRegistration } from '../../core/renderers/DroppableGroupLayout';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../../core/renderers/DroppableLayout';
import { useExportSchema } from '../../core/util/hooks';
import { EmptyEditor } from './EmptyEditor';

const theme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        overflow: 'hidden',
      },
    },
  },
});

const renderers = [
  ...materialRenderers,
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
  DroppableElementRegistration,
  DroppableGroupLayoutRegistration,
  DroppableArrayControlRegistration,
];

export const Editor: React.FC = () => {
  const schema = useExportSchema();
  const uiSchema = useUiSchema();
  return uiSchema ? (
    <Grid container>
      <ThemeProvider theme={theme}>
        <JsonForms
          data={{}}
          schema={schema}
          uischema={uiSchema}
          renderers={renderers}
          cells={materialCells}
        />
      </ThemeProvider>
    </Grid>
  ) : (
    <EmptyEditor />
  );
};
