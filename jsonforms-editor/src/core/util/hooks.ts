/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSchema, useUiSchema } from '../context';
import { buildJsonSchema, SchemaElement } from '../model';
import { buildUiSchema, EditorUISchemaElement } from '../model/uischema';

const doBuildJsonSchema = (schema: SchemaElement | undefined) =>
  schema ? buildJsonSchema(schema) : schema;

const doBuildUiSchema = (uiSchema: EditorUISchemaElement | undefined) =>
  uiSchema ? buildUiSchema(uiSchema) : undefined;

/**
 * Json Schema for export
 */
export const useExportSchema = () => {
  const schema = useSchema();
  // return useTransform(schema, doBuildJsonSchema);
  return doBuildJsonSchema(schema);
};

/**
 * Ui Schema for export
 */
export const useExportUiSchema = () => {
  const uiSchema = useUiSchema();
  // return useTransform(uiSchema, doBuildUiSchema);
  return doBuildUiSchema(uiSchema);
};

/** Force a rerender */
export const useUpdate = () => {
  const [, setCount] = useState(0);
  const update = useCallback(() => {
    setCount((count) => count + 1);
  }, []);
  return update;
};

/** Executes the callback and forces a rerender whenever the callback changes */
export const useEffectWithUpdate = (effectCallback: () => void) => {
  const update = useUpdate();
  useEffect(() => {
    effectCallback();
    update();
  }, [effectCallback, update]);
};
