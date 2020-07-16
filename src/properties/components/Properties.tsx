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
import { isEqual, omit } from 'lodash';
import React, { useCallback, useMemo } from 'react';

import {
  useDispatch,
  usePropertiesService,
  useSchema,
  useSelection,
  useUiSchema,
} from '../../core/context';
import { Actions, SchemaElement } from '../../core/model';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { tryFindByUUID } from '../../core/util/clone';
import { RuleEditorRendererRegistration } from '../renderers/RuleEditorRenderer';

const renderers = [...materialRenderers, RuleEditorRendererRegistration];
export const Properties = () => {
  const [selection] = useSelection();
  const uiSchema = useUiSchema();
  const schema = useSchema();
  const dispatch = useDispatch();

  const uiElement: EditorUISchemaElement = useMemo(
    () => tryFindByUUID(uiSchema, selection?.uuid),
    [selection, uiSchema]
  );

  const data = useMemo(
    () =>
      omit(uiElement, [
        'uuid',
        'parent',
        'elements',
        'linkedSchemaUUID',
        'options.detail',
      ]),
    [uiElement]
  );

  const updateProperties = useCallback(
    ({ data: updatedProperties }) => {
      if (!isEqual(data, updatedProperties)) {
        dispatch(Actions.updateUISchemaElement(uiElement, updatedProperties));
      }
    },
    [data, dispatch, uiElement]
  );
  const propertiesService = usePropertiesService();

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

  if (!selection) return <NoSelection />;

  const properties = getProperties(uiElement, schema);

  return properties ? (
    <JsonForms
      data={data}
      schema={properties.schema}
      uischema={properties.uiSchema}
      onChange={updateProperties}
      renderers={renderers}
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
