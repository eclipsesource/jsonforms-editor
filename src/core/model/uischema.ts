/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  ControlElement,
  isControl,
  isLayout,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';

import { calculatePath, getRoot, isPathError, PathError } from '../util/clone';
import { getHierarchy, TreeElement } from '../util/tree';

export interface LinkedUISchemaElement
  extends UISchemaElement,
    TreeElement<LinkedUISchemaElement> {
  linkedSchemaElement?: string;
}

export interface LinkedControl extends ControlElement, LinkedUISchemaElement {
  type: 'Control';
}

export interface LinkedLayout extends Layout, LinkedUISchemaElement {
  elements: LinkedUISchemaElement[];
}

const isLinkedUISchemaElement = (
  element: any
): element is LinkedUISchemaElement => {
  return !!element?.type && !!element?.uuid;
};

export const isLinkedControl = (
  element: UISchemaElement
): element is LinkedControl => {
  return isLinkedUISchemaElement(element) && isControl(element);
};

export const isLinkedLayout = (
  element: UISchemaElement
): element is LinkedLayout => {
  return isLinkedUISchemaElement(element) && isLayout(element);
};

export const getChildren = (
  schemaElement: LinkedUISchemaElement
): Array<LinkedUISchemaElement> => {
  const children: Array<LinkedUISchemaElement> = [];
  if (isLinkedLayout(schemaElement)) {
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
  // cast to any so we can freely modify it
  const linkedUiSchema: any = cloneDeep(uiSchema);
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
  traverse(clone, (current) => {
    delete current.parent;
    delete current.linkedSchemaElement;
    delete current.uuid;
  });
  return clone;
};

export const traverse = <T extends UISchemaElement, C>(
  uiSchema: T,
  pre: (uiSchema: T, parent: T | undefined, context: C) => void,
  context?: C
): C => doTraverse(uiSchema, pre, undefined, context!);

const doTraverse = <T extends UISchemaElement, C>(
  uiSchema: T,
  pre: (uiSchema: T, parent: T | undefined, context: C) => void,
  parent: T | undefined,
  context: C
): C => {
  pre(uiSchema, parent, context);
  if (uiSchema && isLayout(uiSchema)) {
    uiSchema.elements.forEach((el) =>
      doTraverse(el as T, pre, uiSchema, context)
    );
  }
  if (uiSchema?.options?.detail) {
    doTraverse(uiSchema.options.detail, pre, uiSchema, context);
  }
  // TODO other containments like categorization
  return context;
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

/**
 * Returns the closes element whose detail contains the given element
 */
export const getDetailContainer = (
  element: LinkedUISchemaElement
): LinkedUISchemaElement | undefined => {
  const parentIsDetail = (el: LinkedUISchemaElement) =>
    el.parent?.options?.detail === el;
  return getHierarchy(element).find(parentIsDetail)?.parent;
};

/**
 * Indicates whether the given ui schema element is a control or contains controls
 */
export const containsControls = (element: LinkedUISchemaElement): boolean =>
  traverse(
    element,
    (el, _parent, acc) => {
      if (isLinkedControl(el)) {
        acc.containsControls = true;
      }
    },
    { containsControls: false }
  ).containsControls;
