import { FormattedJson } from '../../core/components';
import React from 'react';
import { SchemaElement } from '../../core/model';

export const SchemaJson: React.FC<{ schema: SchemaElement | undefined }> = (
  schema
) => <FormattedJson object={schema?.schema} />;
