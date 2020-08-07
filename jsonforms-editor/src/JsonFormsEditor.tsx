/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import './JsonFormsEditor.css';
import 'react-reflex/styles.css';

import { makeStyles } from '@material-ui/core';
import React, {
  ComponentType,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import {
  ExamplePaletteService,
  PaletteService,
} from './core/api/paletteService';
import { ExampleSchemaService, SchemaService } from './core/api/schemaService';
import { Footer, Header, Layout } from './core/components';
import { EditorContextInstance } from './core/context';
import { Actions, editorReducer } from './core/model';
import { SelectedElement } from './core/selection';
import { tryFindByUUID } from './core/util/schemasUtil';
import { defaultEditorTabs, EditorPanel } from './editor';
import { EditorTab } from './editor/components/EditorPanel';
import { PalettePanel } from './palette-panel';
import { PropertiesPanel } from './properties';
import {
  PropertiesService,
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from './properties/propertiesService';

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

interface JsonFormsEditorProps {
  schemaProviders: PropertySchemasProvider[];
  schemaDecorators: PropertySchemasDecorator[];
  editorTabs?: EditorTab[] | null;
  header?: ComponentType | null;
  footer?: ComponentType | null;
}
export const JsonFormsEditor: React.FC<JsonFormsEditorProps> = ({
  schemaProviders,
  schemaDecorators,
  editorTabs: editorAdditionalTabs,
  header,
  footer,
}) => {
  const [{ schema, uiSchema }, dispatch] = useReducer(editorReducer, {});
  const [selection, setSelection] = useState<SelectedElement>(undefined);
  const [schemaService] = useState<SchemaService>(new ExampleSchemaService());
  const [paletteService] = useState<PaletteService>(
    new ExamplePaletteService()
  );
  const [propertiesService] = useState<PropertiesService>(
    new PropertiesServiceImpl(schemaProviders, schemaDecorators)
  );
  const editorTabs = useMemo(() => {
    if (editorAdditionalTabs === null) {
      return undefined;
    } else if (editorAdditionalTabs === undefined) {
      return defaultEditorTabs;
    } else {
      return editorAdditionalTabs;
    }
  }, [editorAdditionalTabs]);
  const headerComponent = useMemo(() => {
    if (header === null) {
      return undefined;
    } else if (header === undefined) {
      return Header;
    } else {
      return header;
    }
  }, [header]);
  const footerComponent = useMemo(() => {
    if (footer === null) {
      return undefined;
    } else if (footer === undefined) {
      return Footer;
    } else {
      return footer;
    }
  }, [footer]);
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
        <JsonFormsEditorUi
          editorTabs={editorTabs}
          header={headerComponent}
          footer={footerComponent}
        />
      </DndProvider>
    </EditorContextInstance.Provider>
  );
};

interface JsonFormsEditorUiProps {
  editorTabs?: EditorTab[];
  header?: ComponentType;
  footer?: ComponentType;
}
const JsonFormsEditorUi: React.FC<JsonFormsEditorUiProps> = ({
  editorTabs,
  header,
  footer,
}) => {
  const classes = useStyles();
  return (
    <Layout HeaderComponent={header} FooterComponent={footer}>
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
            <EditorPanel editorTabs={editorTabs} />
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
