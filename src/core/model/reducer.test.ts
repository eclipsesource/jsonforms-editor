/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement } from '@jsonforms/core';

import {
  createControlWithScope,
  createLayout,
} from '../util/generators/uiSchema';
import { buildAndLinkUISchema } from '../util/schemasUtil';
import { Actions } from './actions';
import { combinedReducer } from './reducer';
import {
  ArrayElement,
  buildSchemaTree,
  ObjectElement,
  SchemaElement,
} from './schema';
import { EditorLayout, EditorUISchemaElement } from './uischema';

describe('add detail action', () => {
  const buildState = (): {
    schema: SchemaElement;
    uiSchema: EditorUISchemaElement;
  } => {
    const state = buildAndLinkUISchema(
      buildSchemaTree({
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
      }),
      {
        type: 'VerticalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/toys' } as ControlElement,
        ],
      }
    );
    const schema = state.schema as ObjectElement;
    const uiSchema = state.uiSchema as EditorLayout;
    expect(schema).toBeDefined();
    expect(uiSchema).toBeDefined();
    schema.properties.get('toys')!.linkedUISchemaElements = new Set(
      uiSchema.elements[0].uuid
    );
    uiSchema.elements[0].linkedSchemaElement = schema.properties.get(
      'toys'
    )!.uuid;
    return { schema, uiSchema };
  };

  test('add non-scoped ui schema element as detail', () => {
    const { schema, uiSchema } = buildState();
    const newDetail = createLayout('HorizontalLayout');
    const addDetailAction = Actions.addDetail(
      (uiSchema as EditorLayout).elements[0].uuid,
      newDetail
    );
    const { uiSchema: newUiSchema } = combinedReducer(
      { schema, uiSchema },
      addDetailAction
    );
    expect(
      (newUiSchema as EditorLayout).elements[0].options!.detail
    ).toStrictEqual(newDetail);
  });

  test('add scoped ui schema element as detail', () => {
    const { schema, uiSchema } = buildState();
    const newDetail = createControlWithScope('#/properties/height');
    newDetail.linkedSchemaElement = (((schema as ObjectElement).properties.get(
      'toys'
    ) as ArrayElement).items as ObjectElement).properties.get('height')!.uuid;
    const addDetailAction = Actions.addDetail(
      (uiSchema as EditorLayout).elements[0].uuid,
      newDetail
    );
    const { schema: newSchema, uiSchema: newUiSchema } = combinedReducer(
      { schema, uiSchema },
      addDetailAction
    );
    expect(
      (newUiSchema as EditorLayout).elements[0].options!.detail
    ).toStrictEqual(newDetail);
    expect(
      (((newSchema as ObjectElement).properties.get('toys') as ArrayElement)
        .items as ObjectElement).properties
        .get('height')!
        .linkedUISchemaElements!.has(newDetail.uuid)
    ).toBeTruthy();
  });
});
