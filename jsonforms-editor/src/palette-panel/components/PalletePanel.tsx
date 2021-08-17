/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import BallotIcon from '@material-ui/icons/Ballot';
import ChatIcon from '@material-ui/icons/Chat';
import CodeIcon from '@material-ui/icons/Code';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';

import {
  usePaletteService,
  usePropertyRenderers,
  useSchema,
} from '../../core/context';
import { SchemaElement } from '../../core/model';
import { PaletteTab } from '../../editor';
import { Properties } from '../../properties/components/Properties';
import { JsonSchemaPanel } from './JsonSchemaPanel';
import { SchemaTreeView } from './SchemaTree';
import { UIElementsTree } from './UIElementsTree';
import { UISchemaPanel } from './UISchemaPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
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
const usePaletteStyles = makeStyles((theme) => ({
  uiElementsTree: {
    marginBottom: theme.spacing(1),
  },
}));
interface PalettePanelProps {
  paletteTabs?: PaletteTab[];
  open: boolean;
  openDrawer: () => void;
  onSelected: (tabName: string) => void;
}
export const defaultPalettePanelTabs: PaletteTab[] = [
  {
    name: 'Palette',
    Component: () => {
      const classes = usePaletteStyles();
      const schema: SchemaElement | undefined = useSchema();
      const paletteService = usePaletteService();
      return (
        <>
          <UIElementsTree
            className={classes.uiElementsTree}
            elements={paletteService.getPaletteElements()}
          />
          <SchemaTreeView schema={schema} />{' '}
        </>
      );
    },
    icon: <BallotIcon data-cy='palette-tab' />,
  },
  {
    name: 'Properties',
    Component: () => {
      const propertyRenderers = usePropertyRenderers();
      return <Properties propertyRenderers={propertyRenderers} />;
    },
    icon: <SettingsIcon data-cy='properties-tab' />,
  },
  {
    name: 'JSON Schema',
    Component: () => <JsonSchemaPanel />,
    icon: <CodeIcon data-cy='schema-tab' />,
  },
  {
    name: 'UI Schema',
    Component: () => <UISchemaPanel />,
    icon: <ChatIcon data-cy='uischema-tab' />,
  },
];
export const PalettePanel = ({
  paletteTabs,
  open,
  openDrawer,
  onSelected,
}: PalettePanelProps) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (newValue: number, name: string) => {
    setSelectedTab(newValue);
    if (!open) {
      openDrawer();
    }
    onSelected(name);
  };

  return (
    <Grid container direction={'row'} wrap={'nowrap'}>
      <Grid item className={classes.menu}>
        <List>
          {paletteTabs?.map((pt, i) => {
            return (
              <ListItem
                button
                onClick={() => handleTabChange(i, pt.name)}
                selected={selectedTab === i}
                key={`${pt.name.toLowerCase()}_tab`}
              >
                <Tooltip title={pt.name} aria-label={pt.name.toLowerCase()}>
                  {pt.icon}
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Grid>

      {open && (
        <Grid item xs>
          {paletteTabs?.map((pt, i) => {
            if (selectedTab === i)
              return (
                <pt.Component key={`${pt.name.toLowerCase()}_component`} />
              );
            return undefined;
          })}
        </Grid>
      )}
    </Grid>
  );
};
