/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';

import {
  createControlWithScope,
  createLayout,
} from '../util/generators/uiSchema';
import { linkSchemas } from '../util/schemasUtil';
import { Actions } from './actions';
import { combinedReducer } from './reducer';
import {
  ArrayElement,
  buildSchemaTree,
  getChildren,
  ObjectElement,
  SchemaElement,
} from './schema';
import {
  buildEditorUiSchemaTree,
  EditorLayout,
  EditorUISchemaElement,
} from './uischema';

describe('add detail action', () => {
  const buildState = (): {
    schema: SchemaElement;
    uiSchema: EditorUISchemaElement;
  } => {
    const state = linkSchemas(
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
      buildEditorUiSchemaTree({
        type: 'VerticalLayout',
        elements: [
          { type: 'Control', scope: '#/properties/toys' } as ControlElement,
        ],
      } as Layout)
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

describe('SET_SCHEMA action', () => {
  test('schema elements are linked after SET_SCHEMA', () => {
    const initialState = linkSchemas(
      buildSchemaTree({
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }),
      buildEditorUiSchemaTree({
        type: 'Control',
        scope: '#/properties/name',
      } as ControlElement)
    );

    const setSchemaAction = Actions.setSchema({
      type: 'object',
      properties: {
        name: { type: 'string', default: 'foo' },
      },
    });
    const { schema, uiSchema } = combinedReducer(initialState, setSchemaAction);
    const nameProperty = getChildren(schema as SchemaElement)[0];
    expect(nameProperty?.uuid).toBeDefined();
    expect(uiSchema?.linkedSchemaElement).toStrictEqual(nameProperty?.uuid);
    expect(
      nameProperty?.linkedUISchemaElements?.values().next().value
    ).toStrictEqual(uiSchema?.uuid);
  });

  test('no unmatched UUIDs left behind after SET_SCHEMA', () => {
    const initialState = linkSchemas(
      buildSchemaTree({
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      }),
      buildEditorUiSchemaTree({
        type: 'Control',
        scope: '#/properties/name',
      } as ControlElement)
    );

    const setSchemaAction = Actions.setSchema({
      type: 'object',
      properties: {
        foo: { type: 'string' },
      },
    });
    // we rename the 'name' property -> no linked UI elements should exist
    const { schema } = combinedReducer(initialState, setSchemaAction);
    const schemaChildren = getChildren(schema as SchemaElement);
    expect(schemaChildren.length).toBe(1);
    expect(schemaChildren[0].linkedUISchemaElements).toBeUndefined();
  });
});

describe('REMOVE_UISCHEMA_ELEMENT action', () => {
  test('UIElements with broken links to SchemaElements should be removable', () => {
    //SETUP
    const brokenState = combinedReducer(
      linkSchemas(
        buildSchemaTree({
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        }),
        buildEditorUiSchemaTree({
          type: 'VerticalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/name' } as ControlElement,
          ],
        } as Layout)
      ),
      Actions.setSchema({
        type: 'object',
        properties: {},
      })
    );

    const brokenControl = (brokenState.uiSchema as EditorLayout).elements[0];
    const removeBrokenElementAction = Actions.removeUiSchemaElement(
      brokenControl
    );

    // REMOVE BROKEN CONTROL
    const { uiSchema: updatedSchema } = combinedReducer(
      brokenState,
      removeBrokenElementAction
    );

    expect((updatedSchema as EditorLayout).elements).toBeDefined();
    expect((updatedSchema as EditorLayout).elements.length).toBe(0);
  });
});
