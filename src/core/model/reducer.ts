/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout } from '@jsonforms/core';

import { getRoot, withCloneTree } from '../util/clone';
import {
  ADD_SCOPED_ELEMENT_TO_LAYOUT,
  ADD_UNSCOPED_ELEMENT_TO_LAYOUT,
  CombinedAction,
  EditorAction,
  SchemaAction,
  SET_SCHEMA,
  SET_SCHEMAS,
  SET_UISCHEMA,
  UiSchemaAction,
} from './actions';
import { buildSchemaTree, SchemaElement } from './schema';
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
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
      return withCloneTree(action.layout, uiSchema, (newUiSchema) => {
        const newUIElement = action.uiSchemaElement;
        (newUIElement as LinkedUISchemaElement).parent = newUiSchema;
        newUiSchema.elements.splice(action.index, 0, newUIElement);
        return getRoot(newUiSchema as LinkedUISchemaElement);
      });
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
    case ADD_SCOPED_ELEMENT_TO_LAYOUT:
      return withCloneTree(
        action.layout as LinkedUISchemaElement,
        state,
        (newUiSchema) => {
          const newUIElement = action.uiSchemaElement;
          (newUiSchema as Layout).elements.splice(
            action.index,
            0,
            newUIElement
          );
          return withCloneTree(action.schema, state, (newSchema) => {
            if (!newSchema.linkedUiSchemaElements) {
              newSchema.linkedUiSchemaElements = [];
            }
            newSchema.linkedUiSchemaElements.push(newUIElement);
            if (!newUiSchema.linkedSchemaElements) {
              newUiSchema.linkedSchemaElements = [];
            }
            newUiSchema.linkedSchemaElements.push(newSchema);
            return {
              schema: getRoot(newSchema),
              uiSchema: getRoot(newUiSchema),
            };
          });
        }
      );
  }
  // fallback - do nothing
  return state;
};

export const editorReducer = (
  { schema, uiSchema }: EditorState,
  action: EditorAction
) => {
  switch (action.type) {
    case SET_SCHEMA:
      return { schema: schemaReducer(schema, action), uiSchema };
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
    case SET_UISCHEMA:
      return { schema: schema, uiSchema: uiSchemaReducer(uiSchema, action) };
    case SET_SCHEMAS:
    case ADD_SCOPED_ELEMENT_TO_LAYOUT:
      return combinedReducer({ schema, uiSchema }, action);
  }
  // fallback - do nothing
  return { schema, uiSchema };
};
