/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement, Layout } from '@jsonforms/core';
import { assign } from 'lodash';

import { SchemaElement } from '../core/model';
import { EditorUISchemaElement } from '../core/model/uischema';
import {
  PropertiesSchemasDecorator,
  PropertySchemas,
} from './propertiesService';

export const multilineStringOptionDecorator: PropertiesSchemasDecorator = {
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
      if (!schemas.schema.properties) {
        schemas.schema.properties = {};
      }
      if (!schemas.schema.properties.options) {
        schemas.schema.properties.options = {};
      }
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

export const labelUIElementDecorator: PropertiesSchemasDecorator = {
  decorate: (schemas: PropertySchemas, uiElement: EditorUISchemaElement) => {
    if (uiElement?.type === 'Label') {
      assign(schemas.schema.properties, { text: { type: 'string' } });

      (schemas.uiSchema as Layout).elements.push(
        createControl('#/properties/text')
      );
    }
    return schemas;
  },
};

export const ruleDecorator: PropertiesSchemasDecorator = {
  decorate: (schemas: PropertySchemas) => {
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

export const labelDecorator: PropertiesSchemasDecorator = {
  decorate: (schemas: PropertySchemas, uiElement: EditorUISchemaElement) => {
    if (
      ['Group', 'Control', 'Categorization', 'Category'].includes(
        uiElement?.type
      )
    ) {
      if (!schemas.schema.properties) {
        schemas.schema.properties = {};
      }
      assign(schemas.schema.properties, { label: { type: 'string' } });

      (schemas.uiSchema as Layout).elements.push(
        createControl('#/properties/label')
      );
    }
    return schemas;
  },
};

const createControl = (controlScope: string): ControlElement => ({
  type: 'Control',
  scope: controlScope,
});
