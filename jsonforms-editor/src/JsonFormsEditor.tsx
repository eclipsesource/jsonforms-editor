/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
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
  defaultPreviewTabs,
  EditorPanel,
  PaletteTab,
} from './editor';
import { PreviewTab } from './editor';
import { defaultPalettePanelTabs, PalettePanel } from './palette-panel';
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
    overflow: 'auto',
  },
}));

interface JsonFormsEditorProps {
  schemaService?: SchemaService;
  schemaProviders: PropertySchemasProvider[];
  schemaDecorators: PropertySchemasDecorator[];
  previewTabs?: PreviewTab[] | null;
  paletteService?: PaletteService;
  paletteTabs?: PaletteTab[] | null;
  editorRenderers?: JsonFormsRendererRegistryEntry[];
  propertyRenderers?: JsonFormsRendererRegistryEntry[];

  propertiesServiceProvider?: (
    schemaProviders: PropertySchemasProvider[],
    schemaDecorators: PropertySchemasDecorator[]
  ) => PropertiesService;
  header?: ComponentType | null;
  footer?: ComponentType | null;
}
const defaultSchemaService = new EmptySchemaService();
const defaultPaletteService = new DefaultPaletteService();
const defaultPropertiesService = (
  schemaProviders: PropertySchemasProvider[],
  schemaDecorators: PropertySchemasDecorator[]
) => new PropertiesServiceImpl(schemaProviders, schemaDecorators);

export const JsonFormsEditor: React.FC<JsonFormsEditorProps> = ({
  schemaService = defaultSchemaService,
  paletteService = defaultPaletteService,
  propertiesServiceProvider = defaultPropertiesService,
  schemaProviders,
  schemaDecorators,
  editorRenderers = defaultEditorRenderers,
  previewTabs: previewTabsProp = defaultPreviewTabs,
  paletteTabs = defaultPalettePanelTabs,
  propertyRenderers = defaultPropertyRenderers,
  header = Header,
  footer = Footer,
}) => {
  const [{ schema, uiSchema }, dispatch] = useReducer(editorReducer, {});
  const [selection, setSelection] = useState<SelectedElement>(undefined);
  const [propertiesService] = useState<PropertiesService>(
    propertiesServiceProvider(schemaProviders, schemaDecorators)
  );
  const previewTabs = previewTabsProp ?? undefined;
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
        schemaService,
        paletteService,
        propertiesService,
        propertyRenderers,
      }}
    >
      <DndProvider backend={Backend}>
        <JsonFormsEditorUi
          editorRenderers={editorRenderers}
          previewTabs={previewTabs}
          header={headerComponent}
          footer={footerComponent}
          paletteTabs={paletteTabs ?? undefined}
        />
      </DndProvider>
    </EditorContextInstance.Provider>
  );
};

interface JsonFormsEditorUiProps {
  previewTabs?: PreviewTab[];
  editorRenderers: JsonFormsRendererRegistryEntry[];
  header?: ComponentType;
  footer?: ComponentType;
  paletteTabs?: PaletteTab[];
}
const JsonFormsEditorUi: React.FC<JsonFormsEditorUiProps> = ({
  previewTabs,
  editorRenderers,
  header,
  footer,
  paletteTabs,
}) => {
  const classes = useStyles();
  return (
    <Layout
      HeaderComponent={header}
      FooterComponent={footer}
      paletteTabs={paletteTabs}
    >
      <ReflexContainer
        orientation='vertical'
        className={classes.reflexContainer}
      >
        <ReflexElement minSize={200} flex={2}>
          <div className={`${classes.pane} ${classes.centerPane}`}>
            <EditorPanel editorRenderers={editorRenderers} />
          </div>
        </ReflexElement>
        <ReflexSplitter propagate />
        <ReflexElement minSize={200} flex={1}>
          <div className={`${classes.pane} ${classes.rightPane}`}>
            <PropertiesPanel previewTabs={previewTabs} />
          </div>
        </ReflexElement>
      </ReflexContainer>
    </Layout>
  );
};
