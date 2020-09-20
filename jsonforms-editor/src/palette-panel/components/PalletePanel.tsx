/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';

import { TabContent } from '../../core/components';
import {
  useDispatch,
  usePaletteService,
  useSchema,
  useUiSchema,
} from '../../core/context';
import { Actions, SchemaElement, toPrintableObject } from '../../core/model';
import { buildDebugUISchema } from '../../core/model/uischema';
import { useExportSchema, useExportUiSchema } from '../../core/util/hooks';
import { env } from '../../env';
import { CreateSchemaTree } from './CreateSchemaTree';
import { SchemaJson, UpdateResult } from './SchemaJson';
import { SchemaTreeView } from './SchemaTree';
import { UIElementsTree } from './UIElementsTree';

const toText = (object: any) => JSON.stringify(object, null, 2);

const useStyles = makeStyles((theme) => ({
  uiElementsTree: {
    marginBottom: theme.spacing(1),
  },
  palettePanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const PalettePanel = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const dispatch = useDispatch();
  const schema: SchemaElement | undefined = useSchema();
  const exportSchema = useExportSchema();
  const uiSchema = useUiSchema();
  const exportUiSchema = useExportUiSchema();
  const paletteService = usePaletteService();
  const showDebugSchema = env().DEBUG === 'true';
  const handleSchemaUpdate = (newSchema: string): UpdateResult => {
    try {
      const newSchemaObject = JSON.parse(newSchema);
      dispatch(Actions.setSchema(newSchemaObject));
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          message: error.message,
        };
      }
      // unknown error type
      throw error;
    }
  };

  const handleUiSchemaUpdate = (newUiSchema: string): UpdateResult => {
    try {
      const newUiSchemaObject = JSON.parse(newUiSchema);
      dispatch(Actions.setUiSchema(newUiSchemaObject));
      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          message: error.message,
        };
      }
      // unknown error type
      throw error;
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.palettePanel}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label='Palette' data-cy='palette-tab' />
        <Tab label='JSON Schema' data-cy='schema-tab' />
        <Tab label='UI Schema' data-cy='uischema-tab' />
      </Tabs>
      <TabContent index={0} currentIndex={selectedTab}>
        <UIElementsTree
          className={classes.uiElementsTree}
          elements={paletteService.getPaletteElements()}
        />
        <CreateSchemaTree></CreateSchemaTree>
        <SchemaTreeView schema={schema} />
      </TabContent>
      <TabContent index={1} currentIndex={selectedTab}>
        <SchemaJson
          title='JSON Schema'
          schema={toText(exportSchema)}
          debugSchema={
            schema && showDebugSchema
              ? toText(toPrintableObject(schema))
              : undefined
          }
          type='JSON Schema'
          updateSchema={handleSchemaUpdate}
        />
      </TabContent>
      <TabContent index={2} currentIndex={selectedTab}>
        <SchemaJson
          title='UI Schema'
          schema={toText(exportUiSchema)}
          debugSchema={
            uiSchema && showDebugSchema
              ? toText(buildDebugUISchema(uiSchema))
              : undefined
          }
          type='UI Schema'
          updateSchema={handleUiSchemaUpdate}
        />
      </TabContent>
    </div>
  );
};
