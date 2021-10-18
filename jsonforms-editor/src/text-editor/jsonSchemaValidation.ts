/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import editorApi from 'monaco-editor/esm/vs/editor/editor.api';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { jsonSchemaDraft7, ruleSchema } from '../core/jsonschema';

export type EditorApi = typeof editorApi;
export type TextType = 'JSON' | 'JSON Schema' | 'UI Schema';

/**
 * Register a new schema for the Json language, if it isn't already registered.
 * Schemas are identified by their uri and fileMatch rule, so that they don't
 * leak into unrelated Json editors.
 * @param editor
 *  The monaco editor
 * @param schemas
 *  Schemas to register
 */
export const addSchema = (
  editor: EditorApi,
  schemas: {
    uri: string;
    fileMatch?: string[];
    schema?: any;
  }[]
) => {
  const registeredSchemas =
    editor.languages.json.jsonDefaults.diagnosticsOptions.schemas;
  if (registeredSchemas === undefined) {
    editor.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [...schemas],
    });
  } else {
    for (const schema of schemas) {
      const fileMatch = schema.fileMatch;

      const gridSchema = registeredSchemas.find(
        (registeredSchema) =>
          registeredSchema.fileMatch === fileMatch &&
          registeredSchema.uri === schema.uri
      );
      if (!gridSchema) {
        registeredSchemas.push({ ...schema });
      }
    }
  }
};

/**
 * Configures the Monaco Editor to validate the input against JSON Schema Draft 7.
 */
export const configureJsonSchemaValidation = (
  editor: EditorApi,
  modelUri: Uri
) => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  addSchema(editor, [
    { ...jsonSchemaDraft7, fileMatch: [modelUri.toString()] },
  ]);
};

/**
 * Configures the Monaco Editor to validate the input against the Rule UI Schema meta-schema.
 */
export const configureRuleSchemaValidation = (
  editor: EditorApi,
  modelUri: Uri
) => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  addSchema(editor, [
    { ...jsonSchemaDraft7 },
    { ...ruleSchema, fileMatch: [modelUri.toString()] },
  ]);
};

export const getMonacoModelForUri = (
  modelUri: Uri,
  initialValue: string | undefined
) => {
  const value = initialValue ?? '';
  let model = monaco.editor.getModel(modelUri);
  if (model) {
    model.setValue(value);
  } else {
    model = monaco.editor.createModel(value, 'json', modelUri);
  }
  return model;
};
