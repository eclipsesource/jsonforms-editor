/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { Layout } from '@jsonforms/core';

import { EditorUISchemaElement } from '../core/model/uischema';
import {
  NOT_APPLICABLE,
  PropertySchemas,
  PropertySchemasProvider,
} from './propertiesService';

export const propertySchemaProvider: PropertySchemasProvider = {
  tester: (uiElement: EditorUISchemaElement): number => {
    if (uiElement) {
      // default schema provider
      return 1;
    }
    return NOT_APPLICABLE;
  },
  getPropertiesSchemas: (): PropertySchemas => ({
    schema: {
      type: 'object',
      properties: {},
    },
    uiSchema: {
      type: 'VerticalLayout',
      elements: [],
    } as Layout,
  }),
};

export const defaultSchemaProviders = [propertySchemaProvider];
