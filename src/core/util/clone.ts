/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { cloneDeep, get } from 'lodash';

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

export const getRoot = <T extends Parentable<T>>(
  element: T | undefined
): T | undefined => {
  if (element?.parent) {
    return getRoot(element.parent);
  }
  return element;
};

/**
 * Determines the corresponding element within the cloned tree.
 * Works as long as the tree was not structurally modified.
 */
export const getCorrespondingElement = <
  T1 extends Parentable<T1>,
  T2 extends Parentable<T2>
>(
  element: T1,
  clonedTree: T2
): T1 | PathError => {
  const elementPath = calculatePath(getRoot(element), element);
  if (isPathError(elementPath)) {
    return elementPath;
  }
  const clonedRoot = getRoot(clonedTree);
  return getFromPath(clonedRoot, elementPath);
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
