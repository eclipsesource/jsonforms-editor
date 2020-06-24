/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

import { SchemaElement } from '../core/model';
import { LinkedUISchemaElement } from '../core/model/uischema';

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
    uiElement: LinkedUISchemaElement,
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
          properties: { multi: { type: 'boolean' } },
        },
      };
    }
    return undefined;
  };
}
