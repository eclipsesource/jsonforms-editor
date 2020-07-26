/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { cloneDeep } from 'lodash';

// Error imports needed for declaration generation (declaration:true in tsconfig)
import {
  calculatePath,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CalculatePathError,
  getFromPath,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GetPathError,
  getRoot,
  isPathError,
  PathError,
} from './schemasUtil';
import { Parentable } from './tree';

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
