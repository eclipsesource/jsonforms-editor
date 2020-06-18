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
import { Actions } from '../../core/model';
import { LinkedUISchemaElement } from '../../core/model/uischema';
import { findByUUID, isUUIDError } from '../../core/util/clone';
import { ExamplePropertiesService } from '../propertiesService';

const propertiesService = new ExamplePropertiesService();
export const Properties = () => {
  const [selection] = useSelection();
  const uiSchema = useUiSchema();
  const schema = useSchema();
  const dispatch = useDispatch();

  const uiElement: LinkedUISchemaElement = useMemo(() => {
    if (!selection || !uiSchema) return undefined;
    const findResult = findByUUID(uiSchema, selection.uuid);
    return isUUIDError(findResult) ? undefined : findResult;
  }, [selection, uiSchema]);

  const updateProperties = useCallback(
    ({ data: updatedProperties }) => {
      if (!uiElement) {
        return;
      }
      if (
        !isEqual(updatedProperties, uiElement.options) &&
        !(uiElement.options === undefined && isEmpty(updatedProperties))
      ) {
        dispatch(Actions.setUiSchemaOptions(uiElement, updatedProperties));
      }
    },
    [dispatch, uiElement]
  );
  if (!selection) return <NoSelection />;

  const linkedSchemaUUID = uiElement
    ? uiElement.linkedSchemaElements?.values().next().value
    : undefined;
  const searchResult = linkedSchemaUUID
    ? findByUUID(schema, linkedSchemaUUID)
    : undefined;
  const elementSchema = isUUIDError(searchResult) ? undefined : searchResult;
  const properties = propertiesService.getProperties(uiElement, elementSchema);

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
