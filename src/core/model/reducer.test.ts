/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';

import { Actions } from './actions';
import { combinedReducer } from './reducer';
import {
  ArrayElement,
  buildSchemaTree,
  ObjectElement,
  SchemaElement,
} from './schema';
import {
  buildLinkedUiSchemaTree,
  LinkedLayout,
  LinkedUISchemaElement,
} from './uischema';

describe('add detail action', () => {
  const buildState = (): {
    schema: SchemaElement;
    uiSchema: LinkedUISchemaElement;
  } => {
    const schema = buildSchemaTree({
      type: 'object',
      properties: {
        name: { type: 'string' },
        toys: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              height: { type: 'number' },
            },
          },
        },
      },
    }) as ObjectElement;
    const uiSchema = buildLinkedUiSchemaTree({
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/toys' } as ControlElement,
      ],
    } as Layout) as LinkedLayout;
    schema.properties.get('toys')!.linkedUiSchemaElements = new Set(
      uiSchema.elements[0].uuid
    );
    uiSchema.elements[0].linkedSchemaElement = schema.properties.get(
      'toys'
    )!.uuid;
    return { schema, uiSchema };
  };

  test('add non-scoped ui schema element as detail', () => {
    const { schema, uiSchema } = buildState();
    const newDetail = buildLinkedUiSchemaTree({
      type: 'HorizontalLayout',
      elements: [],
    } as Layout);
    const addDetailAction = Actions.addDetail(
      (uiSchema as LinkedLayout).elements[0].uuid,
      newDetail
    );
    const { uiSchema: newUiSchema } = combinedReducer(
      { schema, uiSchema },
      addDetailAction
    );
    expect(
      (newUiSchema as LinkedLayout).elements[0].options!.detail
    ).toStrictEqual(newDetail);
  });

  test('add scoped ui schema element as detail', () => {
    const { schema, uiSchema } = buildState();
    const newDetail = buildLinkedUiSchemaTree({
      type: 'Control',
      scope: '#/properties/height',
    } as ControlElement);
    newDetail.linkedSchemaElement = (((schema as ObjectElement).properties.get(
      'toys'
    ) as ArrayElement).items as ObjectElement).properties.get('height')!.uuid;
    const addDetailAction = Actions.addDetail(
      (uiSchema as LinkedLayout).elements[0].uuid,
      newDetail
    );
    const { schema: newSchema, uiSchema: newUiSchema } = combinedReducer(
      { schema, uiSchema },
      addDetailAction
    );
    expect(
      (newUiSchema as LinkedLayout).elements[0].options!.detail
    ).toStrictEqual(newDetail);
    expect(
      (((newSchema as ObjectElement).properties.get('toys') as ArrayElement)
        .items as ObjectElement).properties
        .get('height')!
        .linkedUiSchemaElements!.has(newDetail.uuid)
    ).toBeTruthy();
  });
});
