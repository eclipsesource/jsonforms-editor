/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import React from 'react';

import { useUiSchema } from '../../core/context';
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

export interface EditorProps {
  editorRenderers: JsonFormsRendererRegistryEntry[];
}
export const Editor: React.FC<EditorProps> = ({ editorRenderers }) => {
  const schema = useExportSchema();
  const uiSchema = useUiSchema();
  return uiSchema ? (
    <Grid container>
      <ThemeProvider theme={theme}>
        <JsonForms
          data={{}}
          schema={schema}
          uischema={uiSchema}
          renderers={editorRenderers}
          cells={materialCells}
        />
      </ThemeProvider>
    </Grid>
  ) : (
    <EmptyEditor />
  );
};
