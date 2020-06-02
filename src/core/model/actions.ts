/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout } from '@jsonforms/core';

import { SchemaElement } from './schema';
import { LinkedUISchemaElement } from './uischema';

export type SchemaAction = SetSchemaAction;
export type UiSchemaAction = SetUiSchemaAction | AddUnscopedElementToLayout;
export type CombinedAction = SetSchemasAction | AddScopedElementToLayout;

export type EditorAction = SchemaAction | UiSchemaAction | CombinedAction;

export const SET_SCHEMA: 'jsonforms-editor/SET_SCHEMA' =
  'jsonforms-editor/SET_SCHEMA';
export const SET_UISCHEMA: 'jsonforms-editor/SET_UISCHEMA' =
  'jsonforms-editor/SET_UISCHEMA';
export const SET_SCHEMAS: 'jsonforms-editor/SET_SCHEMAS' =
  'jsonforms-editor/SET_SCHEMAS';
export const ADD_SCOPED_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_SCOPED_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_SCOPED_ELEMENT_TO_LAYOUT';
export const ADD_UNSCOPED_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT';
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

export interface AddScopedElementToLayout {
  type: 'jsonforms-editor/ADD_SCOPED_ELEMENT_TO_LAYOUT';
  uiSchemaElement: LinkedUISchemaElement;
  layout: Layout;
  schema: SchemaElement;
  index: number;
}
export interface AddUnscopedElementToLayout {
  type: 'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT';
  uiSchemaElement: LinkedUISchemaElement;
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

const addScopedElementToLayout = (
  uiSchemaElement: LinkedUISchemaElement,
  layout: Layout,
  index: number,
  schema: any
) => ({
  type: ADD_SCOPED_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layout,
  index,
  schema,
});

const addUnscopedElementToLayout = (
  uiSchemaElement: LinkedUISchemaElement,
  layout: Layout,
  index: number
) => ({
  type: ADD_UNSCOPED_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layout,
  index,
});

export const Actions = {
  setSchema,
  setUiSchema,
  setSchemas,
  addScopedElementToLayout,
  addUnscopedElementToLayout,
};
