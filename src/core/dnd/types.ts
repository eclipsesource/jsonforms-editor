/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { LinkedUISchemaElement } from '../model/uischema';

export const UI_SCHEMA_ELEMENT: 'uiSchemaElement' = 'uiSchemaElement';

export type DndType = DragUISchemaElement;

export interface DragUISchemaElement {
  type: 'uiSchemaElement';
  element: LinkedUISchemaElement;
  schema?: any;
}

const dragUISchemaElement = (
  uiSchemaElement: LinkedUISchemaElement,
  schema?: any
) => ({
  type: UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schema,
});

export const DndItems = {
  dragUISchemaElement,
};
