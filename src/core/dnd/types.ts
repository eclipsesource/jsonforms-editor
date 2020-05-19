import { SchemaElement } from '../model';

export const SCHEMA_ELEMENT: 'schemaElement' = 'schemaElement';

export type DndType = DragSchemaElement;

export interface DragSchemaElement {
  type: 'schemaElement';
  element: SchemaElement;
}

const dragSchemaElement = (schemaElement: SchemaElement) => ({
  type: SCHEMA_ELEMENT,
  schemaElement,
});

export const DndItems = {
  dragSchemaElement,
};
