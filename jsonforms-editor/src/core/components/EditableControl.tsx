/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { Grid, TextField } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';

import { useDispatch, useSchema } from '../context';
import {
  Actions,
  getChildren,
  getScope,
  isArrayElement,
  isObjectElement,
  SchemaElement,
} from '../model';
import { EditorControl } from '../model/uischema';

interface EditableControlProps {
  uischema: EditorControl;
}
export const EditableControl: React.FC<EditableControlProps> = ({
  uischema,
}) => {
  const dispatch = useDispatch();
  const baseSchema = useSchema() as SchemaElement;
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      Actions.updateUISchemaElement(uischema.uuid, {
        label: event.target.value,
      })
    );
  };
  const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      Actions.changeControlScope(
        uischema.uuid,
        (event.target.value as any).scope,
        (event.target.value as any).uuid
      )
    );
  };
  const scopes = getChildren(baseSchema)
    .flatMap((child) => {
      // if the child is the only item of an array, use its children instead
      if (
        (isObjectElement(child) &&
          isArrayElement(child.parent) &&
          child.parent.items === child) ||
        isObjectElement(child)
      ) {
        return getChildren(child);
      }
      return [child];
    })
    .map((e) => ({ scope: `#${getScope(e)}`, uuid: e.uuid }));
  const scopeValues = scopes.filter((s) => s.scope.endsWith(uischema.scope));
  const scopeValue =
    scopeValues && scopeValues.length === 1 ? scopeValues[0] : '';
  return (
    <Grid container direction={'column'}>
      <Grid item xs>
        <TextField
          id='filled-name'
          label='Label'
          value={uischema.label ?? ''}
          onChange={handleLabelChange}
          fullWidth
        />
      </Grid>
      <Grid item xs>
        <TextField
          id='standard-select-currency'
          select
          label='Scope'
          value={scopeValue}
          onChange={handleScopeChange}
          fullWidth
          helperText='Please select your scope'
        >
          {scopes.map((scope) => (
            <MenuItem key={scope.scope} value={scope as any}>
              {scope.scope}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};
