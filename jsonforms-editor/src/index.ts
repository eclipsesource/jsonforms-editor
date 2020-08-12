/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsEditor } from './JsonFormsEditor';

export {
  propertySchemaProvider,
  defaultSchemaProviders,
} from './properties/schemaProviders';
export { defaultSchemaDecorators } from './properties/schemaDecorators';
export * from './core/api';
export * from './core/components';
export * from './core/context';
export * from './core/dnd';
export * from './core/icons';
export * from './core/jsonschema';
export * from './core/model';
export * from './core/selection';
export * from './core/util';
export * from './editor/components/preview';
export * from './editor';
export default JsonFormsEditor;
