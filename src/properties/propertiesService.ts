/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  ControlElement,
  JsonSchema,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';

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

export class ExamplePropertiesService implements PropertiesService {
  getProperties = (
    uiElement: EditorUISchemaElement,
    schemaElement: SchemaElement | undefined
  ): PropertySchemas | undefined => {
    if (
      schemaElement?.schema.type === 'string' &&
      !schemaElement?.schema.format
    ) {
      return {
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
      };
    }
    if (uiElement?.type === 'Group') {
      return {
        schema: {
          type: 'object',
          properties: {
            label: { type: 'string' },
          },
        },
      };
    }
    if (uiElement?.type === 'Label') {
      return {
        schema: {
          type: 'object',
          properties: {
            text: { type: 'string' },
          },
        },
      };
    }

    return undefined;
  };
}
