/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
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
import { getHierarchy } from '../util/tree';

export const NEW_UI_SCHEMA_ELEMENT: 'newUiSchemaElement' = 'newUiSchemaElement';
export const MOVE_UI_SCHEMA_ELEMENT: 'moveUiSchemaElement' =
  'moveUiSchemaElement';

export type DndType = NewUISchemaElement | MoveUISchemaElement;

export interface NewUISchemaElement {
  type: 'newUiSchemaElement';
  uiSchemaElement: EditorUISchemaElement;
  schema?: SchemaElement;
}

const newUISchemaElement = (
  uiSchemaElement: EditorUISchemaElement,
  schema?: SchemaElement
) => ({
  type: NEW_UI_SCHEMA_ELEMENT,
  uiSchemaElement,
  schema,
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
  layout: EditorUISchemaElement
) => {
  // check scope changes
  const detailContainer = getDetailContainer(layout);
  if (!canDropIntoScope(item, detailContainer)) {
    return false;
  }
  // check whether
  return true;
};

/**
 * Check whether the element to drop fits into the given scope,
 * e.g. whether a nested array object is dropped into the correct array ui schema control.
 *
 * @param item the drag and drop item
 * @param scopeChangingElement the nearest scope changing element,
 * e.g. the nearest array control into which shall be dropped.
 * Use `undefined` when dropping outside of any scope changing element.
 */
export const canDropIntoScope = (
  item: NewUISchemaElement,
  scopeUISchemaElement: EditorUISchemaElement | undefined
) => {
  // it's a control when there is a schema
  if (item.schema) {
    // check wether the control fits to the scope
    // -- TODO check other cases than array
    const scopeSchemaElement = getArrayContainer(item.schema);
    if (!!scopeSchemaElement !== !!scopeUISchemaElement) {
      // scopes don't match when one exist and the other doesn't
      return false;
    }
    if (
      scopeSchemaElement &&
      scopeUISchemaElement &&
      scopeUISchemaElement.linkedSchemaElement !== scopeSchemaElement.uuid
    ) {
      // scopes didn't match
      return false;
    }
  }
  return true;
};

export const canMoveSchemaElementTo = (
  item: MoveUISchemaElement,
  layout: EditorUISchemaElement,
  index: number
) => {
  const uiElementToMove = item.uiSchemaElement as EditorUISchemaElement;
  // can't move the root element
  if (!uiElementToMove.parent) {
    return false;
  }
  // can't move element into itself
  if (getHierarchy(layout).includes(uiElementToMove)) {
    return false;
  }
  // can't move element next to itself (which would result in no change)
  if (layout === uiElementToMove.parent) {
    const currentIndex = (uiElementToMove.parent as EditorLayout).elements.indexOf(
      uiElementToMove
    );
    if (currentIndex === index || currentIndex === index - 1) {
      return false;
    }
  }
  // controls can't move across scope barriers
  if (
    containsControls(uiElementToMove) &&
    getDetailContainer(uiElementToMove) !== getDetailContainer(layout)
  ) {
    return false;
  }
  return true;
};
