/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { isLayout, Layout, UISchemaElement } from '@jsonforms/core';
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

import { calculatePath, getRoot, isPathError, PathError } from '../util/clone';

export interface LinkedUISchemaElement extends UISchemaElement {
  linkedSchemaElement?: string;
  parent?: LinkedUISchemaElement;
  uuid?: string;
}

export const getChildren = (
  schemaElement: LinkedUISchemaElement
): Array<LinkedUISchemaElement> => {
  const children: Array<LinkedUISchemaElement> = [];
  if (isLayout(schemaElement)) {
    children.push(...schemaElement.elements);
  }
  return children;
};

export const hasChildren = (schemaElement: LinkedUISchemaElement): boolean => {
  return isLayout(schemaElement) && !!(schemaElement as Layout).elements.length;
};

/**
 * Creates a copy of the given ui schema enriched with editor fields
 * like 'parent' and 'linked schema elements'.
 */
export const buildLinkedUiSchemaTree = (
  uiSchema: UISchemaElement
): LinkedUISchemaElement => {
  const linkedUiSchema: LinkedUISchemaElement = cloneDeep(uiSchema);
  traverse(linkedUiSchema, (current, parent) => {
    if (current) {
      current.parent = parent;
      current.uuid = uuid();
    }
  });
  return linkedUiSchema;
};

/**
 * Creates a copy of the given enriched ui schema and removes all editor
 * related fields.
 */
export const buildUiSchema = (
  uiSchema: LinkedUISchemaElement
): UISchemaElement => {
  const clone: LinkedUISchemaElement = cloneDeep(uiSchema);
  traverse(clone, (current, parent) => {
    delete current.parent;
    delete current.linkedSchemaElement;
    delete current.uuid;
  });
  return clone;
};

const traverse = (
  uiSchema: LinkedUISchemaElement,
  pre: (
    uiSchema: LinkedUISchemaElement,
    parent?: LinkedUISchemaElement
  ) => void,
  parent?: LinkedUISchemaElement
): void => {
  pre(uiSchema, parent);
  if (uiSchema && isLayout(uiSchema)) {
    uiSchema.elements.forEach((el) => traverse(el, pre, uiSchema));
  }
  // TODO other containments like categorization
};

export const getUISchemaPath = (
  uiSchema: LinkedUISchemaElement
): string | PathError => {
  const root = getRoot(uiSchema);
  const path = calculatePath(root, uiSchema);
  if (isPathError(path)) {
    return path;
  }
  // TODO should be done in a cleaner way
  return `/${path.join('/')}`;
};
