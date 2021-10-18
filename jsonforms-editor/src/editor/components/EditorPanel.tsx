/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';

import { TabContent } from '../../core/components';
import { Editor } from './Editor';

const useStyles = makeStyles(() => ({
  editorPanel: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr ',
  },
}));

export interface EditorTab {
  name: string;
  Component: React.ComponentType;
}

interface EditorPanelProps {
  editorTabs?: EditorTab[];
  editorRenderers: JsonFormsRendererRegistryEntry[];
}
export const EditorPanel: React.FC<EditorPanelProps> = ({
  editorTabs,
  editorRenderers,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  const classes = useStyles();
  return (
    <div className={classes.editorPanel}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label='Editor' />
        {editorTabs
          ? editorTabs.map((tab) => (
              <Tab key={`tab-${tab.name}`} label={tab.name} />
            ))
          : null}
      </Tabs>
      <TabContent index={0} currentIndex={selectedTab}>
        <Editor editorRenderers={editorRenderers} />
      </TabContent>
      {editorTabs
        ? editorTabs.map((tab, index) => (
            <TabContent
              key={`content-${index + 1}`}
              index={index + 1}
              currentIndex={selectedTab}
            >
              <tab.Component />
            </TabContent>
          ))
        : null}
    </div>
  );
};
