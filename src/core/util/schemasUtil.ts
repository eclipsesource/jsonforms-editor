/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';

import { EditorState, SchemaElement } from '../model';
import {
  EditorUISchemaElement,
  isEditorControl,
  traverse,
} from '../model/uischema';
import { withCloneTrees } from './clone';
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

export const buildAndLinkUISchema = (
  schema: SchemaElement | undefined,
  uiSchema: any
): EditorState => {
  return withCloneTrees(
    schema,
    uiSchema,
    { schema, uiSchema },
    (newSchema, newUISchema) => {
      if (!newUISchema) {
        return { schema, uiSchema };
      }
      traverse(newUISchema, (current, parent) => {
        if (current) {
          current.parent = parent;
          current.uuid = uuid();
        }
        if (newSchema && isEditorControl(current)) {
          const linkedElement = getLinkedElement(newSchema, current.scope);
          if (linkedElement && !isPathError(linkedElement)) {
            linkElements(current, linkedElement);
          }
        }
      });
      return { schema: newSchema, uiSchema: newUISchema };
    }
  );
};

export const getLinkedElement = (
  schema: SchemaElement,
  scope: string
): SchemaElement | undefined => {
  const schemaRoot = getRoot(schema);
  const validSegment = (pathSegment: string) =>
    pathSegment !== '#' && pathSegment !== undefined && pathSegment !== '';
  const validPathSegments = scope.split('/').filter(validSegment);
  return getFromPath(schemaRoot, validPathSegments);
};
