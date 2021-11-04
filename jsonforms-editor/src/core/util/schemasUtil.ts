/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { isControl, isLayout, UISchemaElement } from '@jsonforms/core';
import { get } from 'lodash';

import { EditorState, SchemaElement } from '../model';
import type {
  EditorControl,
  EditorLayout,
  EditorUISchemaElement,
} from '../model/uischema';
import { Parentable } from './tree';

export interface CalculatePathError {
  id: 'calulatePathError';
  root: any;
  element: any;
}
export interface GetPathError {
  id: 'getPathError';
  root: any;
  path: Array<string>;
}
export const isCalculatePathError = <T>(
  result: T | CalculatePathError
): result is CalculatePathError =>
  (result as CalculatePathError)?.id === 'calulatePathError';
export const isGetPathError = <T>(
  result: T | GetPathError
): result is GetPathError => (result as GetPathError)?.id === 'getPathError';

export type PathError = CalculatePathError | GetPathError;
export const isPathError = <T>(result: T | PathError): result is PathError =>
  isCalculatePathError(result) || isGetPathError(result);

export interface NoUUIDError {
  id: 'noUUIDError';
  element: any;
}
export interface GetByUUIDError {
  id: 'getByUUIDError';
  root: any;
  uuid: string;
}
export type UUIDError = GetByUUIDError | NoUUIDError;

export const isNoUUIDError = <T>(
  result: T | NoUUIDError
): result is NoUUIDError => (result as NoUUIDError)?.id === 'noUUIDError';
export const isGetByUUIDError = <T>(
  result: T | GetByUUIDError
): result is GetByUUIDError =>
  (result as GetByUUIDError)?.id === 'getByUUIDError';
export const isUUIDError = <T>(result: T | UUIDError): result is UUIDError =>
  isNoUUIDError(result) || isGetByUUIDError(result);

export const getRoot = <T extends Parentable<T>>(
  element: T | undefined
): T | undefined => {
  if (element?.parent) {
    return getRoot(element.parent);
  }
  return element;
};

export const findByUUID = (element: any, uuid: string): any => {
  const root = getRoot(element);
  const result = doFindByUUID(root, uuid);
  if (!result) {
    return {
      id: 'getByUUIDError',
      root: root,
      uuid: uuid,
    };
  }
  return result;
};

export const tryFindByUUID = <T>(
  element: T,
  uuid: string | undefined
): T | undefined => {
  if (!uuid || !element) return undefined;
  const findResult = findByUUID(element, uuid);
  return isUUIDError(findResult) ? undefined : findResult;
};

const doFindByUUID = (root: any, uuid: string): any | UUIDError => {
  if (!uuid) {
    return {
      id: 'noUUIDError',
    };
  }
  if (root && root.uuid === uuid) {
    return root;
  }
  if (!root) {
    return undefined;
  }
  const entries = root instanceof Map ? root.entries() : Object.entries(root);
  for (const [key, value] of Array.from(entries)) {
    if (value && value.uuid === uuid) {
      return value;
    }
    if (typeof value === 'object' && key !== 'parent') {
      const result = doFindByUUID(value, uuid);
      if (result) {
        return result;
      }
    }
    // some mappings are 'reversed'
    if (typeof key === 'object') {
      const result = doFindByUUID(key, uuid);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

export const calculatePath = (
  root: any,
  object: any
): Array<string> | CalculatePathError => {
  const path = doCalculatePath(root, object);
  if (!path) {
    return {
      id: 'calulatePathError',
      root: root,
      element: object,
    };
  }
  return path;
};

export const getPathString = (object: any): string | PathError => {
  const root = getRoot(object);
  const path = calculatePath(root, object);
  if (isPathError(path)) {
    return path;
  }
  return `${path.join('/')}`;
};

const doCalculatePath = (root: any, object: any): Array<string> | undefined => {
  if (object.uuid && root.uuid === object.uuid) {
    return [];
  }
  const entries = root instanceof Map ? root.entries() : Object.entries(root);
  for (const [key, value] of Array.from(entries)) {
    if (object.uuid && value?.uuid === object.uuid) {
      return [key];
    }
    // some mappings are 'reversed'
    if (object.uuid && key?.uuid === object.uuid) {
      return [value];
    }
    if (typeof value === 'object' && key !== 'parent') {
      const path = doCalculatePath(value, object);
      if (path) {
        return [key, ...path];
      }
    }
    // some mappings are 'reversed'
    if (typeof key === 'object') {
      const path = doCalculatePath(key, object);
      if (path) {
        return [value, ...path];
      }
    }
  }
  return undefined;
};

export const getFromPath = (
  root: any,
  path: Array<string>
): any | GetPathError => {
  const element = doGetFromPath(root, path);
  if (!element) {
    return {
      id: 'getPathError',
      root: root,
      path: path,
    };
  }
  return element;
};

const doGetFromPath = (root: any, path: Array<string>): any => {
  if (path.length === 0) {
    return root;
  }
  const [pathElement, ...rest] = path;
  if (root instanceof Map) {
    if (root.has(pathElement)) {
      return getFromPath(root.get(pathElement), rest);
    }
    // must be a reverse map
    const element = Array.from(root.entries()).reduce((acc, [key, value]) => {
      if (value === pathElement) {
        return key;
      }
      return acc;
    }, undefined);
    return getFromPath(element, rest);
  }
  return getFromPath(get(root, [pathElement]), rest);
};

export const linkElements = (
  uiSchemaElement: EditorUISchemaElement,
  schemaElement: SchemaElement
): boolean => {
  if (!uiSchemaElement.uuid) {
    console.error('Found element without UUID', uiSchemaElement);
    return false;
  }

  (schemaElement.linkedUISchemaElements =
    schemaElement.linkedUISchemaElements || new Set()).add(
    uiSchemaElement.uuid
  );

  uiSchemaElement.linkedSchemaElement = schemaElement.uuid;
  return true;
};

export const linkSchemas = (
  schema: SchemaElement | undefined,
  uiSchema: EditorUISchemaElement | undefined
): EditorState => {
  if (!schema || !uiSchema) {
    return { schema, uiSchema };
  }
  traverse(uiSchema, (current) => {
    if (isEditorControl(current)) {
      const linkedElement = getSchemaElementFromScope(schema, current.scope);
      if (linkedElement && !isPathError(linkedElement)) {
        linkElements(current, linkedElement);
      }
    }
  });
  return { schema, uiSchema };
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

const getSchemaElementFromScope = (
  schema: SchemaElement,
  scope: string
): SchemaElement | GetPathError | undefined => {
  const schemaRoot = getRoot(schema);
  const validSegment = (pathSegment: string) =>
    pathSegment !== '#' && pathSegment !== undefined && pathSegment !== '';
  const validPathSegments = scope.split('/').filter(validSegment);
  return getFromPath(schemaRoot, validPathSegments);
};

export const jsonToText = (object: any) => JSON.stringify(object, null, 2);

const isEditorUISchemaElement = (
  element: any
): element is EditorUISchemaElement => {
  return !!element?.type && !!element?.uuid;
};

export const isEditorControl = (
  element: UISchemaElement
): element is EditorControl => {
  return isEditorUISchemaElement(element) && isControl(element);
};

export const isEditorLayout = (
  element: UISchemaElement
): element is EditorLayout => {
  return isEditorUISchemaElement(element) && isLayout(element);
};
