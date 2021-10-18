/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { EditorUISchemaElement } from './uischema';

export type UiSchemaAction = AddUnscopedElementToLayout | UpdateUiSchemaElement;

export type CombinedAction =
  | SetUiSchemaAction
  | SetSchemaAction
  | SetSchemasAction
  | AddScopedElementToLayout
  | MoveUiSchemaElement
  | RemoveUiSchemaElement
  | AddDetail;

export type EditorAction = UiSchemaAction | CombinedAction;

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
export const UPDATE_UISCHEMA_ELEMENT: 'jsonforms-editor/UPDATE_UISCHEMA_ELEMENT' =
  'jsonforms-editor/UPDATE_UISCHEMA_ELEMENT';
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
  uiSchemaElement: EditorUISchemaElement;
  layoutUUID: string;
  schemaUUID: string;
  index: number;
}

export interface AddUnscopedElementToLayout {
  type: 'jsonforms-editor/ADD_UNSCOPED_ELEMENT_TO_LAYOUT';
  uiSchemaElement: EditorUISchemaElement;
  layoutUUID: string;
  index: number;
}

export interface MoveUiSchemaElement {
  type: 'jsonforms-editor/MOVE_UISCHEMA_ELEMENT';
  elementUUID: string;
  newContainerUUID: string;
  index: number;
  schemaUUID?: string;
}

export interface RemoveUiSchemaElement {
  type: 'jsonforms-editor/REMOVE_UISCHEMA_ELEMENT';
  elementUUID: string;
}

export interface UpdateUiSchemaElement {
  type: 'jsonforms-editor/UPDATE_UISCHEMA_ELEMENT';
  elementUUID: string;
  changedProperties: { [key: string]: any };
}

export interface AddDetail {
  type: 'jsonforms-editor/ADD_DETAIL';
  uiSchemaElementId: string;
  detail: EditorUISchemaElement;
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
  uiSchemaElement: EditorUISchemaElement,
  layoutUUID: string,
  index: number,
  schemaUUID: string
) => ({
  type: ADD_SCOPED_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layoutUUID,
  index,
  schemaUUID,
});

const addUnscopedElementToLayout = (
  uiSchemaElement: EditorUISchemaElement,
  layoutUUID: string,
  index: number
) => ({
  type: ADD_UNSCOPED_ELEMENT_TO_LAYOUT,
  uiSchemaElement,
  layoutUUID,
  index,
});

const moveUiSchemaElement = (
  elementUUID: string,
  newContainerUUID: string,
  index: number,
  schemaUUID?: string
) => ({
  type: MOVE_UISCHEMA_ELEMENT,
  elementUUID,
  newContainerUUID,
  index,
  schemaUUID,
});

const removeUiSchemaElement = (elementUUID: string) => ({
  type: REMOVE_UISCHEMA_ELEMENT,
  elementUUID,
});

const updateUISchemaElement = (
  elementUUID: string,
  changedProperties: { [key: string]: any }
) => ({ type: UPDATE_UISCHEMA_ELEMENT, elementUUID, changedProperties });

const addDetail = (
  uiSchemaElementId: string,
  detail: EditorUISchemaElement
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
  updateUISchemaElement,
  addDetail,
};
