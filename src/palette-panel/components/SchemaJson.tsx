/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
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
  const showDebugControls =
    debugSchema && process.env.NODE_ENV === 'development';
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
          onClick={() => copyToClipBoard(schema)}
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
                checked={showDebugSchema}
                onChange={() => setShowDebugSchema((showDebug) => !showDebug)}
                name='checkedB'
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
