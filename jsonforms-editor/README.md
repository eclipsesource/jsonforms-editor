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

## Monaco Editor

If you want syntax highlighting and autocompletion in the embedded Monaco Editor you'll need to customize your build.
The easiest way is to use the `MonacoWebpackPlugin` plugin.
Check [react-monaco-editor](https://github.com/react-monaco-editor/react-monaco-editor) for more information.

## Jest

If you're using Jest for component testing you'll need to configure it for the Monaco Editor and imported CSS.

For example you can configure Jest via the `package.json`:

```json
"jest": {
  "transformIgnorePatterns": [
    "node_modules/(?!(monaco-editor)/)"
  ],
  "moduleNameMapper": {
    "^.+\\.(css|scss)$": "identity-obj-proxy",
    "monaco-editor": "<rootDir>/../node_modules/react-monaco-editor"
  }
}
```

## Feedback, Help and Support

We have a [Spectrum Chat](https://spectrum.chat/jsonforms) where you can reach out to the community if you have questions or contact us [directly via email](mailto:jsonforms@eclipsesource.com?subject=JSON%20Forms%20Editor).
In addition EclipseSource also offers [professional support](https://jsonforms.io/support) for JSON Forms.

## License

The JSONForms project is licensed under the MIT License. See the [LICENSE file](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) for more information.
