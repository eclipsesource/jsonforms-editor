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
import { EditorUISchemaElement } from '../../model/uischema';
export const createControl = (
  schemaElement: SchemaElement
): ControlElement & EditorUISchemaElement => {
  return {
    type: 'Control',
    scope: `#${getScope(schemaElement)}`,
    uuid: uuid(),
  } as ControlElement & EditorUISchemaElement;
};

export const createLayout = (type: string): Layout & EditorUISchemaElement => {
  return {
    type: type,
    elements: [],
    uuid: uuid(),
  } as Layout & EditorUISchemaElement;
};
