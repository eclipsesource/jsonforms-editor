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
import { isEmpty, isEqual } from 'lodash';
import React from 'react';

import { useDispatch, useSelection } from '../../core/context';
import { Actions } from '../../core/model';
import { ExamplePropertiesService } from '../propertiesService';

const propertiesService = new ExamplePropertiesService();
export const Properties = () => {
  const [selection] = useSelection();
  const dispatch = useDispatch();

  if (!selection) return <NoSelection />;

  const onPropertiesChanged = (newProperties: any) => {
    if (
      !isEqual(newProperties, selection.uiSchema.options) &&
      !(selection.uiSchema.options === undefined && isEmpty(newProperties))
    ) {
      dispatch(Actions.setUiSchemaOptions(selection.uiSchema, newProperties));
    }
  };

  const properties = propertiesService.getProperties(
    selection.uiSchema,
    selection.schema
  );
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Properties
      </Typography>
      {properties ? (
        <JsonForms
          data={selection.uiSchema.options}
          schema={properties.schema}
          uischema={properties.uiSchema}
          onChange={({ data }) => onPropertiesChanged(data)}
          renderers={materialRenderers}
          cells={materialCells}
        />
      ) : (
        <NoProperties />
      )}
    </>
  );
};
const NoSelection = () => <div>No selection</div>;
const NoProperties = () => (
  <div>Selected element does not have any configurable properties.</div>
);
