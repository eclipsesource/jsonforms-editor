/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { SchemaElement } from '../model';
import { LinkedUISchemaElement } from '../model/uischema';

export const NEW_UI_SCHEMA_ELEMENT: 'newUiSchemaElement' = 'newUiSchemaElement';
export const MOVE_UI_SCHEMA_ELEMENT: 'moveUiSchemaElement' =
  'moveUiSchemaElement';

export type DndType = NewUISchemaElement | MoveUISchemaElement;

export interface NewUISchemaElement {
  type: 'newUiSchemaElement';
  element: LinkedUISchemaElement;
  schema?: any;
}

const newUISchemaElement = (
  uiSchemaElement: LinkedUISchemaElement,
  schema?: any
) => ({
  type: NEW_UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schema,
});

export interface MoveUISchemaElement {
  type: 'moveUiSchemaElement';
  element: LinkedUISchemaElement;
}

const moveUISchemaElement = (
  uiSchemaElement: LinkedUISchemaElement,
  schema?: SchemaElement
) => ({
  type: MOVE_UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schema,
});

export const DndItems = { newUISchemaElement, moveUISchemaElement };
