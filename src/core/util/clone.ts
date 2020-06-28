/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { cloneDeep, get } from 'lodash';

import { SchemaElement } from '../model';
import { EditorUISchemaElement } from '../model/uischema';
import { Parentable } from './tree';

interface CalculatePathError {
  id: 'calulatePathError';
  root: any;
  element: any;
}
interface GetPathError {
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

interface NoUUIDError {
  id: 'noUUIDError';
  element: any;
}
interface GetByUUIDError {
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

export const findByUUID = (uiSchema: any, uuid: string): any | UUIDError => {
  const root = getRoot(uiSchema);
  const element = doFindByUUID(root, uuid);
  if (!element) {
    return {
      id: 'getByUUIDError',
      root: root,
      uuid: uuid,
    };
  }
  return element;
};

export const tryFindByUUID = (
  uiSchema: any,
  uuid: string | undefined
): any | undefined => {
  if (!uuid || !uiSchema) return undefined;
  const findResult = findByUUID(uiSchema, uuid);
  return isUUIDError(findResult) ? undefined : findResult;
};

const doFindByUUID = (root: any, uuid: string): any | UUIDError => {
  if (root && root.uuid === uuid) {
    return root;
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

/**
 * Clones the whole tree the element is contained in and returns a handle to the corresponding element.
 * Returns an error when the clone process didn't work.
 */
export const cloneTree = <T extends Parentable<P>, P extends T>(
  element: T
): T | PathError => {
  const oldRoot = getRoot(element);
  const pathToOldElement = calculatePath(oldRoot, element);
  if (isPathError(pathToOldElement)) {
    return pathToOldElement;
  }
  const clonedRoot = cloneDeep(oldRoot);
  return getFromPath(clonedRoot, pathToOldElement);
};

export const withCloneTree = <R, T>(
  element: T,
  fallback: R,
  process: (clonedElement: T) => R
) => {
  if (element === undefined) {
    return process(element);
  }
  const clonedElement = cloneTree(element);
  if (isPathError(clonedElement)) {
    console.error('An error occured when cloning', element);
    // Do nothing
    return fallback;
  }
  return process(clonedElement);
};

/**
 * Convenience wrapper to clone two trees at the same time.
 */
export const withCloneTrees = <R, T1, T2>(
  element1: T1,
  element2: T2,
  fallback: R,
  process: (clonedElement1: T1, clonedElement2: T2) => R
) =>
  withCloneTree(element1, fallback, (clonedElement1) =>
    withCloneTree(element2, fallback, (clonedElement2) =>
      process(clonedElement1, clonedElement2)
    )
  );

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
  if (root === object) {
    return [];
  }
  const entries = root instanceof Map ? root.entries() : Object.entries(root);
  for (const [key, value] of Array.from(entries)) {
    if (value === object) {
      return [key];
    }
    // some mappings are 'reversed'
    if (key === object) {
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
