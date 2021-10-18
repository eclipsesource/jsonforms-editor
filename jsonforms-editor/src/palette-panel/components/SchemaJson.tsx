/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  FormControlLabel,
  IconButton,
  Switch,
  Toolbar,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import React, { useState } from 'react';

import { ErrorDialog } from '../../core/components/ErrorDialog';
import { copyToClipBoard } from '../../core/util/clipboard';
import { env } from '../../env';
import { JsonEditorDialog, TextType } from '../../text-editor';

interface UpdateOk {
  success: true;
}
interface UpdateFail {
  success: false;
  message: string;
}

export type UpdateResult = UpdateOk | UpdateFail;

interface SchemaJsonProps {
  title: string;
  schema: string;
  debugSchema?: string;
  type: TextType;
  updateSchema: (schema: any) => UpdateResult;
}

export const SchemaJson: React.FC<SchemaJsonProps> = ({
  title,
  schema,
  debugSchema,
  type,
  updateSchema,
}) => {
  const [showSchemaEditor, setShowSchemaEditor] = useState<boolean>(false);
  const [updateErrorText, setUpdateErrorText] = useState<string>('');
  const showDebugControls = debugSchema && env().DEBUG === 'true';
  const [showDebugSchema, setShowDebugSchema] = useState<boolean>(
    !!showDebugControls
  );
  const showErrorDialog = Boolean(updateErrorText);
  const onApply = (newSchema: string) => {
    const updateResult = updateSchema(newSchema);
    if (updateResult.success) {
      setShowSchemaEditor(false);
      return;
    }
    setUpdateErrorText(updateResult.message);
  };
  return (
    <>
      <Toolbar>
        <IconButton
          onClick={() =>
            copyToClipBoard(
              showDebugSchema && debugSchema ? debugSchema : schema
            )
          }
          data-cy='copy-clipboard'
        >
          <FileCopyIcon />
        </IconButton>
        <IconButton
          onClick={() => setShowSchemaEditor(true)}
          data-cy='edit-schema'
        >
          <EditIcon />
        </IconButton>
        {showDebugControls ? (
          <FormControlLabel
            control={
              <Switch
                data-cy='debug-toggle'
                checked={showDebugSchema}
                onChange={() => setShowDebugSchema((showDebug) => !showDebug)}
                color='primary'
              />
            }
            label='Debug'
          />
        ) : null}
      </Toolbar>
      <pre data-cy='schema-text'>{showDebugSchema ? debugSchema : schema}</pre>
      {showSchemaEditor && (
        <JsonEditorDialog
          open
          title={title}
          initialContent={schema}
          type={type}
          onCancel={() => setShowSchemaEditor(false)}
          onApply={onApply}
        />
      )}
      {showErrorDialog && (
        <ErrorDialog
          open
          title='Update Error'
          text={updateErrorText}
          onClose={() => setUpdateErrorText('')}
        />
      )}
    </>
  );
};
