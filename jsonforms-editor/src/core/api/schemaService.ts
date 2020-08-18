/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

export interface SchemaService {
  getSchema(): Promise<any>;
  getUiSchema(): Promise<any>;
}

export class EmptySchemaService implements SchemaService {
  getSchema = async () => undefined;
  getUiSchema = async () => undefined;
}
