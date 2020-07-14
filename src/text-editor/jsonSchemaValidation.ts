/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import editorApi from 'monaco-editor/esm/vs/editor/editor.api';

import { jsonSchemaDraft7, ruleSchema } from '../core/jsonschema';

export type EditorApi = typeof editorApi;
export type TextType = 'JSON' | 'JSON Schema' | 'UI Schema';

/**
 * Configures the Monaco Editor to validate the input against JSON Schema Draft 7.
 */
export const configureJsonSchemaValidation = (editor: EditorApi) => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  editor.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{ ...jsonSchemaDraft7, fileMatch: ['*'] }],
  });
};

/**
 * Configures the Monaco Editor to validate the input against the Rule UI Schema meta-schema.
 */
export const configureRuleSchemaValidation = (editor: EditorApi) => {
  /** Note that the Monaco Editor only supports JSON Schema Draft 7 itself,
   * so if we also want to support a later standard we still have to formalize
   * it in JSON Schema Draft 7*/
  editor.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    enableSchemaRequest: true,
    schemas: [{ ...ruleSchema, fileMatch: ['*'] }, { ...jsonSchemaDraft7 }],
  });
};
