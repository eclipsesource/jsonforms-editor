/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import './JsonFormsEditor.css';
import 'react-reflex/styles.css';

import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { makeStyles } from '@material-ui/core';
import React, { ComponentType, useEffect, useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import {
  CategorizationService,
  CategorizationServiceImpl,
} from './core/api/categorizationService';
import {
  DefaultPaletteService,
  PaletteService,
} from './core/api/paletteService';
import { EmptySchemaService, SchemaService } from './core/api/schemaService';
import { Footer, Header, Layout } from './core/components';
import { EditorContextInstance } from './core/context';
import { Actions, editorReducer } from './core/model';
import { SelectedElement } from './core/selection';
import { tryFindByUUID } from './core/util/schemasUtil';
import {
  defaultEditorRenderers,
  defaultEditorTabs,
  EditorPanel,
} from './editor';
import { EditorTab } from './editor/components/EditorPanel';
import {
  defaultPalettePanelTabs,
  PalettePanel,
  PaletteTab,
} from './palette-panel';
import { defaultPropertyRenderers, PropertiesPanel } from './properties';
import {
  PropertiesService,
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from './properties/propertiesService';

const useStyles = makeStyles((theme) => ({
  pane: {
    minHeight: '200px',
    margin: theme.spacing(0, 1, 0, 1),
    height: '100%',
  },
  leftPane: {},
  centerPane: {
    alignItems: 'stretch',
  },
  rightPane: {},
  reflexContainer: {
    flex: '1',
    alignItems: 'stretch',
  },
}));

interface JsonFormsEditorProps {
  schemaService?: SchemaService;
  schemaProviders: PropertySchemasProvider[];
  schemaDecorators: PropertySchemasDecorator[];
  editorTabs?: EditorTab[] | null;
  paletteService?: PaletteService;
  paletteTabs?: PaletteTab[] | null;
  editorRenderers?: JsonFormsRendererRegistryEntry[];
  propertyRenderers?: JsonFormsRendererRegistryEntry[];

  propertiesServiceProvider?: (
    schemaProviders: PropertySchemasProvider[],
    schemaDecorators: PropertySchemasDecorator[]
  ) => PropertiesService;
  categorizationService?: CategorizationService;
  header?: ComponentType | null;
  footer?: ComponentType | null;
}
const defaultSchemaService = new EmptySchemaService();
const defaultPaletteService = new DefaultPaletteService();
const defaultPropertiesService = (
  schemaProviders: PropertySchemasProvider[],
  schemaDecorators: PropertySchemasDecorator[]
) => new PropertiesServiceImpl(schemaProviders, schemaDecorators);
const defaultCategorizationService = new CategorizationServiceImpl();

export const JsonFormsEditor: React.FC<JsonFormsEditorProps> = ({
  schemaService = defaultSchemaService,
  paletteService = defaultPaletteService,
  categorizationService = defaultCategorizationService,
  propertiesServiceProvider = defaultPropertiesService,
  schemaProviders,
  schemaDecorators,
  editorRenderers = defaultEditorRenderers,
  editorTabs: editorTabsProp = defaultEditorTabs,
  paletteTabs = defaultPalettePanelTabs,
  propertyRenderers = defaultPropertyRenderers,
  header = Header,
  footer = Footer,
}) => {
  const [{ schema, uiSchema }, dispatch] = useReducer(editorReducer, {
    categorizationService: defaultCategorizationService,
  });
  const [selection, setSelection] = useState<SelectedElement>(undefined);

  const [propertiesService] = useState<PropertiesService>(
    propertiesServiceProvider(schemaProviders, schemaDecorators)
  );
  const editorTabs = editorTabsProp ?? undefined;
  const headerComponent = header ?? undefined;
  const footerComponent = footer ?? undefined;

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
        categorizationService,
        schemaService,
        paletteService,
        propertiesService,
      }}
    >
      <DndProvider backend={Backend}>
        <JsonFormsEditorUi
          editorRenderers={editorRenderers}
          editorTabs={editorTabs}
          propertyRenderers={propertyRenderers}
          header={headerComponent}
          footer={footerComponent}
          paletteTabs={paletteTabs ?? undefined}
        />
      </DndProvider>
    </EditorContextInstance.Provider>
  );
};

interface JsonFormsEditorUiProps {
  editorTabs?: EditorTab[];
  editorRenderers: JsonFormsRendererRegistryEntry[];
  propertyRenderers: JsonFormsRendererRegistryEntry[];
  header?: ComponentType;
  footer?: ComponentType;
  paletteTabs?: PaletteTab[];
}
const JsonFormsEditorUi: React.FC<JsonFormsEditorUiProps> = ({
  editorTabs,
  editorRenderers,
  propertyRenderers,
  header,
  footer,
  paletteTabs,
}) => {
  const classes = useStyles();
  return (
    <Layout HeaderComponent={header} FooterComponent={footer}>
      <ReflexContainer
        orientation='vertical'
        className={classes.reflexContainer}
      >
        <ReflexElement minSize={200} flex={1}>
          <div className={`${classes.pane} ${classes.leftPane}`}>
            <PalettePanel paletteTabs={paletteTabs} />
          </div>
        </ReflexElement>
        <ReflexSplitter propagate />
        <ReflexElement minSize={200} flex={2}>
          <div className={`${classes.pane} ${classes.centerPane}`}>
            <EditorPanel
              editorTabs={editorTabs}
              editorRenderers={editorRenderers}
            />
          </div>
        </ReflexElement>
        <ReflexSplitter propagate />
        <ReflexElement minSize={200} flex={1}>
          <div className={`${classes.pane} ${classes.rightPane}`}>
            <PropertiesPanel propertyRenderers={propertyRenderers} />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </Layout>
  );
};
