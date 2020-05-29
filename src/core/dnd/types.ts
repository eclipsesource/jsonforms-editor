/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { UISchemaElement } from '@jsonforms/core';

import { SchemaElement } from '../model';

export const SCHEMA_ELEMENT: 'schemaElement' = 'schemaElement';
export const UI_SCHEMA_ELEMENT: 'uiSchemaElement' = 'uiSchemaElement';

export type DndType = DragSchemaElement | DragUISchemaElement;

export interface DragSchemaElement {
  type: 'schemaElement';
  element: SchemaElement;
}

const dragSchemaElement = (schemaElement: SchemaElement) => ({
  type: SCHEMA_ELEMENT,
  schemaElement,
});

export interface DragUISchemaElement {
  type: 'uiSchemaElement';
  element: UISchemaElement;
}

const dragUISchemaElement = (uiSchemaElement: UISchemaElement) => ({
  type: UI_SCHEMA_ELEMENT,
  uiSchemaElement,
});

export const DndItems = {
  dragSchemaElement,
  dragUISchemaElement,
};
