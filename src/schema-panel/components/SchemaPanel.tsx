import React, { useState } from 'react';
import { Tab, Tabs, Typography } from '@material-ui/core';

import { SchemaJson } from './SchemaJson';
import { SchemaTreeView } from './SchemaTree';
import { useSchema } from '../../core/context';

interface TabContentProps {
  children?: React.ReactNode;
  index: number;
  currentIndex: number;
}

const TabContent: React.FC<TabContentProps> = (props: TabContentProps) => {
  const { children, index, currentIndex, ...other } = props;
  return (
    <div hidden={currentIndex !== index} {...other}>
      {currentIndex === index && children}
    </div>
  );
};

export const SchemaPanel = () => {
  const schema = useSchema();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Typography variant='h6' color='inherit' noWrap>
        Schema
      </Typography>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label='Tree' />
        <Tab label='JSON' />
      </Tabs>
      <TabContent index={0} currentIndex={selectedTab}>
        <SchemaTreeView schema={schema} />
      </TabContent>
      <TabContent index={1} currentIndex={selectedTab}>
        <SchemaJson schema={schema} />
      </TabContent>
    </>
  );
};
