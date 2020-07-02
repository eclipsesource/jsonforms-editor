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
import { isEqual } from 'lodash';
import React, { useCallback, useMemo } from 'react';

import {
  useDispatch,
  useSchema,
  useSelection,
  useUiSchema,
} from '../../core/context';
import { Actions, SchemaElement } from '../../core/model';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { cloneTree, tryFindByUUID } from '../../core/util/clone';
import { ExamplePropertiesService } from '../propertiesService';

const propertiesService = new ExamplePropertiesService();

const getProperties = (
  uiElement: EditorUISchemaElement | undefined,
  schema: SchemaElement | undefined
) => {
  if (!uiElement) {
    return undefined;
  }
  const linkedSchemaUUID = uiElement.linkedSchemaElement;
  const elementSchema =
    linkedSchemaUUID && schema
      ? tryFindByUUID(schema, linkedSchemaUUID)
      : undefined;
  return propertiesService.getProperties(uiElement, elementSchema);
};

const canUpdateUiSchemaElement = (
  uiElement: EditorUISchemaElement | undefined,
  updatedProperties: any
): boolean => {
  return !isEqual(uiElement, updatedProperties);
};

export const Properties = () => {
  const [selection] = useSelection();
  const uiSchema = useUiSchema();
  const schema = useSchema();
  const dispatch = useDispatch();

  const uiElement: EditorUISchemaElement = useMemo(
    () => tryFindByUUID(uiSchema, selection?.uuid),
    [selection, uiSchema]
  );

  const updateProperties = useCallback(
    ({ data: updatedProperties }) => {
      if (canUpdateUiSchemaElement(uiElement, updatedProperties)) {
        dispatch(Actions.setUiSchemaOptions(uiElement, updatedProperties));
      }
    },
    [dispatch, uiElement]
  );

  if (!selection) return <NoSelection />;

  const properties = getProperties(uiElement, schema);
  const data = cloneTree(uiElement);
  return properties ? (
    <JsonForms
      data={data}
      schema={properties.schema}
      uischema={properties.uiSchema}
      onChange={updateProperties}
      renderers={materialRenderers}
      cells={materialCells}
    />
  ) : (
    <NoProperties />
  );
};
const NoSelection = () => <div>No selection</div>;
const NoProperties = () => (
  <div>Selected element does not have any configurable properties.</div>
);
