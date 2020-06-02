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

const useStyles = makeStyles({
  tabContent: {
    margin: '10px 0 0 10px',
  },
});

export const EditorPanel = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  const classes = useStyles();
  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label='Editor' />
        <Tab label='Preview' />
      </Tabs>
      <TabContent index={0} currentIndex={selectedTab} classes={classes}>
        <Editor />
      </TabContent>
      <TabContent index={1} currentIndex={selectedTab} classes={classes}>
        <EditorPreview />
      </TabContent>
    </>
  );
};
