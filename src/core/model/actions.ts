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
export type UiSchemaAction =
  | SetUiSchemaAction
  | AddUnscopedElementToLayout
  | SetUISchemaOptions;
export type CombinedAction =
  | SetSchemasAction
  | AddScopedElementToLayout
  | MoveUiSchemaElement
  | RemoveUiSchemaElement;

export type EditorAction = SchemaAction | UiSchemaAction | CombinedAction;

export const SET_SCHEMA: 'jsonforms-editor/SET_SCHEMA' =
  'jsonforms-editor/SET_SCHEMA';
export const SET_UISCHEMA: 'jsonforms-editor/SET_UISCHEMA' =
  'jsonforms-editor/SET_UISCHEMA';
export const SET_SCHEMAS: 'jsonforms-editor/SET_SCHEMAS' =
  'jsonforms-editor/SET_SCHEMAS';
/** UI schema actions */
export const ADD_SCOPED_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_SCOPED_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_SCOPED_ELEMENT_TO_LAYOUT';
export const ADD_UNSCOPED_ELEMENT_TO_LAYOUT: 'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT' =
  'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT';
export const MOVE_UISCHEMA_ELEMENT: 'jsonforms-editor/MOVE_UISCHEMA_ELEMENT' =
  'jsonforms-editor/MOVE_UISCHEMA_ELEMENT';
export const REMOVE_UISCHEMA_ELEMENT: 'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT' =
  'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT';
export const SET_UISCHEMA_OPTIONS: 'jsonforms-editor/SET_UISCHEMA_OPTIONS' =
  'jsonforms-editor/SET_UISCHEMA_OPTIONS';

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
export interface MoveUiSchemaElement {
  type: 'jsonforms-editor/MOVE_UISCHEMA_ELEMENT';
  uiSchemaElement: LinkedUISchemaElement;
  layout: Layout;
  index: number;
  schema?: SchemaElement;
}

export interface RemoveUiSchemaElement {
  type: 'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT';
  uiSchemaElement: LinkedUISchemaElement;
}

export interface SetUISchemaOptions {
  type: 'jsonforms-editor/SET_UISCHEMA_OPTIONS';
  uiSchema: LinkedUISchemaElement;
  options: { [key: string]: any };
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

const moveUiSchemaElement = (
  uiSchemaElement: LinkedUISchemaElement,
  layout: Layout,
  index: number,
  schema?: SchemaElement
) => ({
  type: MOVE_UISCHEMA_ELEMENT,
  uiSchemaElement,
  layout,
  index,
  schema,
});

const removeUiSchemaElement = (uiSchemaElement: LinkedUISchemaElement) => ({
  type: REMOVE_UISCHEMA_ELEMENT,
  uiSchemaElement,
});

const setUiSchemaOptions = (
  uiSchema: LinkedUISchemaElement,
  options: { [key: string]: any }
) => ({ type: SET_UISCHEMA_OPTIONS, uiSchema, options });

export const Actions = {
  setSchema,
  setUiSchema,
  setSchemas,
  addScopedElementToLayout,
  addUnscopedElementToLayout,
  moveUiSchemaElement,
  removeUiSchemaElement,
  setUiSchemaOptions,
};
