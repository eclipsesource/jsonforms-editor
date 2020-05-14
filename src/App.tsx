import { GitLabService, GitLabServiceMock } from './core/api';
import React, { useEffect, useState } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import { Editor } from './editor';
import { EditorContextInstance } from './core/context';
import { Layout } from './core/components';
import { Properties } from './properties';
import { SchemaPanel } from './schema-panel';
import { SelectedElement } from './core/selection';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paneContainer: {
    height: '100%',
  },
  leftPane: {
    minHeight: '200px',
  },
  centerPane: {
    minHeight: '200px',
  },
  rightPane: {
    minHeight: '200px',
  },
}));

const App = () => {
  const [schema, setSchema] = useState<any>(undefined);
  const [uiSchema, setUiSchema] = useState<any>(undefined);
  const [selection, setSelection] = useState<SelectedElement>(undefined);
  const [gitLabService] = useState<GitLabService>(new GitLabServiceMock());
  useEffect(() => {
    gitLabService.getSchema().then(setSchema);
  }, [gitLabService]);
  return (
    <EditorContextInstance.Provider
      value={{
        schema,
        setSchema,
        uiSchema,
        setUiSchema,
        selection,
        setSelection,
        gitLabService,
      }}
    >
      <AppUi />
    </EditorContextInstance.Provider>
  );
};

const AppUi = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.paneContainer}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement minSize={200}>
            <div className={classes.leftPane}>
              <SchemaPanel />
            </div>
          </ReflexElement>
          <ReflexSplitter propagate />
          <ReflexElement minSize={200}>
            <div className={classes.centerPane}>
              <Editor />
            </div>
          </ReflexElement>
          <ReflexSplitter propagate />
          <ReflexElement minSize={200}>
            <div className={classes.rightPane}>
              <Properties />
            </div>
          </ReflexElement>
        </ReflexContainer>
      </div>
    </Layout>
  );
};

export default App;
