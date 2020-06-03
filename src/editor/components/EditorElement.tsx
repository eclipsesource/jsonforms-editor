/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useDrag } from 'react-dnd';

import { useSchema } from '../../core/context';
import { DndItems } from '../../core/dnd';
import { getIconForUISchemaType } from '../../core/icons';
import {
  getUISchemaPath,
  LinkedUISchemaElement,
} from '../../core/model/uischema';
import { getFromPath } from '../../core/util/clone';

export interface EditorElementProps {
  wrappedElement: LinkedUISchemaElement;
}

const useEditorElementStyles = makeStyles((theme) => ({
  editorElement: (props: { isDragging: boolean }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #D3D3D3',
    padding: theme.spacing(1),
    opacity: props.isDragging ? 0.5 : 1,
  }),
  iconGridItem: {
    alignSelf: 'flex-start',
  },
}));

export const EditorElement: React.FC<EditorElementProps> = ({
  wrappedElement,
  children,
}) => {
  const schema = useSchema();
  const elementSchemaPathString = wrappedElement.linkedSchemaElements?.find(
    (schemaElement) => schemaElement !== undefined
  );
  const elementSchemaPath = elementSchemaPathString?.split('/');
  const elementSchema = elementSchemaPath
    ? getFromPath(schema, elementSchemaPath)
    : undefined;
  const [{ isDragging }, drag] = useDrag({
    item: DndItems.moveUISchemaElement(wrappedElement, elementSchema),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const classes = useEditorElementStyles({ isDragging });
  return (
    <Grid
      item
      container
      wrap='nowrap'
      direction='column'
      className={classes.editorElement}
      ref={drag}
      xs
    >
      <Grid
        item
        key={`${getUISchemaPath(wrappedElement)}-${0}-icon`}
        className={classes.iconGridItem}
      >
        {React.createElement(getIconForUISchemaType(wrappedElement.type), {})}
      </Grid>
      {children}
    </Grid>
  );
};
