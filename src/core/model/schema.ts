/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import traverse from 'json-schema-traverse';
import { cloneDeep, omit } from 'lodash';
import { v4 as uuid } from 'uuid';

import { getHierarchy, TreeElement } from '../util/tree';

export const OBJECT: 'object' = 'object';
export const ARRAY: 'array' = 'array';
export const PRIMITIVE: 'primitive' = 'primitive';
export const OTHER: 'other' = 'other';

export type SchemaElementType = 'object' | 'array' | 'primitive' | 'other';

interface SchemaElementBase extends TreeElement<SchemaElement> {
  type: SchemaElementType;
  schema: any;
  other?: Map<string, SchemaElement>;
  linkedUiSchemaElements?: Set<string>;
}

export type SchemaElement =
  | ArrayElement
  | ObjectElement
  | PrimitiveElement
  | OtherElement;

export interface ArrayElement extends SchemaElementBase {
  type: 'array';
  items: SchemaElement | Array<SchemaElement>;
}

export interface ObjectElement extends SchemaElementBase {
  type: 'object';
  properties: Map<string, SchemaElement>;
}

export interface PrimitiveElement extends SchemaElementBase {
  type: 'primitive';
}

export interface OtherElement extends SchemaElementBase {
  type: 'other';
}

export const getChildren = (
  schemaElement: SchemaElement
): Array<SchemaElement> => {
  const children: Array<SchemaElement> = [];
  switch (schemaElement.type) {
    case OBJECT:
      children.push(...Array.from(schemaElement.properties.values()));
      break;
    case ARRAY:
      const items = Array.isArray(schemaElement.items)
        ? schemaElement.items
        : [schemaElement.items];
      children.push(...items);
      break;
  }
  if (schemaElement.other) {
    children.push(...Array.from(schemaElement.other.values()));
  }
  return children;
};

const containsAs = (
  schemaElement: SchemaElement
): Map<SchemaElement, string> => {
  const containments: [SchemaElement, string][] = [];
  switch (schemaElement.type) {
    case OBJECT:
      const propertyEntries: [SchemaElement, string][] = Array.from(
        schemaElement.properties.entries()
      ).map(([prop, element]) => [element, `properties/${prop}`]);
      containments.push(...propertyEntries);
      break;
    case ARRAY:
      const itemEntries: [SchemaElement, string][] = Array.isArray(
        schemaElement.items
      )
        ? schemaElement.items.map((element, index) => [
            element,
            `items/${index}`,
          ])
        : [[schemaElement.items, 'items']];
      containments.push(...itemEntries);
      break;
  }
  if (schemaElement.other) {
    const entries: [SchemaElement, string][] = Array.from(
      schemaElement.other.entries()
    ).map(([prop, element]) => [element, prop]);
    containments.push(...entries);
  }
  return new Map<SchemaElement, string>(containments);
};

/** Calculates the full path from root to the given element */
export const getPath = (schemaElement: SchemaElement): string => {
  if (!schemaElement.parent) {
    return '';
  }
  return `${getPath(schemaElement.parent)}/${containsAs(
    schemaElement.parent
  ).get(schemaElement)}`;
};

/**
 *  Calculates the scope for the given element.
 *  This is the same as `getPath` however it stops at array elements.
 */
export const getScope = (schemaElement: SchemaElement): string => {
  if (!schemaElement.parent || isArrayElement(schemaElement.parent)) {
    return '';
  }
  return `${getScope(schemaElement.parent)}/${containsAs(
    schemaElement.parent
  ).get(schemaElement)}`;
};

export const toPrintableObject = (schemaElement: SchemaElement): any => ({
  type: schemaElement.type,
  path: getPath(schemaElement),
  schema: schemaElement.schema,
  children: Array.from(containsAs(schemaElement)).map(([el, key]) => [
    key,
    toPrintableObject(el),
  ]),
});

const isElementOfType = <T extends SchemaElement>(type: string) => (
  schemaElement: SchemaElement | undefined
): schemaElement is T => schemaElement?.type === type;
export const isObjectElement = isElementOfType<ObjectElement>(OBJECT);
export const isArrayElement = isElementOfType<ArrayElement>(ARRAY);
export const isPrimitiveElement = isElementOfType<PrimitiveElement>(PRIMITIVE);
export const isOtherElement = isElementOfType<OtherElement>(OTHER);

export const getLabel = (schemaElement: SchemaElement) => {
  if (schemaElement.schema.title) {
    return schemaElement.schema.title;
  }
  if (isObjectElement(schemaElement.parent)) {
    for (const [prop, element] of Array.from(
      schemaElement.parent.properties.entries()
    )) {
      if (element === schemaElement) {
        return prop;
      }
    }
  }
  if (
    isArrayElement(schemaElement.parent) &&
    Array.isArray(schemaElement.parent.items)
  ) {
    for (let i = 0; i < schemaElement.parent.items.length; i++) {
      if (schemaElement.parent.items[i] === schemaElement) {
        return `[${i}]`;
      }
    }
  }
  return '<No label>';
};

const createNewElementForType = (
  schema: any,
  type: SchemaElementType
): SchemaElement => {
  switch (type) {
    case OBJECT:
      const objectCopy = cloneDeep(omit(schema, ['properties']));
      return { type, schema: objectCopy, properties: new Map(), uuid: uuid() };
    case ARRAY:
      const arrayCopy = cloneDeep(omit(schema, ['items']));
      return { type, schema: arrayCopy, items: [], uuid: uuid() };
    case PRIMITIVE:
      return { type, schema: cloneDeep(schema), uuid: uuid() };
    default:
      return { type: OTHER, schema: cloneDeep(schema), uuid: uuid() };
  }
};

const createSingleElement = (schema: any) =>
  createNewElementForType(schema, determineType(schema));

const getUndefined = (): SchemaElement | undefined => undefined;

export const buildSchemaTree = (schema: any): SchemaElement | undefined => {
  // workaround needed because of TS compiler issue
  // https://github.com/Microsoft/TypeScript/issues/11498
  let currentElement: SchemaElement | undefined = getUndefined();

  traverse(schema, {
    cb: {
      pre: (
        currentSchema: any,
        pointer,
        rootSchema,
        parentPointer,
        parentKeyword,
        parentSchema,
        indexOrProp
      ) => {
        const newElement = createSingleElement(currentSchema);
        newElement.parent = currentElement;
        const path = pointer.split('/');
        if (
          isObjectElement(currentElement) &&
          path[path.length - 2] === 'properties'
        ) {
          currentElement.properties.set(`${indexOrProp}`, newElement);
        } else if (
          isArrayElement(currentElement) &&
          path[path.length - 2] === 'items'
        ) {
          (currentElement.items as SchemaElement[]).push(newElement);
        } else if (
          isArrayElement(currentElement) &&
          path[path.length - 1] === 'items'
        ) {
          currentElement.items = newElement;
        } else if (currentElement) {
          if (!currentElement.other) {
            currentElement.other = new Map();
          }
          currentElement.other.set(`${indexOrProp}`, newElement);
        }
        currentElement = newElement;
      },
      post: () => {
        currentElement = currentElement?.parent || currentElement;
      },
    },
  });

  if (!currentElement) {
    return undefined;
  }

  return currentElement;
};

const determineType = (schema: any): SchemaElementType => {
  if (!schema) {
    return OTHER;
  }
  if (schema.type) {
    switch (schema.type) {
      case 'object':
        return OBJECT;
      case 'array':
        return ARRAY;
      case 'number':
      case 'integer':
      case 'string':
      case 'boolean':
      case 'const':
        return PRIMITIVE;
      default:
        return OTHER;
    }
  }
  if (schema.properties) {
    return OBJECT;
  }
  if (schema.items) {
    return ARRAY;
  }
  if (schema.enum) {
    return PRIMITIVE;
  }
  return OTHER;
};

export const buildJsonSchema = (element: SchemaElement) => {
  const result = cloneDeep(element.schema);
  switch (element.type) {
    case OBJECT:
      if (element.properties.size > 0) {
        result.properties = {};
        element.properties.forEach((propertyElement, propName) => {
          result.properties[propName] = buildJsonSchema(propertyElement);
        });
      }
      break;
    case ARRAY:
      if (Array.isArray(element.items)) {
        result.items = element.items.map(buildJsonSchema);
      } else {
        result.items = buildJsonSchema(element.items);
      }
      break;
  }
  return result;
};

/**
 * Returns the closest array which contains the given element
 */
export const getArrayContainer = (
  element: SchemaElement
): SchemaElement | undefined =>
  getHierarchy(element).splice(1).find(isArrayElement);
