/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
export interface Parentable<T> {
  parent?: T;
}

export interface Identifiable {
  uuid: string;
}

export interface TreeElement<T> extends Parentable<T>, Identifiable {}

/**
 * Returns an array starting with the current element followed by its parents
 */
export const getHierarchy = <T extends Parentable<T>>(
  element: T | undefined
): T[] => (!element ? [] : [element, ...getHierarchy(element.parent)]);
