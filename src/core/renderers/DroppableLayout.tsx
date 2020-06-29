/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  LayoutProps,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import {
  ResolvedJsonFormsDispatch,
  withJsonFormsLayoutProps,
} from '@jsonforms/react';
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDrop } from 'react-dnd';

import { EditorElement } from '../../editor/components/EditorElement';
import { useDispatch } from '../context';
import {
  canDropIntoLayout,
  canMoveSchemaElementTo,
  MOVE_UI_SCHEMA_ELEMENT,
  MoveUISchemaElement,
  NEW_UI_SCHEMA_ELEMENT,
  NewUISchemaElement,
} from '../dnd';
import { Actions } from '../model';
import {
  EditorLayout,
  EditorUISchemaElement,
  getUISchemaPath,
} from '../model/uischema';
import { isPathError } from '../util/clone';

const useLayoutStyles = makeStyles((theme) => ({
  dropPointGridItem: {
    padding: theme.spacing(1),
    width: '3em',
    maxWidth: '3em',
    minWidth: '3em',
    margin: 'auto',
  },
  jsonformsGridItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    width: '100%',
  },
}));

interface DroppableLayoutProps {
  schema: JsonSchema;
  layout: EditorLayout;
  path: string;
  direction: 'row' | 'column';
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
}

const DroppableLayout: React.FC<DroppableLayoutProps> = (props) => {
  return (
    <EditorElement wrappedElement={props.layout}>
      <DroppableLayoutContent {...props} />
    </EditorElement>
  );
};

export const DroppableLayoutContent: React.FC<DroppableLayoutProps> = ({
  schema,
  layout,
  path,
  direction,
  renderers,
  cells,
}) => {
  const classes = useLayoutStyles();
  return (
    <Grid
      container
      direction={direction}
      spacing={direction === 'row' ? 2 : 0}
      wrap='nowrap'
    >
      {renderLayoutElementsWithDrops(
        layout,
        schema,
        path,
        classes,
        renderers,
        cells
      )}
    </Grid>
  );
};

const renderLayoutElementsWithDrops = (
  layout: EditorLayout,
  schema: JsonSchema,
  path: string,
  classes: Record<'dropPointGridItem' | 'jsonformsGridItem', string>,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) => {
  return (
    <>
      <Grid
        item
        key={`${path}-${0}-drop`}
        className={classes.dropPointGridItem}
        xs
      >
        <DropPoint index={0} layout={layout} />
      </Grid>
      {layout.elements.map((child, index) => (
        <React.Fragment key={`${path}-${index}-fragment`}>
          <Grid
            item
            key={`${path}-${index}`}
            className={classes.jsonformsGridItem}
            xs
          >
            <ResolvedJsonFormsDispatch
              uischema={child}
              schema={schema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          </Grid>
          <Grid
            item
            className={classes.dropPointGridItem}
            key={`${path}-${index + 1}-drop`}
            xs
          >
            <DropPoint index={index + 1} layout={layout} />
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

interface DropPointProps {
  layout: EditorLayout;
  index: number;
}

const useDropPointStyles = makeStyles({
  dropPoint: (props: { isOver: boolean }) => ({
    textAlign: 'center',
    fontSize: props.isOver ? '2em' : '1em',
  }),
});

const DropPoint: React.FC<DropPointProps> = ({ layout, index }) => {
  const dispatch = useDispatch();
  const [{ isOver, uiSchemaElement, schema }, drop] = useDrop({
    accept: [NEW_UI_SCHEMA_ELEMENT, MOVE_UI_SCHEMA_ELEMENT],
    canDrop: (item, monitor) => {
      switch (item.type) {
        case NEW_UI_SCHEMA_ELEMENT:
          return canDropIntoLayout(item as NewUISchemaElement, layout);
        case MOVE_UI_SCHEMA_ELEMENT:
          return canMoveSchemaElementTo(
            item as MoveUISchemaElement,
            layout,
            index
          );
      }
      // fallback
      return false;
    },
    collect: (mon) => ({
      isOver: !!mon.isOver() && mon.canDrop(),
      uiSchemaElement: mon.getItem()?.uiSchemaElement,
      schema: mon.getItem()?.schema,
    }),
    drop: (item) => {
      switch (item.type) {
        case NEW_UI_SCHEMA_ELEMENT:
          schema
            ? dispatch(
                Actions.addScopedElementToLayout(
                  uiSchemaElement,
                  layout,
                  index,
                  schema
                )
              )
            : dispatch(
                Actions.addUnscopedElementToLayout(
                  uiSchemaElement,
                  layout,
                  index
                )
              );
          break;
        case MOVE_UI_SCHEMA_ELEMENT:
          dispatch(
            Actions.moveUiSchemaElement(uiSchemaElement, layout, index, schema)
          );
          break;
      }
    },
  });

  const classes = useDropPointStyles({ isOver });
  return (
    <div
      ref={drop}
      className={classes.dropPoint}
      data-cy={`${getDataPath(layout)}-drop-${index}`}
    >
      [ ]
    </div>
  );
};

const getDataPath = (uischema: EditorUISchemaElement): string => {
  const path = getUISchemaPath(uischema);
  if (isPathError(path)) {
    console.error('Could not calculate data-cy path for DropPoint', path);
    return '';
  }
  return path;
};

const createRendererInDirection = (direction: 'row' | 'column') => ({
  uischema,
  path,
  ...props
}: LayoutProps) => {
  const layout = uischema as EditorLayout;
  return (
    <DroppableLayout
      {...props}
      path={path}
      layout={layout}
      direction={direction}
    />
  );
};

export const DroppableHorizontalLayoutRegistration = {
  tester: rankWith(10, uiTypeIs('HorizontalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('row')),
};
export const DroppableVerticalLayoutRegistration = {
  tester: rankWith(10, uiTypeIs('VerticalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('column')),
};
