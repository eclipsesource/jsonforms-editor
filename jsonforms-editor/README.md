# JSONForms - More Forms. Less Code

**Complex Forms in the blink of an eye**

[JSON Forms](https://jsonforms.io/support) eliminates the tedious task of writing fully-featured forms by hand by leveraging the capabilities of JSON, JSON Schema and Javascript.

## JSON Forms Editor

The JSON Forms Editor allows graphical editing of JSON Schemas and JSON Forms UI Schemas.

This package contains the core `@jsonforms/editor` on which the [JSON Forms Editor app](../app) is based.

## Usage

- `npm install --save @jsonforms/editor`

```typescript
import JsonFormsEditor, {
  defaultSchemaDecorators,
  propertySchemaProvider,
} from '@jsonforms/editor';

const App = () => (
  <JsonFormsEditor
    schemaProviders={[propertySchemaProvider]}
    schemaDecorators={defaultSchemaDecorators}
  />
);
```

## Feedback, Help and Support

We have a [Spectrum Chat](https://spectrum.chat/jsonforms) where you can reach out to the community if you have questions or contact us [directly via email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms%20Editor).
In addition EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.
