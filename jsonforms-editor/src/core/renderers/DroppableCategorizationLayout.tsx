/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import {
  Category,
  isCategorization,
  rankWith,
  StatePropsOfLayout,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react';
import {
  AppBar,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  Tooltip,
} from '@material-ui/core';
import { PlusOne, Tab as TabIcon } from '@material-ui/icons';
import React, { useMemo, useState } from 'react';

import { CategorizationLayout } from '../model/uischema';
import { createCategory } from '../util/generators/uiSchema';
import { DroppableElementRegistration } from './DroppableElement';

interface DroppableCategorizationLayoutProps extends StatePropsOfLayout {
  uischema: CategorizationLayout;
  index?: number;
}

const DroppableCategorizationLayout: React.FC<DroppableCategorizationLayoutProps> = (
  props
) => {
  const { uischema, schema, path, renderers, cells, index } = props;

  const [currIndex, setIndex] = useState(index);

  const categories = uischema.elements;

  const indicatorColor: 'secondary' | 'primary' | undefined =
    categories.length === 0 ? 'primary' : 'secondary';

  // fix the current index when categories are deleted
  if (currIndex && currIndex > categories.length - 1) {
    setIndex(categories.length === 0 ? undefined : categories.length - 1);
  }

  // DroppableControl removed itself before dispatching to us, we need
  // to re-add it for our children
  const renderersToUse = useMemo(() => {
    return renderers && [...renderers, DroppableElementRegistration];
  }, [renderers]);

  const handleChange = (_event: any, value: any) => {
    if (typeof value === 'number') {
      setIndex(value);
    }
  };

  const addTab = (_event: any) => {
    const tab = createCategory('New Tab ' + (categories.length + 1));
    tab.parent = uischema;

    categories.push(tab);
    setIndex(categories.length - 1);
  };

  return (
    <Card>
      <CardHeader
        component={() => (
          <AppBar position='static'>
            <Tabs
              indicatorColor={indicatorColor}
              value={currIndex}
              onChange={handleChange}
              variant='scrollable'
            >
              {categories.map((e: Category, idx: number) => (
                <Tab key={idx} label={e.label} />
              ))}
              <Tooltip title='Add New Tab' arrow>
                <Tab
                  key={categories.length}
                  icon={
                    <span>
                      <TabIcon fontSize='small' />
                      <PlusOne color='secondary' />
                    </span>
                  }
                  onClick={addTab}
                />
              </Tooltip>
            </Tabs>
          </AppBar>
        )}
      ></CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <JsonFormsDispatch
            schema={schema}
            uischema={categories[currIndex ?? 0]}
            path={path}
            renderers={renderersToUse}
            cells={cells}
          />
        ) : (
          <span>
            No Category. Use{' '}
            <span>
              <TabIcon fontSize='small' />
              <PlusOne color='secondary' />
            </span>{' '}
            to add a new tab.
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export const DroppableCategorizationLayoutRegistration = {
  tester: rankWith(40, isCategorization), // less than DroppableElement
  renderer: withJsonFormsLayoutProps(
    DroppableCategorizationLayout as React.FC<StatePropsOfLayout>
  ),
};
