/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout, UISchemaElement } from '@jsonforms/core';

import { SchemaElement } from './schema';

export type SchemaAction = SetSchemaAction;
export type UiSchemaAction = SetUiSchemaAction | AddUISchemaElementToLayout;
export type CombinedAction = SetSchemasAction | AddSchemaElementToLayout;

export type EditorAction = SchemaAction | UiSchemaAction | CombinedAction;

export const SET_SCHEMA: 'jsonforms-editor/SET_SCHEMA' =
  'jsonforms-editor/SET_SCHEMA';
export const SET_UISCHEMA: 'jsonforms-editor/SET_UISCHEMA' =
  'jsonforms-editor/SET_UISCHEMA';
export const SET_SCHEMAS: 'jsonforms-editor/SET_SCHEMAS' =
  'jsonforms-editor/SET_SCHEMAS';
export const ADD_SCHEMA_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_SCHEMA_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_SCHEMA_ELEMENT_TO_LAYOUT';
export const ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT';
export interface SetSchemaAction {
  type: 'jsonforms-editor/SET_SCHEMA';
  schema: any;
}

export interface SetUiSchemaAction {
  type: 'jsonforms-editor/SET_UISCHEMA';
  uiSchema: any;
}

export interface SetSchemasAction {
  type: 'jsonforms-editor/SET_SCHEMAS';
  schema: any;
  uiSchema: any;
}

export interface AddSchemaElementToLayout {
  type: 'jsonforms-editor/ADD_SCHEMA_ELEMENT_TO_LAYOUT';
  schemaElement: SchemaElement;
  layout: Layout;
  index: number;
}
export interface AddUISchemaElementToLayout {
  type: 'jsonforms-editor/ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT';
  uiSchemaElement: UISchemaElement;
  layout: Layout;
  index: number;
}

const setSchema = (schema: any) => ({
  type: SET_SCHEMA,
  schema,
});

const setUiSchema = (uiSchema: any) => ({
  type: SET_UISCHEMA,
  uiSchema,
});

const setSchemas = (schema: any, uiSchema: any) => ({
  type: SET_SCHEMAS,
  schema,
  uiSchema,
});

const addSchemaElementToLayout = (
  schemaElement: SchemaElement,
  layout: Layout,
  index: number
) => ({
  type: ADD_SCHEMA_ELEMENT_TO_LAYOUT,
  schemaElement,
  layout,
  index,
});

const addUISchemaElementToLayout = (
  uiSchemaElement: UISchemaElement,
  layout: Layout,
  index: number
) => ({
  type: ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layout,
  index,
});

export const Actions = {
  setSchema,
  setUiSchema,
  setSchemas,
  addSchemaElementToLayout,
  addUISchemaElementToLayout,
};
