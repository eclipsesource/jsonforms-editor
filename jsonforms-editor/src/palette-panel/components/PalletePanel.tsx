/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BallotIcon from '@material-ui/icons/Ballot';
import ChatIcon from '@material-ui/icons/Chat';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';

import {
  useDispatch,
  useDrawerContext,
  usePaletteService,
  useSchema,
  useUiSchema,
} from '../../core/context';
import { usePaletteService, useSchema } from '../../core/context';
import { SchemaElement } from '../../core/model';
import { JsonSchemaPanel } from './JsonSchemaPanel';
import { Properties } from '../../properties/components/Properties';
import { SchemaTreeView } from './SchemaTree';
import { UIElementsTree } from './UIElementsTree';
import { UISchemaPanel } from './UISchemaPanel';

const toText = (object: any) => JSON.stringify(object, null, 2);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  uiElementsTree: {
    marginBottom: theme.spacing(1),
  },
  palettePanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  menu: {
    margin: theme.spacing(1),
    width: theme.spacing(7) + 1,
    maxWidth: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
      maxWidth: theme.spacing(9) + 1,
    },
  },
}));
export interface PaletteTab {
  name: string;
  Component: React.ReactElement;
}
interface PalettePanelProps {
  propertyRenderers: JsonFormsRendererRegistryEntry[];
  paletteTabs?: PaletteTab[];
}
export const defaultPalettePanelTabs: PaletteTab[] = [
  {
    name: 'JSON Schema',
    Component: <JsonSchemaPanel />,
  },
  { name: 'UI Schema', Component: <UISchemaPanel /> },
];
export const PalettePanel = ({ propertyRenderers }: PalettePanelProps) => {
  const classes = useStyles();
  const { open, openDrawer } = useDrawerContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
    if (!open) {
      openDrawer();
    }
  };
  const schema: SchemaElement | undefined = useSchema();
  const paletteService = usePaletteService();
  return (
    <Grid container direction={'row'} wrap={'nowrap'}>
      <Grid item className={classes.menu}>
        <List>
          <ListItem
            button
            onClick={() => handleTabChange(0)}
            selected={selectedTab === 0}
          >
            <ListItemIcon data-cy='palette-tab'>
              <BallotIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange(1)}
            selected={selectedTab === 1}
          >
            <ListItemIcon data-cy='properties-tab'>
              <SettingsIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange(2)}
            selected={selectedTab === 2}
          >
            <ListItemIcon data-cy='schema-tab'>
              <CodeIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem
            button
            onClick={() => handleTabChange(3)}
            selected={selectedTab === 3}
          >
            <ListItemIcon data-cy='uischema-tab'>
              <ChatIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </Grid>

      {open && (
        <Grid item xs>
          {selectedTab === 0 && (
            <>
              <UIElementsTree
                className={classes.uiElementsTree}
                elements={paletteService.getPaletteElements()}
              />
              <SchemaTreeView schema={schema} />{' '}
            </>
          )}
          {selectedTab === 1 && (
            <Properties propertyRenderers={propertyRenderers} />
          )}
          {selectedTab === 2 && (
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
          )}
          {selectedTab === 3 && (
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
          )}
        </Grid>
      )}
    </Grid>
  );
};
