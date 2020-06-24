/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';
import { v4 as uuid } from 'uuid';

import { getScope, SchemaElement } from '../../model';
import { LinkedUISchemaElement } from '../../model/uischema';
export const createControl = (
  schemaElement: SchemaElement
): ControlElement & LinkedUISchemaElement => {
  return {
    type: 'Control',
    scope: `#${getScope(schemaElement)}`,
    uuid: uuid(),
  } as ControlElement & LinkedUISchemaElement;
};

export const createLayout = (type: string): Layout & LinkedUISchemaElement => {
  return {
    type: type,
    elements: [],
    uuid: uuid(),
  } as Layout & LinkedUISchemaElement;
};
