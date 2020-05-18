import { SchemaElement } from './schema';
import { UISchemaElement } from '@jsonforms/core';

export interface LinkedUISchemaElement extends UISchemaElement {
  linked?: SchemaElement;
}
