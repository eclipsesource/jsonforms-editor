/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useState } from 'react';

import { TabContent } from '../../core/components';
import { PreviewTab } from '../../editor';

const useStyles = makeStyles((theme) => ({
  palettePanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));
export interface PropertiesPanelProps {
  previewTabs?: PreviewTab[];
}
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  previewTabs,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };
  const classes = useStyles();
  return (
    <div className={classes.palettePanel}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {previewTabs
          ? previewTabs.map((tab) => (
              <Tab key={`tab-${tab.name}`} label={tab.name} />
            ))
          : null}
      </Tabs>
      {previewTabs
        ? previewTabs.map((tab, index) => (
            <TabContent
              key={`content-${index}`}
              index={index}
              currentIndex={selectedTab}
            >
              <tab.Component />
            </TabContent>
          ))
        : null}
    </div>
  );
};
