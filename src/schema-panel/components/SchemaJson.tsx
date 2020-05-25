import React from 'react';

import { FormattedJson } from '../../core/components';
import { SchemaElement } from '../../core/model';

export const SchemaJson: React.FC<{ schema: SchemaElement | undefined }> = (
  schema
) => <FormattedJson object={schema?.schema} />;
