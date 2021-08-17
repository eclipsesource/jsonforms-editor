/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import React from 'react';

import {
  Actions,
  jsonToText,
  useDispatch,
  useExportUiSchema,
  useUiSchema,
} from '../..';
import { buildDebugUISchema } from '../../core/model/uischema';
import { env } from '../../env';
import { SchemaJson, UpdateResult } from './SchemaJson';

export interface UISchemaPanelProps {
  title?: string;
}
export const UISchemaPanel: React.FC<UISchemaPanelProps> = ({
  title = 'UI Schema',
}) => {
  const dispatch = useDispatch();
  const exportUiSchema = useExportUiSchema();
  const uiSchema = useUiSchema();
  const showDebugSchema = env().IS_DEBUG;
  const handleUiSchemaUpdate = (newUiSchema: string): UpdateResult => {
    try {
      const newUiSchemaObject = JSON.parse(newUiSchema);
      dispatch(Actions.setUiSchema(newUiSchemaObject));
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          message: error.message,
        };
      }
      // unknown error type
      throw error;
    }
  };
  return (
    <SchemaJson
      title={title}
      schema={jsonToText(exportUiSchema)}
      debugSchema={
        uiSchema && showDebugSchema
          ? jsonToText(buildDebugUISchema(uiSchema))
          : undefined
      }
      type='UI Schema'
      updateSchema={handleUiSchemaUpdate}
    />
  );
};
