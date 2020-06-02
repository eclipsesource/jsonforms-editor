/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
export interface TabContentProps {
  children?: React.ReactNode;
  index: number;
  currentIndex: number;
  classes: Record<'tabContent', string>;
}

const styles = {
  tabContent: {
    border: 0,
    padding: 0,
  },
};

export const TabContent = withStyles(styles)((props: TabContentProps) => {
  const { children, index, currentIndex, classes, ...other } = props;
  return (
    <div
      hidden={currentIndex !== index}
      className={classes.tabContent}
      {...other}
    >
      {currentIndex === index && children}
    </div>
  );
});
