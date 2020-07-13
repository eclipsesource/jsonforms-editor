/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  ControlElement,
  isLayout,
  JsonSchema,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';
import { assign } from 'lodash';

import { SchemaElement } from '../core/model';
import { EditorUISchemaElement } from '../core/model/uischema';

export interface PropertiesService {
  getProperties(
    uiElement: any,
    schemaElement: any
  ): PropertySchemas | undefined;
}

interface PropertySchemas {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
}

const ruleSchema = {
  rule: {
    type: 'object',
  },
};

const ruleUiSchema = {
  type: 'Control',
  scope: '#/properties/rule',
};

const withRule = (schemas: PropertySchemas) => {
  const schema = schemas.schema.properties
    ? schemas.schema
    : {
        type: 'object',
        properties: {},
      };
  const uiSchema =
    schemas.uiSchema && isLayout(schemas.uiSchema)
      ? schemas.uiSchema
      : {
          type: 'VerticalLayout',
          elements: [],
        };

  assign(schema.properties, ruleSchema);
  (uiSchema as Layout).elements.push(ruleUiSchema);

  return { schema, uiSchema };
};

export class ExamplePropertiesService implements PropertiesService {
  getProperties = (
    uiElement: EditorUISchemaElement,
    schemaElement: SchemaElement | undefined
  ): PropertySchemas | undefined => {
    if (
      schemaElement?.schema.type === 'string' &&
      !schemaElement?.schema.format
    ) {
      return withRule({
        schema: {
          type: 'object',
          properties: {
            options: {
              type: 'object',
              properties: {
                multi: { type: 'boolean' },
              },
            },
          },
        },
        uiSchema: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/options/properties/multi',
            } as ControlElement,
          ],
        } as Layout,
      });
    }
    if (uiElement?.type === 'Group') {
      return withRule({
        schema: {
          type: 'object',
          properties: {
            label: { type: 'string' },
          },
        },
      });
    }
    if (uiElement?.type === 'Label') {
      return withRule({
        schema: {
          type: 'object',
          properties: {
            text: { type: 'string' },
          },
        },
      });
    }

    return {
      schema: {
        type: 'object',
        properties: ruleSchema,
      },
    };
  };
}
