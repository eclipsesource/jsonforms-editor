/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
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

import { useDispatch, useSchema } from '../context';
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
import { isPathError } from '../util/schemasUtil';
import { DroppableElementRegistration } from './DroppableElement';

const useLayoutStyles = makeStyles(() => ({
  jsonformsGridItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

export const DroppableLayout: React.FC<DroppableLayoutProps> = ({
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
      <DropPoint index={0} layout={layout} key={`${path}-${0}-drop`} />
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
              renderers={
                renderers && [...renderers, DroppableElementRegistration]
              }
              cells={cells}
            />
          </Grid>
          <DropPoint
            index={index + 1}
            layout={layout}
            key={`${path}-${index + 1}-drop`}
          />
        </React.Fragment>
      ))}
    </Grid>
  );
};

interface DropPointProps {
  layout: EditorLayout;
  index: number;
}

const useDropPointStyles = makeStyles((theme) => ({
  dropPointGridItem: (props: { isOver: boolean; fillWidth: boolean }) => ({
    padding: theme.spacing(1),
    backgroundImage: props.isOver
      ? 'radial-gradient(#c8c8c8 1px, transparent 1px)'
      : 'none',
    backgroundSize: 'calc(10 * 1px) calc(10 * 1px)',
    backgroundClip: 'content-box',
    minWidth: '2em',
    minHeight: props.isOver ? '8em' : '2em',
    maxWidth: props.fillWidth || props.isOver ? 'inherit' : '2em',
  }),
}));

const DropPoint: React.FC<DropPointProps> = ({ layout, index }) => {
  const dispatch = useDispatch();
  const rootSchema = useSchema();
  const [{ isOver, uiSchemaElement, schemaUUID }, drop] = useDrop({
    accept: [NEW_UI_SCHEMA_ELEMENT, MOVE_UI_SCHEMA_ELEMENT],
    canDrop: (item, monitor) => {
      switch (item.type) {
        case NEW_UI_SCHEMA_ELEMENT:
          return canDropIntoLayout(
            item as NewUISchemaElement,
            rootSchema,
            layout
          );
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
      schemaUUID: mon.getItem()?.schemaUUID,
    }),
    drop: (item) => {
      switch (item.type) {
        case NEW_UI_SCHEMA_ELEMENT:
          schemaUUID
            ? dispatch(
                Actions.addScopedElementToLayout(
                  uiSchemaElement,
                  layout.uuid,
                  index,
                  schemaUUID
                )
              )
            : dispatch(
                Actions.addUnscopedElementToLayout(
                  uiSchemaElement,
                  layout.uuid,
                  index
                )
              );
          break;
        case MOVE_UI_SCHEMA_ELEMENT:
          dispatch(
            Actions.moveUiSchemaElement(
              uiSchemaElement.uuid,
              layout.uuid,
              index,
              schemaUUID
            )
          );
          break;
      }
    },
  });

  const fillWidth =
    layout.type !== 'HorizontalLayout' || layout.elements.length === 0;

  const classes = useDropPointStyles({ isOver, fillWidth });
  return (
    <Grid
      item
      container
      ref={drop}
      className={classes.dropPointGridItem}
      data-cy={`${getDataPath(layout)}-drop-${index}`}
      xs
    ></Grid>
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

const createRendererInDirection =
  (direction: 'row' | 'column') =>
  ({ uischema, path, renderers, ...props }: LayoutProps) => {
    const layout = uischema as EditorLayout;
    return (
      <DroppableLayout
        {...props}
        path={path}
        layout={layout}
        direction={direction}
        renderers={renderers}
      />
    );
  };

export const DroppableHorizontalLayoutRegistration = {
  tester: rankWith(45, uiTypeIs('HorizontalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('row')),
};
export const DroppableVerticalLayoutRegistration = {
  tester: rankWith(45, uiTypeIs('VerticalLayout')),
  renderer: withJsonFormsLayoutProps(createRendererInDirection('column')),
};
