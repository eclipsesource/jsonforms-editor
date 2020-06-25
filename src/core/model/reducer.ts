/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout } from '@jsonforms/core';

import {
  findByUUID,
  getRoot,
  isPathError,
  isUUIDError,
  linkElements,
  UUIDError,
  withCloneTree,
  withCloneTrees,
} from '../util/clone';
import {
  ADD_SCOPED_ELEMENT_TO_LAYOUT,
  ADD_UNSCOPED_ELEMENT_TO_LAYOUT,
  CombinedAction,
  EditorAction,
  MOVE_UISCHEMA_ELEMENT,
  REMOVE_UISCHEMA_ELEMENT,
  SchemaAction,
  SET_SCHEMA,
  SET_SCHEMAS,
  SET_UISCHEMA,
  SET_UISCHEMA_OPTIONS,
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
      // FIXME we need to link the uischema to the schema
      return buildLinkedUiSchemaTree(action.uiSchema);
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
      return withCloneTree(action.layout, uiSchema, (newUiSchema) => {
        const newUIElement = action.uiSchemaElement;
        newUIElement.parent = newUiSchema;
        newUiSchema.elements.splice(action.index, 0, newUIElement);
        return getRoot(newUiSchema as LinkedUISchemaElement);
      });
    case SET_UISCHEMA_OPTIONS:
      return withCloneTree(action.uiSchema, uiSchema, (newUiSchema) => {
        newUiSchema.options = action.options;
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
      return withCloneTrees(
        action.layout as LinkedUISchemaElement,
        action.schema,
        state,
        (newUiSchema, newSchema) => {
          const newUIElement = action.uiSchemaElement;
          newUIElement.parent = newUiSchema;
          (newUiSchema as Layout).elements.splice(
            action.index,
            0,
            newUIElement
          );

          if (!linkElements(newUIElement, newSchema)) {
            console.error('Could not add new UI element', newUIElement);
            return state;
          }

          return {
            schema: getRoot(newSchema),
            uiSchema: getRoot(newUiSchema),
          };
        }
      );
    case MOVE_UISCHEMA_ELEMENT:
      return withCloneTrees(
        action.layout as LinkedUISchemaElement,
        action.schema,
        state,
        (newUiSchema, newSchema) => {
          if (!action.uiSchemaElement.uuid) {
            console.error('Found element without UUID', action.uiSchemaElement);
            return state;
          }
          const elementToMove = findByUUID(
            newUiSchema,
            action.uiSchemaElement.uuid
          );
          if (isUUIDError(elementToMove) || !elementToMove.uuid) {
            console.error(
              'Could not find corresponding element ',
              elementToMove
            );
            return state;
          }

          const removeResult = removeUiElement(elementToMove, newSchema);
          if (isPathError(removeResult)) {
            console.error('Could not remove ui element ', removeResult);
            return state;
          }

          // add element to new parent
          elementToMove.parent = newUiSchema;
          (newUiSchema as Layout).elements.splice(
            action.index,
            0,
            elementToMove
          );

          // add linkedUiSchemaElements in the schema (for scoped ui elements) if such links existed before
          if (action.uiSchemaElement.linkedSchemaElement) {
            // newSchema can't be undefined when the old ui element had links to it
            (newSchema!.linkedUiSchemaElements =
              newSchema!.linkedUiSchemaElements || new Set()).add(
              elementToMove.uuid
            );
          }

          // schema is optional in this action
          const schemaToReturn =
            action.schema !== undefined ? getRoot(newSchema) : state.schema;

          return {
            schema: schemaToReturn,
            uiSchema: getRoot(newUiSchema),
          };
        }
      );
    case REMOVE_UISCHEMA_ELEMENT:
      return withCloneTrees(
        action.uiSchemaElement as LinkedUISchemaElement,
        state.schema,
        state,
        (elementToRemove, newSchema) => {
          const removeResult = removeUiElement(elementToRemove, newSchema);
          if (isPathError(removeResult)) {
            console.error('Could not remove ui element ', removeResult);
            return state;
          }
          // check whether the element to remove was the root element
          const uiSchemaToReturn = action.uiSchemaElement.parent
            ? getRoot(elementToRemove)
            : undefined;
          return {
            schema: newSchema,
            uiSchema: uiSchemaToReturn,
          };
        }
      );
  }
  // fallback - do nothing
  return state;
};

/** Removes the given UI element from its tree.
 *  If a SchemaElement is provided, the element to remove will be cleaned up from all linkedUiSchemaElements fields in the schema.
 */
const removeUiElement = (
  elementToRemove: LinkedUISchemaElement,
  schema?: SchemaElement
): true | UUIDError => {
  // remove links to UI element in the schema (if any)
  if (schema && elementToRemove.linkedSchemaElement) {
    const uuidToRemove = elementToRemove.uuid;
    if (!uuidToRemove) {
      return { id: 'noUUIDError', element: elementToRemove };
    }
    const schemaRoot = getRoot(schema);
    const linkedSchemaElement: SchemaElement = findByUUID(
      schemaRoot,
      elementToRemove.linkedSchemaElement
    );
    if (isUUIDError(linkedSchemaElement)) {
      return linkedSchemaElement;
    }
    linkedSchemaElement.linkedUiSchemaElements?.delete(uuidToRemove);
  }

  // remove from parent (if it exists)
  // TODO only works for layouts
  if (elementToRemove.parent && (elementToRemove.parent as Layout).elements) {
    const index = (elementToRemove.parent as Layout).elements.indexOf(
      elementToRemove
    );
    (elementToRemove.parent as Layout).elements.splice(index, 1);
  }
  return true;
};

export const editorReducer = (
  { schema, uiSchema }: EditorState,
  action: EditorAction
) => {
  switch (action.type) {
    case SET_SCHEMA:
      return { schema: schemaReducer(schema, action), uiSchema };
    case SET_UISCHEMA:
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
    case SET_UISCHEMA_OPTIONS:
      return { schema: schema, uiSchema: uiSchemaReducer(uiSchema, action) };
    case SET_SCHEMAS:
    case ADD_SCOPED_ELEMENT_TO_LAYOUT:
    case MOVE_UISCHEMA_ELEMENT:
    case REMOVE_UISCHEMA_ELEMENT:
      return combinedReducer({ schema, uiSchema }, action);
  }
  // fallback - do nothing
  return { schema, uiSchema };
};
