import React from 'react';
import { useEffect, useRef } from 'react';

import { useUiSchema } from '../../core/context';
import { buildUiSchema } from '../../core/model/uischema';
import { useExportSchema } from '../../core/util/hooks';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ng-jsonforms': any;
    }
  }
}

export const EditorPreview: React.FC = () => {
  const ngJsonForms = useRef<JSX.IntrinsicElements['ng-jsonforms']>(null);
  const schema = useExportSchema();
  const editorUISchema = useUiSchema();

  useEffect(() => {
    const uiSchema = editorUISchema ? buildUiSchema(editorUISchema) : undefined;
    if (ngJsonForms.current) {
      ngJsonForms.current.ngElementStrategy.componentRef.instance.setJsonFormsInput(
        schema,
        uiSchema
      );
    }
  }, [schema, editorUISchema]);
  return (
    <div>
      <ng-jsonforms ref={ngJsonForms}></ng-jsonforms>
    </div>
  );
};
