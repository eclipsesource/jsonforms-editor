/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import {
  buildSchemaTree,
  getArrayContainer,
  getChildren,
  SchemaElement,
} from './schema';

test('set uuids on single element', () => {
  const element = simplePrimitive();
  const enrichedElement = buildSchemaTree(element);
  expect(enrichedElement).toHaveProperty('uuid');
});

test('set uuids on nested elements', () => {
  const object = simpleObject();
  const enrichedObject = buildSchemaTree(object) as SchemaElement;
  expect(enrichedObject).toHaveProperty('uuid');
  const children = getChildren(enrichedObject);
  expect(children.length).toBe(2);
  children.forEach((child) => {
    expect(child).toHaveProperty('uuid');
  });
});

test('getArrayContainer', () => {
  const array = simpleArray();
  (array as any).items.properties.nestedArray = simpleArray();

  const enrichedArray = buildSchemaTree(array) as SchemaElement;
  expect(enrichedArray).toBeTruthy();
  expect(getArrayContainer(enrichedArray!)).toBeFalsy();

  const arrayChildren = getChildren(enrichedArray);
  expect(arrayChildren.length).toBe(1);

  const object = arrayChildren[0];
  expect(getArrayContainer(object)).toBe(enrichedArray);

  const objectChildren = getChildren(object);
  expect(objectChildren.length).toBe(3);
  objectChildren.forEach((child) => {
    expect(getArrayContainer(child)).toBe(enrichedArray);
  });

  const nestedArray = objectChildren[2];

  const nestedArrayChildren = getChildren(nestedArray);
  expect(nestedArrayChildren.length).toBe(1);

  const nestedArrayObject = nestedArrayChildren[0];
  expect(getArrayContainer(nestedArrayObject)).toBe(nestedArray);

  getChildren(nestedArrayObject).forEach((child) => {
    expect(getArrayContainer(child)).toBe(nestedArray);
  });
});

const simplePrimitive = () => ({
  type: 'string',
});

const simpleObject = () => ({
  type: 'object',
  properties: {
    name: simplePrimitive(),
    surname: simplePrimitive(),
  },
});

const simpleArray = () => ({
  type: 'array',
  items: simpleObject(),
});
