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
import { assign, cloneDeep, isEqual } from 'lodash';

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

const emptySchemas: PropertySchemas = {
  schema: {
    type: 'object',
    properties: {},
  },
  uiSchema: {
    type: 'VerticalLayout',
    elements: [],
  } as Layout,
};

const createControl = (controlScope: string): ControlElement => ({
  type: 'Control',
  scope: controlScope,
});

interface PropertiesSchemasDecorators {
  decorate: (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => PropertySchemas;
}

const multilineStringOption: PropertiesSchemasDecorators = {
  decorate: (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => {
    if (
      schemaElement?.schema.type === 'string' &&
      !schemaElement?.schema.format &&
      uiElement.type === 'Control'
    ) {
      if (!schemas.schema.properties) schemas.schema.properties = {};
      if (!schemas.schema.properties.options)
        schemas.schema.properties.options = {};
      assign(schemas.schema.properties.options, {
        type: 'object',
        properties: {
          multi: { type: 'boolean' },
        },
      });

      (schemas.uiSchema as Layout).elements.push(
        createControl('#/properties/options/properties/multi')
      );
    }
    return schemas;
  },
};

const labelUIElementDecorator: PropertiesSchemasDecorators = {
  decorate: (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => {
    if (uiElement?.type === 'Label') {
      assign(schemas.schema.properties, { text: { type: 'string' } });

      (schemas.uiSchema as Layout).elements.push(
        createControl('#/properties/text')
      );
    }
    return schemas;
  },
};

const ruleDecorator: PropertiesSchemasDecorators = {
  decorate: (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => {
    assign(schemas.schema.properties, {
      rule: {
        type: 'object',
      },
    });
    (schemas.uiSchema as Layout).elements.push(
      createControl('#/properties/rule')
    );
    return schemas;
  },
};

const labelDecorator: PropertiesSchemasDecorators = {
  decorate: (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => {
    if (uiElement?.type === 'Group') {
      if (!schemas.schema.properties) schemas.schema.properties = {};
      assign(schemas.schema.properties, { label: { type: 'string' } });

      (schemas.uiSchema as Layout).elements.push(
        createControl('#/properties/label')
      );
    }
    return schemas;
  },
};

const decorators: PropertiesSchemasDecorators[] = [
  labelDecorator,
  multilineStringOption,
  labelUIElementDecorator,
  ruleDecorator,
];
export class ExamplePropertiesService implements PropertiesService {
  getProperties = (
    uiElement: EditorUISchemaElement,
    schemaElement: SchemaElement | undefined
  ): PropertySchemas | undefined => {
    const decoratedSchemas = decorators.reduce(
      (schemas, decorator) =>
        decorator.decorate(schemas, uiElement, schemaElement),
      cloneDeep(emptySchemas)
    );
    return isEqual(decoratedSchemas, emptySchemas)
      ? undefined
      : decoratedSchemas;
  };
}
