/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';

import { cloneTree, getRoot, isPathError } from '../util/clone';
import {
  ADD_SCHEMA_ELEMENT_TO_LAYOUT,
  ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT,
  CombinedAction,
  EditorAction,
  SchemaAction,
  SET_SCHEMA,
  SET_SCHEMAS,
  SET_UISCHEMA,
  UiSchemaAction,
} from './actions';
import { buildSchemaTree, getPath, SchemaElement } from './schema';
import { buildLinkedUiSchemaTree, LinkedUISchemaElement } from './uischema';

export interface EditorState {
  schema?: SchemaElement;
  uiSchema?: LinkedUISchemaElement;
}

export const schemaReducer = (
  schema: SchemaElement | undefined,
  action: SchemaAction
) => {
  switch (action.type) {
    case SET_SCHEMA:
      return buildSchemaTree(action.schema);
  }
  // fallback - do nothing
  return schema;
};

export const uiSchemaReducer = (
  uiSchema: LinkedUISchemaElement | undefined,
  action: UiSchemaAction
) => {
  switch (action.type) {
    case SET_UISCHEMA:
      return buildLinkedUiSchemaTree(action.uiSchema);
    case ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT:
      const newUiSchema = cloneTree(action.layout as LinkedUISchemaElement);
      if (isPathError(newUiSchema)) {
        console.error(
          'An error occured when cloning the ui schema',
          newUiSchema
        );
        // Do nothing
        return action.layout;
      }
      const newUIElement = action.uiSchemaElement;
      (newUIElement as LinkedUISchemaElement).parent = newUiSchema;
      (newUiSchema as Layout).elements.splice(action.index, 0, newUIElement);

      return getRoot(newUiSchema);
  }
  // fallback - do nothing
  return uiSchema;
};

export const combinedReducer = (state: EditorState, action: CombinedAction) => {
  switch (action.type) {
    case SET_SCHEMAS:
      return {
        schema: buildSchemaTree(action.schema),
        uiSchema: buildLinkedUiSchemaTree(action.uiSchema),
      };
    case ADD_SCHEMA_ELEMENT_TO_LAYOUT:
      const newUiSchema = cloneTree(action.layout as LinkedUISchemaElement);
      const newSchema = cloneTree(action.schemaElement);
      if (isPathError(newUiSchema)) {
        console.error(
          'An error occured when cloning the ui schema',
          newUiSchema
        );
        // Do nothing
        return state;
      }
      if (isPathError(newSchema)) {
        console.error('An error occured when cloning the schema', newSchema);
        // Do nothing
        return state;
      }
      const newControl: LinkedUISchemaElement = createControl(
        `#${getPath(action.schemaElement)}`
      );
      (newUiSchema as Layout).elements.splice(action.index, 0, newControl);
      if (!newSchema.linkedUiSchemaElements) {
        newSchema.linkedUiSchemaElements = [];
      }
      newSchema.linkedUiSchemaElements.push(newControl);
      if (!newUiSchema.linkedSchemaElements) {
        newUiSchema.linkedSchemaElements = [];
      }
      newUiSchema.linkedSchemaElements.push(newSchema);
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
  }
  // fallback - do nothing
  return state;
};

const createControl = (scope: string): ControlElement => {
  return {
    type: 'Control',
    scope: scope,
  };
};

export const editorReducer = (
  { schema, uiSchema }: EditorState,
  action: EditorAction
) => {
  switch (action.type) {
    case SET_SCHEMA:
      return { schema: schemaReducer(schema, action), uiSchema };
    case ADD_UI_SCHEMA_ELEMENT_TO_LAYOUT:
    case SET_UISCHEMA:
      return { schema: schema, uiSchema: uiSchemaReducer(uiSchema, action) };
    case SET_SCHEMAS:
    case ADD_SCHEMA_ELEMENT_TO_LAYOUT:
      return combinedReducer({ schema, uiSchema }, action);
  }
  // fallback - do nothing
  return { schema, uiSchema };
};
