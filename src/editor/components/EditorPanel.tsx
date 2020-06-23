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
import { Editor } from './Editor';
import { EditorPreview } from './EditorPreview';

const useStyles = makeStyles(() => ({
  editorPanel: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto 1fr ',
  },
}));

export const EditorPanel = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  const classes = useStyles();
  return (
    <div className={classes.editorPanel}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label='Editor' />
        <Tab label='Preview' />
      </Tabs>
      <TabContent index={0} currentIndex={selectedTab}>
        <Editor />
      </TabContent>
      <TabContent index={1} currentIndex={selectedTab}>
        <EditorPreview />
      </TabContent>
    </div>
  );
};
