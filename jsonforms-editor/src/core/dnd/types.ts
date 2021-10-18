/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { getArrayContainer, SchemaElement } from '../model';
import {
  containsControls,
  EditorLayout,
  EditorUISchemaElement,
  getDetailContainer,
} from '../model/uischema';
import { tryFindByUUID } from '../util/schemasUtil';
import { getHierarchy } from '../util/tree';

export const NEW_UI_SCHEMA_ELEMENT: 'newUiSchemaElement' = 'newUiSchemaElement';
export const MOVE_UI_SCHEMA_ELEMENT: 'moveUiSchemaElement' =
  'moveUiSchemaElement';

export type DndType = NewUISchemaElement | MoveUISchemaElement;

export interface NewUISchemaElement {
  type: 'newUiSchemaElement';
  uiSchemaElement: EditorUISchemaElement;
  schemaUUID?: string;
}

const newUISchemaElement = (
  uiSchemaElement: EditorUISchemaElement,
  schemaUUID?: string
) => ({
  type: NEW_UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schemaUUID,
});

export interface MoveUISchemaElement {
  type: 'moveUiSchemaElement';
  uiSchemaElement: EditorUISchemaElement;
  schema?: SchemaElement;
}

const moveUISchemaElement = (
  uiSchemaElement: EditorUISchemaElement,
  schema?: SchemaElement
) => ({
  type: MOVE_UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schema,
});

export const DndItems = { newUISchemaElement, moveUISchemaElement };

export const canDropIntoLayout = (
  item: NewUISchemaElement,
  rootSchema: SchemaElement | undefined,
  layout: EditorUISchemaElement
) => {
  // check scope changes
  const detailContainer = getDetailContainer(layout);
  return canDropIntoScope(item, rootSchema, detailContainer);
};

/**
 * Check whether the element to drop fits into the given scope,
 * e.g. whether a nested array object is dropped into the correct array ui schema control.
 *
 * @param item the drag and drop item
 * @param scopeUISchemaElement the nearest scope changing element,
 * e.g. the nearest array control into which shall be dropped.
 * Use `undefined` when dropping outside of any scope changing element.
 */
export const canDropIntoScope = (
  item: NewUISchemaElement,
  rootSchema: SchemaElement | undefined,
  scopeUISchemaElement: EditorUISchemaElement | undefined
) => {
  const controlObject = tryFindByUUID(rootSchema, item.schemaUUID);
  if (controlObject) {
    const scopeSchemaElement = getScopeChangingContainer(controlObject);
    if (!scopesMatch(scopeSchemaElement, scopeUISchemaElement)) {
      return false;
    }
  }
  return true;
};

/**
 * Scopes match if they are linked or both don't exist.
 */
const scopesMatch = (
  schemaScope: SchemaElement | undefined,
  uiScope: EditorUISchemaElement | undefined
) => {
  return uiScope?.linkedSchemaElement === schemaScope?.uuid;
};

/**
 * Returns the closest scope changing schema container
 */
const getScopeChangingContainer = (element: SchemaElement) => {
  // TODO check other cases than array
  return getArrayContainer(element);
};

export const canMoveSchemaElementTo = (
  item: MoveUISchemaElement,
  target: EditorUISchemaElement,
  index: number
) => {
  const elementToMove = item.uiSchemaElement as EditorUISchemaElement;
  return (
    !isMoveRoot(elementToMove) &&
    !isMoveIntoItself(elementToMove, target) &&
    !isMoveNextToItself(elementToMove, target, index) &&
    !isMovingControlsInterScopes(elementToMove, target)
  );
};

const isMoveRoot = (elementToMove: EditorUISchemaElement) =>
  !elementToMove.parent;
const isMoveIntoItself = (
  elementToMove: EditorUISchemaElement,
  target: EditorUISchemaElement
) => getHierarchy(target).includes(elementToMove);
const isMoveNextToItself = (
  elementToMove: EditorUISchemaElement,
  target: EditorUISchemaElement,
  index: number
) => {
  if (target === elementToMove.parent) {
    const currentIndex = (target as EditorLayout).elements.indexOf(
      elementToMove
    );
    if (currentIndex === index || currentIndex === index - 1) {
      return true;
    }
  }
  return false;
};
const isMovingControlsInterScopes = (
  elementToMove: EditorUISchemaElement,
  target: EditorUISchemaElement
) =>
  containsControls(elementToMove) &&
  getDetailContainer(elementToMove) !== getDetailContainer(target);
