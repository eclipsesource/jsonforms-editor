import { Actions, editorReducer } from './core/model';
import { ExampleSchemaService, SchemaService } from './core/api/schemaService';
import React, { useEffect, useReducer, useState } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Editor } from './editor';
import { EditorContextInstance } from './core/context';
import { Layout } from './core/components';
import { Properties } from './properties';
import { SchemaPanel } from './schema-panel';
import { SelectedElement } from './core/selection';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  leftPane: {
    minHeight: '200px',
  },
  centerPane: {
    minHeight: '200px',
  },
  rightPane: {
    minHeight: '200px',
  },
  reflexContainer: {
    flex: '1',
  },
}));

const App = () => {
  const [{ schema, uiSchema }, dispatch] = useReducer(editorReducer, {});

  const [selection, setSelection] = useState<SelectedElement>(undefined);
  const [schemaService] = useState<SchemaService>(new ExampleSchemaService());
  useEffect(() => {
    schemaService
      .getSchema()
      .then((schema) => dispatch(Actions.setSchema(schema)));
    schemaService
      .getUiSchema()
      .then((uiSchema) => dispatch(Actions.setUiSchema(uiSchema)));
  }, [schemaService]);
  return (
    <EditorContextInstance.Provider
      value={{
        schema,
        uiSchema,
        dispatch,
        selection,
        setSelection,
        schemaService,
      }}
    >
      <DndProvider backend={Backend}>
        <AppUi />
      </DndProvider>
    </EditorContextInstance.Provider>
  );
};

const AppUi = () => {
  const classes = useStyles();
  return (
    <Layout>
      <ReflexContainer
        orientation='vertical'
        className={classes.reflexContainer}
      >
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
    </Layout>
  );
};

export default App;
