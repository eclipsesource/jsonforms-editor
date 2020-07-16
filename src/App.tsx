/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core';
import React, { useEffect, useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import {
  ExamplePaletteService,
  PaletteService,
} from './core/api/paletteService';
import { ExampleSchemaService, SchemaService } from './core/api/schemaService';
import { Layout } from './core/components';
import { EditorContextInstance } from './core/context';
import { Actions, editorReducer } from './core/model';
import { SelectedElement } from './core/selection';
import { tryFindByUUID } from './core/util/clone';
import { EditorPanel } from './editor';
import { PalettePanel } from './palette-panel';
import { PropertiesPanel } from './properties';
import {
  PropertiesSchemasDecorator,
  PropertiesSchemasProvider,
  PropertiesService,
  PropertiesServiceImpl,
} from './properties/propertiesService';
import {
  labelDecorator,
  labelUIElementDecorator,
  multilineStringOptionDecorator,
  ruleDecorator,
} from './properties/schemaDecorators';
import { propertiesSchemaProvider } from './properties/schemaProviders';

const useStyles = makeStyles((theme) => ({
  leftPane: {
    minHeight: '200px',
    margin: theme.spacing(0, 1, 0, 1),
  },
  centerPane: {
    minHeight: '200px',
    margin: theme.spacing(0, 1, 0, 1),
    height: '100%',
    alignItems: 'stretch',
  },
  rightPane: {
    minHeight: '200px',
    margin: theme.spacing(0, 1, 0, 1),
  },
  reflexContainer: {
    flex: '1',
    alignItems: 'stretch',
  },
}));

const defaultSchemaDecorators: PropertiesSchemasDecorator[] = [
  labelDecorator,
  multilineStringOptionDecorator,
  labelUIElementDecorator,
  ruleDecorator,
];
const defaultSchemaProviders: PropertiesSchemasProvider[] = [
  propertiesSchemaProvider,
];
interface AppProps {
  schemaProviders?: PropertiesSchemasProvider[];
  schemaDecorators?: PropertiesSchemasDecorator[];
}
const App: React.FC<AppProps> = ({ schemaProviders, schemaDecorators }) => {
  const decorators = schemaDecorators ?? defaultSchemaDecorators;
  const providers = schemaProviders ?? defaultSchemaProviders;
  const [{ schema, uiSchema }, dispatch] = useReducer(editorReducer, {});
  const [selection, setSelection] = useState<SelectedElement>(undefined);
  const [schemaService] = useState<SchemaService>(new ExampleSchemaService());
  const [paletteService] = useState<PaletteService>(
    new ExamplePaletteService()
  );
  const [propertiesService] = useState<PropertiesService>(
    new PropertiesServiceImpl(providers, decorators)
  );
  useEffect(() => {
    schemaService
      .getSchema()
      .then((schema) => dispatch(Actions.setSchema(schema)));
    schemaService
      .getUiSchema()
      .then((uiSchema) => dispatch(Actions.setUiSchema(uiSchema)));
  }, [schemaService]);
  useEffect(() => {
    setSelection((oldSelection) => {
      if (!oldSelection) {
        return oldSelection;
      }
      const idInNewSchema = tryFindByUUID(uiSchema, oldSelection.uuid);
      if (!idInNewSchema) {
        // element does not exist anymore - clear old selection
        return undefined;
      }
      return oldSelection;
    });
  }, [uiSchema]);
  return (
    <EditorContextInstance.Provider
      value={{
        schema,
        uiSchema,
        dispatch,
        selection,
        setSelection,
        schemaService,
        paletteService,
        propertiesService,
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
            <PalettePanel />
          </div>
        </ReflexElement>
        <ReflexSplitter propagate />
        <ReflexElement minSize={200}>
          <div className={classes.centerPane}>
            <EditorPanel />
          </div>
        </ReflexElement>
        <ReflexSplitter propagate />
        <ReflexElement minSize={200}>
          <div className={classes.rightPane}>
            <PropertiesPanel />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </Layout>
  );
};

export default App;
