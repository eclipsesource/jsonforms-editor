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
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';

import { useUiSchema } from '../../core/context';
import { DroppableArrayControlRegistration } from '../../core/renderers/DroppableArrayControl';
import { DroppableControlRegistration } from '../../core/renderers/DroppableControl';
import {
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
} from '../../core/renderers/DroppableLayout';
import { useExportSchema } from '../../core/util/hooks';
import { EmptyEditor } from './EmptyEditor';

const renderers = [
  ...materialRenderers,
  DroppableHorizontalLayoutRegistration,
  DroppableVerticalLayoutRegistration,
  DroppableControlRegistration,
  DroppableArrayControlRegistration,
];

const useStyles = makeStyles(() => ({
  jsonformsGridContainer: {
    height: '100%',
    overflow: 'auto',
  },
}));

export const Editor: React.FC = () => {
  const schema = useExportSchema();
  const uiSchema = useUiSchema();
  const classes = useStyles();
  return uiSchema ? (
    <Grid container className={classes.jsonformsGridContainer}>
      <JsonForms
        data={{}}
        schema={schema}
        uischema={uiSchema}
        renderers={renderers}
        cells={materialCells}
      />
    </Grid>
  ) : (
    <EmptyEditor />
  );
};
