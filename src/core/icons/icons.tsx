/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { styled } from '@material-ui/core';
import Height from '@material-ui/icons/Height';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { ARRAY, OBJECT, PRIMITIVE, SchemaElementType } from '../model';

export const VerticalIcon = Height;
export const HorizontalIcon = styled(Height)({
  transform: 'rotate(90deg)',
});

export const ControlIcon = InsertLinkIcon;
export const ObjectIcon = ListAltIcon;
export const ArrayIcon = QueueOutlinedIcon;
export const PrimitiveIcon = LabelOutlinedIcon;
export const OtherIcon = RadioButtonUncheckedIcon;

export const getIconForSchemaType = (type: SchemaElementType) => {
  switch (type) {
    case OBJECT:
      return ObjectIcon;
    case ARRAY:
      return ArrayIcon;
    case PRIMITIVE:
      return PrimitiveIcon;
    default:
      return OtherIcon;
  }
};

export const getIconForUISchemaType = (type: string) => {
  switch (type) {
    case 'HorizontalLayout':
      return HorizontalIcon;
    case 'VerticalLayout':
      return VerticalIcon;
    case 'Control':
      return ControlIcon;
    default:
      return OtherIcon;
  }
};
