/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { ControlProps, rankWith, scopeEndsWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Button, FormHelperText, Grid, Typography } from '@material-ui/core';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback, useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

import {
  configureRuleSchemaValidation,
  EditorApi,
  getMonacoModelForUri,
} from '../../text-editor/jsonSchemaValidation';

const invalidJsonMessage = 'Not a valid rule JSON.';

const isValidRule = (rule: any) => {
  return !rule || (rule.effect && rule.condition);
};

const RuleEditor: React.FC<ControlProps> = (props) => {
  const { data, path, handleChange, errors } = props;
  const [invalidJson, setInvalidJson] = useState(false);
  const modelUri = Uri.parse('json://core/specification/rules.json');

  const configureEditor = useCallback(
    (editor: EditorApi) => {
      configureRuleSchemaValidation(editor, modelUri);
    },
    [modelUri]
  );

  const model = useMemo(
    () => getMonacoModelForUri(modelUri, JSON.stringify(data, null, 2)),
    [data, modelUri]
  );

  const setModel = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      if (!model.isDisposed()) {
        editor.setModel(model);
      }
    },
    [model]
  );

  const onSubmitRule = useCallback(() => {
    try {
      const value = model.getValue();
      const rule = value ? JSON.parse(value) : undefined;
      if (isValidRule(rule)) {
        setInvalidJson(false);
        handleChange(path, rule);
      } else {
        setInvalidJson(true);
      }
    } catch (error) {
      setInvalidJson(true);
    }
  }, [handleChange, model, path]);

  const isValid = errors.length === 0 && !invalidJson;
  return (
    <div>
      <Typography>Rule</Typography>
      <MonacoEditor
        language='json'
        editorWillMount={configureEditor}
        editorDidMount={setModel}
        height={200}
        options={{
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
        }}
      />
      <Grid container direction='row' spacing={2} alignItems='center'>
        <Grid item>
          <Button variant='contained' onClick={onSubmitRule}>
            Apply
          </Button>
        </Grid>
        <Grid item>
          <FormHelperText error={true} hidden={isValid}>
            {errors.length !== 0 ? errors : invalidJsonMessage}
          </FormHelperText>
        </Grid>
      </Grid>
    </div>
  );
};

const RuleEditorRenderer = RuleEditor;
export const RuleEditorRendererRegistration = {
  tester: rankWith(100, scopeEndsWith('rule')),
  renderer: withJsonFormsControlProps(RuleEditorRenderer),
};
