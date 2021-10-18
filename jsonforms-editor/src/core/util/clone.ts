/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { cloneDeep } from 'lodash';

// Error imports needed for declaration generation (declaration:true in tsconfig)
import { findByUUID, isUUIDError, UUIDError } from './schemasUtil';

/**
 * Clones the whole root tree, matches the element by UUID in the new tree and returns a handle to it.
 * Returns an error when the clone process didn't work or the cloned root, if no uuid was provided.
 */
export const cloneTree = <T>(root: T, uuid?: string): T | UUIDError => {
  const clonedRoot = cloneDeep(root);
  return uuid ? findByUUID(clonedRoot, uuid) : clonedRoot;
};

export const withCloneTree = <R, T>(
  rootTree: T,
  elementUUID: string | undefined,
  fallback: R,
  process: (clonedElement: T) => R
) => {
  const clonedElement = cloneTree(rootTree, elementUUID);
  if (isUUIDError(clonedElement)) {
    console.error(
      'An error occured when cloning element with UUID',
      elementUUID
    );
    // Do nothing
    return fallback;
  }
  return process(clonedElement);
};

/**
 * Convenience wrapper to clone two trees at the same time.
 */
export const withCloneTrees = <R, T1, T2>(
  rootTree1: T1,
  uuid1: string | undefined,
  rootTree2: T2,
  uuid2: string | undefined,
  fallback: R,
  process: (clonedElement1: T1, clonedElement2: T2) => R
) =>
  withCloneTree(rootTree1, uuid1, fallback, (clonedElement1) =>
    withCloneTree(rootTree2, uuid2, fallback, (clonedElement2) =>
      process(clonedElement1, clonedElement2)
    )
  );
