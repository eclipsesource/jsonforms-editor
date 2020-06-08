/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout } from '@jsonforms/core';

import {
  getCorrespondingElement,
  getFromPath,
  getPathString,
  getRoot,
  isPathError,
  PathError,
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
        newUIElement.parent = newUiSchema;
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

          const uiElementPath = getPathString(newUIElement);
          if (!isPathError(uiElementPath)) {
            (newSchema.linkedUiSchemaElements =
              newSchema.linkedUiSchemaElements || []).push(uiElementPath);
          } else {
            console.error(
              'An error occured when calculating the path of the ui element',
              uiElementPath
            );
            return state;
          }

          const schemaPath = getPathString(newSchema);
          if (!isPathError(schemaPath)) {
            (newUIElement.linkedSchemaElements =
              newUIElement.linkedSchemaElements || []).push(schemaPath);
          } else {
            console.error(
              'An error occured when calculating the path of the schema element',
              schemaPath
            );
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
          const elementToMove = getCorrespondingElement(
            action.uiSchemaElement,
            newUiSchema
          );
          if (isPathError(elementToMove)) {
            console.error(
              'Could not find corresponding element ',
              elementToMove
            );
            return state;
          }

          const removeResult = removeLeafUiElement(elementToMove, newSchema);
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
          if (
            action.uiSchemaElement.linkedSchemaElements &&
            action.uiSchemaElement.linkedSchemaElements.length > 0
          ) {
            const newUiSchemaPath = getPathString(elementToMove);
            if (isPathError(newUiSchemaPath)) {
              console.error('Could not calculate path ', newUiSchemaPath);
              return state;
            }
            // newSchema can't be undefined when the old ui element had links to it
            (newSchema!.linkedUiSchemaElements =
              newSchema!.linkedUiSchemaElements || []).push(newUiSchemaPath);
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
          if (elementToRemove.parent) {
            const removeResult = removeLeafUiElement(
              elementToRemove,
              newSchema
            );
            if (isPathError(removeResult)) {
              console.error('Could not remove ui element ', removeResult);
              return state;
            }
          } else {
            //we are removing the root ui element
            // remove links in the schema
            if (newSchema) {
              const removeLinksResult = removeLinkedUIElementsFromSchema(
                elementToRemove,
                newSchema
              );
              if (isPathError(removeLinksResult)) {
                console.error(
                  'Could not remove linked ui elements',
                  removeLinksResult
                );
                return state;
              }
            }
            return {
              schema: newSchema,
              uiSchema: undefined,
            };
          }

          return {
            schema: newSchema,
            uiSchema: elementToRemove ? getRoot(elementToRemove) : undefined,
          };
        }
      );
  }
  // fallback - do nothing
  return state;
};

const removeLinkedUIElementsFromSchema = (
  elementToRemove: LinkedUISchemaElement,
  schema: SchemaElement
): true | PathError => {
  if (elementToRemove.linkedSchemaElements) {
    const pathToRemove = getPathString(elementToRemove);
    if (isPathError(pathToRemove)) {
      return pathToRemove;
    }
    const schemaRoot = getRoot(schema);
    for (const schemaPath of elementToRemove.linkedSchemaElements) {
      const linkedSchemaElement = getFromPath(
        schemaRoot,
        schemaPath.split('/')
      );
      if (isPathError(linkedSchemaElement)) {
        return linkedSchemaElement;
      }
      linkedSchemaElement.linkedUiSchemaElements.splice(
        linkedSchemaElement.linkedUiSchemaElements.indexOf(pathToRemove),
        1
      );
    }
  }
  return true;
};

/** Removes the given UI element from its tree.
 *  If a SchemaElement is provided, the element to remove will be cleaned up from all linkedUiSchemaElements fields in the schema.
 *  ***Does not support the removal of the root UI schema element.***    */
const removeLeafUiElement = (
  elementToRemove: LinkedUISchemaElement,
  schema?: SchemaElement
): true | PathError => {
  // remove links to UI element in the schema
  if (schema) {
    const removeLinksResult = removeLinkedUIElementsFromSchema(
      elementToRemove,
      schema
    );
    if (isPathError(removeLinksResult)) {
      return removeLinksResult;
    }
  }

  if (elementToRemove.parent && (elementToRemove.parent as Layout).elements) {
    // remove element from parent in the UI schema
    // TODO only works for layouts
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
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
    case SET_UISCHEMA:
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
