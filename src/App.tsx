import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import { Editor } from './editor';
import { Layout } from './core/components';
import { Properties } from './properties';
import React from 'react';
import { SchemaPanel } from './schema-panel';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paneContainer: {
    height: '100%',
  },
  leftPane: {
    minHeight: '200px',
  },
  centerPane: {
    minHeight: '200px',
  },
  rightPane: {
    minHeight: '200px',
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <Layout>
      <div className={classes.paneContainer}>
        <ReflexContainer orientation='vertical'>
          <ReflexElement minSize={200}>
            <div className={classes.leftPane}>
              <SchemaPanel />
            </div>
          </ReflexElement>
          <ReflexSplitter propagate />
          <ReflexElement minSize={200}>
            <div className={classes.centerPane}>
              <Editor />
            </div>
          </ReflexElement>
          <ReflexSplitter propagate />
          <ReflexElement minSize={200}>
            <div className={classes.rightPane}>
              <Properties />
            </div>
          </ReflexElement>
        </ReflexContainer>
      </div>
    </Layout>
  );
};

export default App;
