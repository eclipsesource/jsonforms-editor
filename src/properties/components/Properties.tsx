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
import React, { useCallback, useMemo } from 'react';

import {
  useDispatch,
  useSchema,
  useSelection,
  useUiSchema,
} from '../../core/context';
import { Actions, SchemaElement } from '../../core/model';
import { LinkedUISchemaElement } from '../../core/model/uischema';
import { tryFindByUUID } from '../../core/util/clone';
import { ExamplePropertiesService } from '../propertiesService';

const propertiesService = new ExamplePropertiesService();
const getProperties = (
  uiElement: LinkedUISchemaElement | undefined,
  schema: SchemaElement | undefined
) => {
  if (!uiElement || !schema) {
    return undefined;
  }
  const linkedSchemaUUID = uiElement.linkedSchemaElement;
  if (!linkedSchemaUUID) {
    return undefined;
  }
  const elementSchema = tryFindByUUID(schema, linkedSchemaUUID);
  return propertiesService.getProperties(uiElement, elementSchema);
};

export const Properties = () => {
  const [selection] = useSelection();
  const uiSchema = useUiSchema();
  const schema = useSchema();
  const dispatch = useDispatch();

  const uiElement: LinkedUISchemaElement = useMemo(
    () => tryFindByUUID(uiSchema, selection?.uuid),
    [selection, uiSchema]
  );
  const canSetUISchemaOptions = (
    uiElement: LinkedUISchemaElement | undefined,
    updatedProperties: any
  ): boolean =>
    !!uiElement &&
    !isEqual(updatedProperties, uiElement.options) &&
    !(uiElement.options === undefined && isEmpty(updatedProperties));

  const updateProperties = useCallback(
    ({ data: updatedProperties }) => {
      if (canSetUISchemaOptions(uiElement, updatedProperties)) {
        dispatch(Actions.setUiSchemaOptions(uiElement, updatedProperties));
      }
    },
    [dispatch, uiElement]
  );
  if (!selection) return <NoSelection />;

  const properties = getProperties(uiElement, schema);
  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Properties
      </Typography>
      {properties ? (
        <JsonForms
          data={uiElement.options}
          schema={properties.schema}
          uischema={properties.uiSchema}
          onChange={updateProperties}
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
