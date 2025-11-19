# JSON Forms Editor

> [!CAUTION]
> This editor is a proof of concept, is no longer maintained and is based on an older version of JSON Forms.<br/>
> See [jsonforms.io](https://jsonforms.io) for more information about JSON Forms.

Editor for JSON Schema and JSON Forms Ui Schema

This is a monorepo consisting of the `@jsonforms/editor` library component and the published JSON Forms editor app.

## Live Demo

You can try a [live demo of the editor](https://jsonforms-editor.netlify.app/) on Netlify.

## Setup

- `npm ci`
- `npm run init`

## Build

- `npm run build`

The `@jsonforms/editor` library component will be located in `jsonforms-editor/dist`.
The JSON Forms editor app will be located in `app/build`.

## Develop

### Recommended setup

- Node >= 12
- Visual Studio Code
- Install recommended extensions

Linting, formatting and import sorting should work automatically.

### Scripts

- Build and watch jsonforms-editor library with `npm run watch`
- Start the app with `npm start`
- Run unit tests with `npm run test`
- Run UI tests with `npm run cypress:open`

### Debugging in VS Code

Start the app by running `npm start` and start debugging in VS Code by pressing F5 or by clicking the green debug icon (launch config `Chrome Debug`).
