/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement } from '@jsonforms/core';

import { buildSchemaTree, getChildren, SchemaElement } from '../model';
import { buildEditorUiSchemaTree } from '../model/uischema';
import { linkSchemas } from './schemasUtil';

describe('build and link ui schema', () => {
  test('buildAndLinkUISchema should not fail for undefined parameters', () => {
    const state = linkSchemas(undefined, undefined);
    expect(state).toBeDefined();
    expect(state.schema).toBeUndefined();
    expect(state.uiSchema).toBeUndefined();
  });

  test('schema and ui schema should be linked for control', () => {
    const { schema, uiSchema } = linkSchemas(
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
    expect(schema).toBeDefined();
    const nameProperty = getChildren(schema as SchemaElement)[0];
    expect(nameProperty?.uuid).toBeDefined();
    expect(uiSchema).toBeDefined();
    expect(uiSchema?.uuid).toBeDefined();
    expect(uiSchema?.linkedSchemaElement).toBe(nameProperty?.uuid);
    expect(nameProperty?.linkedUISchemaElements?.size).toBe(1);
    expect(nameProperty?.linkedUISchemaElements?.values().next().value).toBe(
      uiSchema?.uuid
    );
  });
});
