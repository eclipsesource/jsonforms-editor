/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
export interface TabContentProps {
  children?: React.ReactNode;
  index: number;
  currentIndex: number;
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    margin: theme.spacing(1, 0, 0, 1),
  },
}));

export const TabContent: React.FC<TabContentProps> = (
  props: TabContentProps
) => {
  const { children, index, currentIndex, ...other } = props;
  const classes = useStyles();
  return (
    <div
      hidden={currentIndex !== index}
      className={classes.tabContent}
      {...other}
    >
      {currentIndex === index && children}
    </div>
  );
};
