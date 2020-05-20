import React from 'react';
import { useEffect, useRef } from 'react';

import { useSchema, useUiSchema } from '../../core/context';
import { buildUiSchema } from '../../core/model/uischema';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ng-jsonforms': any;
    }
  }
}

export const EditorPreview: React.FC = () => {
  const ngJsonForms = useRef(null);
  const schema = useSchema();
  const editorUISchema = useUiSchema();

  useEffect(() => {
    const uiSchema = editorUISchema ? buildUiSchema(editorUISchema) : undefined;

    // @ts-ignore: Object is possibly 'null'
    ngJsonForms.current.ngElementStrategy.componentRef.instance.setJsonFormsInput(
      schema?.schema,
      uiSchema
    );
  }, [schema, editorUISchema]);
  return (
    <div>
      <ng-jsonforms ref={ngJsonForms}></ng-jsonforms>
    </div>
  );
};
