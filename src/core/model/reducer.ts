/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
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
  ADD_DETAIL,
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
import {
  buildEditorUiSchemaTree,
  EditorLayout,
  EditorUISchemaElement,
  isEditorControl,
  isEditorLayout,
  traverse,
} from './uischema';

export interface EditorState {
  schema?: SchemaElement;
  uiSchema?: EditorUISchemaElement;
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
  uiSchema: EditorUISchemaElement | undefined,
  action: UiSchemaAction
) => {
  switch (action.type) {
    case SET_UISCHEMA:
      // FIXME we need to link the uischema to the schema
      return buildEditorUiSchemaTree(action.uiSchema);
    case ADD_UNSCOPED_ELEMENT_TO_LAYOUT:
      return withCloneTree(action.layout, uiSchema, (newUiSchema) => {
        const newUIElement = action.uiSchemaElement;
        newUIElement.parent = newUiSchema;
        newUiSchema.elements.splice(action.index, 0, newUIElement);
        return getRoot(newUiSchema as EditorUISchemaElement);
      });
    case SET_UISCHEMA_OPTIONS:
      return withCloneTree(action.uiSchema, uiSchema, (newUiSchema) => {
        newUiSchema.options = action.options;
        return getRoot(newUiSchema as EditorUISchemaElement);
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
        uiSchema: buildEditorUiSchemaTree(action.uiSchema),
      };
    case ADD_SCOPED_ELEMENT_TO_LAYOUT:
      return withCloneTrees(
        action.layout as EditorUISchemaElement,
        action.schema,
        state,
        (newUiSchema, newSchema) => {
          const newUIElement = action.uiSchemaElement;
          newUIElement.parent = newUiSchema;
          (newUiSchema as EditorLayout).elements.splice(
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
        action.newContainer,
        action.schema,
        state,
        (newContainer, newSchema) => {
          const elementToMove = findByUUID(
            newContainer,
            action.uiSchemaElement.uuid
          );
          if (isUUIDError(elementToMove)) {
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

          // link child and new parent
          elementToMove.parent = newContainer;
          if (isEditorLayout(newContainer)) {
            const moveRightInSameParent =
              action.newContainer === action.uiSchemaElement.parent &&
              (action.newContainer as EditorLayout).elements.indexOf(
                action.uiSchemaElement
              ) < action.index;
            // we need to adapt the index as we removed the element previously
            const indexToUse = moveRightInSameParent
              ? action.index - 1
              : action.index;
            (newContainer as EditorLayout).elements.splice(
              indexToUse,
              0,
              elementToMove
            );
          } else if (isEditorControl(newContainer)) {
            newContainer.options = {
              ...newContainer.options,
              detail: elementToMove,
            };
          } else {
            // TODO other cases
            console.error('Move encountered an invalid case');
            return state;
          }

          // add linkedUISchemaElements in the schema (for scoped ui elements) if such links existed before
          if (action.uiSchemaElement.linkedSchemaElement) {
            // newSchema can't be undefined when the old ui element had links to it
            (newSchema!.linkedUISchemaElements =
              newSchema!.linkedUISchemaElements || new Set()).add(
              elementToMove.uuid
            );
          }

          // schema is optional in this action
          const schemaToReturn =
            action.schema !== undefined ? getRoot(newSchema) : state.schema;

          return {
            schema: schemaToReturn,
            uiSchema: getRoot(newContainer as EditorUISchemaElement),
          };
        }
      );
    case REMOVE_UISCHEMA_ELEMENT:
      return withCloneTrees(
        action.uiSchemaElement as EditorUISchemaElement,
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
    case ADD_DETAIL:
      return withCloneTrees(
        state.schema,
        state.uiSchema,
        state,
        (schema, uiSchema) => {
          const elementForDetail = findByUUID(
            uiSchema,
            action.uiSchemaElementId
          );
          if (isUUIDError(elementForDetail)) {
            console.error(
              'Could not find ui schema element with id',
              elementForDetail
            );
            return state;
          }
          // link all new ui schema elements
          const linkResult = traverse(
            action.detail,
            (uiSchemaElement, _parent, acc) => {
              if (uiSchemaElement.linkedSchemaElement) {
                const schemaElementToLink = findByUUID(
                  schema,
                  uiSchemaElement.linkedSchemaElement
                );
                if (isUUIDError(schemaElementToLink)) {
                  console.error(
                    'Could not find schema element with id',
                    schemaElementToLink
                  );
                  acc.error = true;
                }
                (schemaElementToLink.linkedUISchemaElements =
                  schemaElementToLink.linkedUISchemaElements || new Set()).add(
                  action.detail.uuid
                );
              }
            },
            { error: false }
          );
          if (linkResult.error) {
            return state;
          }

          elementForDetail.options = elementForDetail.options || {};
          elementForDetail.options.detail = action.detail;
          action.detail.parent = elementForDetail;
          return { schema, uiSchema };
        }
      );
  }
  // fallback - do nothing
  return state;
};

/** Removes the given UI element from its tree.
 *  If a SchemaElement is provided, the element to remove will be cleaned up from all linkedUISchemaElements fields in the schema.
 */
const removeUiElement = (
  elementToRemove: EditorUISchemaElement,
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
    linkedSchemaElement.linkedUISchemaElements?.delete(uuidToRemove);
  }

  // remove from parent
  if (elementToRemove.parent) {
    // - case: Layout
    if ((elementToRemove.parent as EditorLayout).elements) {
      const index = (elementToRemove.parent as EditorLayout).elements.indexOf(
        elementToRemove
      );
      if (index !== -1) {
        (elementToRemove.parent as EditorLayout).elements.splice(index, 1);
      }
    }
    // - case: element with detail
    if (elementToRemove.parent.options?.detail === elementToRemove) {
      delete elementToRemove.parent.options.detail;
      if (Object.keys(elementToRemove.parent.options).length === 0) {
        delete elementToRemove.parent.options;
      }
    }

    // TODO other cases
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
    case ADD_DETAIL:
      return combinedReducer({ schema, uiSchema }, action);
  }
  // fallback - do nothing
  return { schema, uiSchema };
};
