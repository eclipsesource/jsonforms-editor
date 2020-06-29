/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { SchemaElement } from './schema';
import { LinkedLayout, LinkedUISchemaElement } from './uischema';

export type SchemaAction = SetSchemaAction;
export type UiSchemaAction =
  | SetUiSchemaAction
  | AddUnscopedElementToLayout
  | SetUISchemaOptions;
export type CombinedAction =
  | SetSchemasAction
  | AddScopedElementToLayout
  | MoveUiSchemaElement
  | RemoveUiSchemaElement
  | AddDetail;

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
export const MOVE_UISCHEMA_ELEMENT: 'jsonforms-editor/MOVE_UISCHEMA_ELEMENT' =
  'jsonforms-editor/MOVE_UISCHEMA_ELEMENT';
export const REMOVE_UISCHEMA_ELEMENT: 'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT' =
  'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT';
export const SET_UISCHEMA_OPTIONS: 'jsonforms-editor/SET_UISCHEMA_OPTIONS' =
  'jsonforms-editor/SET_UISCHEMA_OPTIONS';
export const ADD_DETAIL: 'jsonforms-editor/ADD_DETAIL' =
  'jsonforms-editor/ADD_DETAIL';

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
  layout: LinkedLayout;
  schema: SchemaElement;
  index: number;
}

export interface AddUnscopedElementToLayout {
  type: 'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT';
  uiSchemaElement: LinkedUISchemaElement;
  layout: LinkedLayout;
  index: number;
}

export interface MoveUiSchemaElement {
  type: 'jsonforms-editor/MOVE_UISCHEMA_ELEMENT';
  uiSchemaElement: LinkedUISchemaElement;
  newContainer: LinkedUISchemaElement;
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

export interface AddDetail {
  type: 'jsonforms-editor/ADD_DETAIL';
  uiSchemaElementId: string;
  detail: LinkedUISchemaElement;
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
  layout: LinkedLayout,
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
  layout: LinkedLayout,
  index: number
) => ({
  type: ADD_UNSCOPED_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layout,
  index,
});

const moveUiSchemaElement = (
  uiSchemaElement: LinkedUISchemaElement,
  newContainer: LinkedUISchemaElement,
  index: number,
  schema?: SchemaElement
) => ({
  type: MOVE_UISCHEMA_ELEMENT,
  uiSchemaElement,
  newContainer,
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

const addDetail = (
  uiSchemaElementId: string,
  detail: LinkedUISchemaElement
) => ({
  type: ADD_DETAIL,
  uiSchemaElementId,
  detail,
});

export const Actions = {
  setSchema,
  setUiSchema,
  setSchemas,
  addScopedElementToLayout,
  addUnscopedElementToLayout,
  moveUiSchemaElement,
  removeUiSchemaElement,
  setUiSchemaOptions,
  addDetail,
};
