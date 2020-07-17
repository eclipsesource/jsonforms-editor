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
import React, { useCallback, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

import { useEffectWithUpdate } from '../../core/util/hooks';
import {
  configureRuleSchemaValidation,
  EditorApi,
} from '../../text-editor/jsonSchemaValidation';

const invalidJsonMessage = 'Not a valid rule JSON.';

const isValidRule = (rule: any) => {
  return !rule || (rule.effect && rule.condition);
};

const RuleEditor: React.FC<ControlProps> = (props) => {
  const { data, path, handleChange, errors } = props;
  const contentRef = useRef<string>('');
  const [invalidJson, setInvalidJson] = useState(false);

  const configureEditor = useCallback((editor: EditorApi) => {
    configureRuleSchemaValidation(editor);
  }, []);

  useEffectWithUpdate(
    useCallback(() => {
      contentRef.current = JSON.stringify(data, null, 2) ?? '';
      setInvalidJson(false);
    }, [data])
  );

  const onSubmitRule = useCallback(() => {
    try {
      const rule = contentRef.current
        ? JSON.parse(contentRef.current)
        : undefined;
      if (isValidRule(rule)) {
        setInvalidJson(false);
        handleChange(path, rule);
      } else {
        setInvalidJson(true);
      }
    } catch (error) {
      setInvalidJson(true);
    }
  }, [handleChange, path]);

  const isValid = errors.length === 0 && !invalidJson;
  return (
    <div>
      <Typography>Rule</Typography>
      <MonacoEditor
        language='json'
        editorWillMount={configureEditor}
        value={contentRef.current}
        onChange={(newContent) => {
          contentRef.current = newContent;
        }}
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
