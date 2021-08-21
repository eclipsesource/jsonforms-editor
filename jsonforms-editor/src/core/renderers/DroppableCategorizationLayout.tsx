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
} from '@material-ui/core';
import { PlusOne, Tab as TabIcon } from '@material-ui/icons';
import { findIndex } from 'lodash';
import React, { useMemo } from 'react';

import { useCategorizationService, useSelection } from '../../core/context';
import { CategorizationLayout } from '../model/uischema';
import { createCategory } from '../util/generators/uiSchema';
import { DroppableElementRegistration } from './DroppableElement';

interface DroppableCategorizationLayoutProps extends StatePropsOfLayout {
  uischema: CategorizationLayout;
}

const DroppableCategorizationLayout: React.FC<DroppableCategorizationLayoutProps> = (
  props
) => {
  const { uischema, schema, path, renderers, cells } = props;

  // ignoring the first selection from the tuple since it is not used
  const [, setSelection] = useSelection();
  const categorizationService = useCategorizationService();

  const categories = uischema.elements;

  const indicatorColor: 'secondary' | 'primary' | undefined =
    categories.length === 0 ? 'primary' : 'secondary';

  const setIndex = (value: number, event?: any) => {
    event?.stopPropagation();
    if (value < categories.length) {
      const selectedUuid = categories[value].uuid;

      categorizationService.setTabSelection(uischema, {
        uuid: selectedUuid,
      });
      setSelection({ uuid: selectedUuid });
    }
  };

  // DroppableControl removed itself before dispatching to us, we need
  // to re-add it for our children
  const renderersToUse = useMemo(() => {
    return renderers && [...renderers, DroppableElementRegistration];
  }, [renderers]);

  const handleChange = (event: any, value: any) => {
    if (typeof value === 'number') {
      setIndex(value, event);
    }
  };

  const addTab = (event: any) => {
    const tab = createCategory('New Tab ' + (categories.length + 1));
    tab.parent = uischema;

    categories.push(tab);
    setIndex(categories.length - 1, event);
  };

  const currIndex = findIndex(
    categories,
    (cat) => cat.uuid === categorizationService.getTabSelection(uischema)?.uuid
  );

  return (
    <Card>
      <CardHeader
        component={() => (
          <AppBar position='static'>
            <Tabs
              indicatorColor={indicatorColor}
              value={currIndex === -1 ? false : currIndex}
              onChange={handleChange}
              variant='scrollable'
            >
              {categories.map((e: Category, idx: number) => (
                <Tab key={idx} label={e.label} />
              ))}
              <Tab
                key={categories.length}
                icon={
                  <span>
                    <TabIcon fontSize='small' />
                    <PlusOne />
                  </span>
                }
                onClick={addTab}
              />
            </Tabs>
          </AppBar>
        )}
      ></CardHeader>
      <CardContent>
        {categories.length > 0 && currIndex >= 0 ? (
          <JsonFormsDispatch
            schema={schema}
            uischema={categories[currIndex]}
            path={path}
            renderers={renderersToUse}
            cells={cells}
          />
        ) : (
          categories.length === 0 && (
            <span>
              {'No Category. Use '}
              <TabIcon fontSize='small' />
              <PlusOne />
              {' to add a new tab.'}
            </span>
          )
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
