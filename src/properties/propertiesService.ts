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

  getDataForProperties(
    uiElement: EditorUISchemaElement | undefined,
    propertiesSchema: JsonSchema
  ): any;
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
      schemaElement &&
      schemaElement.schema.type === 'string' &&
      !schemaElement.schema.format
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
    if (uiElement && uiElement.type === 'Group') {
      return {
        schema: {
          type: 'object',
          properties: {
            label: { type: 'string' },
          },
        },
      };
    }

    return undefined;
  };

  getDataForProperties = (
    uiElement: EditorUISchemaElement | undefined,
    propertiesSchema: JsonSchema
  ) => {
    if (!propertiesSchema.properties) {
      return undefined;
    }

    const data = Object.keys(propertiesSchema.properties).reduce(
      (acc, prop) => {
        if (uiElement && uiElement[prop as keyof EditorUISchemaElement]) {
          acc[prop] = uiElement[prop as keyof EditorUISchemaElement];
        }
        return acc;
      },
      {} as any
    );
    return data;
  };
}
