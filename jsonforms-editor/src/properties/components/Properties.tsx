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
import { isEqual, omit } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useDispatch,
  usePropertiesService,
  useSchema,
  useSelection,
  useUiSchema,
} from '../../core/context';
import { Actions } from '../../core/model';
import { EditorUISchemaElement } from '../../core/model/uischema';
import { tryFindByUUID } from '../../core/util/schemasUtil';
import { PropertySchemas } from '../propertiesService';

export interface PropertiesProps {
  propertyRenderers: JsonFormsRendererRegistryEntry[];
}
export const Properties: React.FC<PropertiesProps> = ({
  propertyRenderers,
}) => {
  const [selection] = useSelection();
  const uiSchema = useUiSchema();
  const schema = useSchema();
  const dispatch = useDispatch();

  const uiElement: EditorUISchemaElement | undefined = useMemo(
    () => tryFindByUUID(uiSchema, selection?.uuid),
    [selection, uiSchema]
  );

  const data = useMemo(
    () =>
      omit(uiElement, [
        'uuid',
        'parent',
        'elements',
        'linkedSchemaElement',
        'options.detail',
      ]),
    [uiElement]
  );

  const updateProperties = useCallback(
    ({ data: updatedProperties }) => {
      if (uiElement && !isEqual(data, updatedProperties)) {
        dispatch(
          Actions.updateUISchemaElement(uiElement.uuid, updatedProperties)
        );
      }
    },
    [data, dispatch, uiElement]
  );
  const propertiesService = usePropertiesService();
  const [properties, setProperties] = useState<PropertySchemas>();
  useEffect(() => {
    if (!uiElement) {
      return;
    }
    const linkedSchemaUUID = uiElement.linkedSchemaElement;
    const elementSchema =
      linkedSchemaUUID && schema
        ? tryFindByUUID(schema, linkedSchemaUUID)
        : undefined;
    setProperties(propertiesService.getProperties(uiElement, elementSchema));
  }, [propertiesService, schema, uiElement]);

  if (!selection) return <NoSelection />;

  return properties ? (
    <JsonForms
      data={data}
      schema={properties.schema}
      uischema={properties.uiSchema}
      onChange={updateProperties}
      renderers={propertyRenderers}
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
