/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { DialogContent, Fade, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useMemo } from 'react';
import MonacoEditor from 'react-monaco-editor';

import {
  configureJsonSchemaValidation,
  EditorApi,
  getMonacoModelForUri,
  TextType,
} from '../jsonSchemaValidation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    dialogPaper: {
      height: '100%', // 'MonacoEditor' uses height to grow
      minHeight: '95vh',
      maxHeight: '95vh',
    },
    dialogContent: {
      overflow: 'hidden',
      marginTop: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

interface JsonEditorDialogProps {
  open: boolean;
  title: string;
  initialContent: any;
  type: TextType;
  onApply: (newContent: any) => void;
  onCancel: () => void;
}

export const JsonEditorDialog: React.FC<JsonEditorDialogProps> = ({
  open,
  title,
  initialContent,
  type,
  onApply,
  onCancel,
}) => {
  const classes = useStyles();

  const modelUri = Uri.parse('json://core/specification/schema.json');

  const configureEditor = useCallback(
    (editor: EditorApi) => {
      if (type === 'JSON Schema') {
        configureJsonSchemaValidation(editor, modelUri);
      }
    },
    [type, modelUri]
  );

  const model = useMemo(
    () => getMonacoModelForUri(modelUri, initialContent),
    [initialContent, modelUri]
  );

  const setModel = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      if (!model.isDisposed()) {
        editor.setModel(model);
      }
    },
    [model]
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      classes={{ paper: classes.dialogPaper }}
      maxWidth='lg'
      fullWidth
    >
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onCancel}
            aria-label='cancel'
            data-cy='cancel'
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' noWrap>
            {title} Text Edit
          </Typography>
          <Button
            variant='contained'
            onClick={() => onApply(model.getValue())}
            data-cy='apply'
          >
            Apply
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialogContent}>
        <MonacoEditor
          language='json'
          editorDidMount={(editor) => {
            setModel(editor);
            editor.focus();
          }}
          editorWillMount={configureEditor}
        />
      </DialogContent>
    </Dialog>
  );
};
