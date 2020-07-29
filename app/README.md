# JSON Forms Editor app

This is the official JSON Forms Editor app.
It is based on the `@jsonforms/editor` component.

## Setup

Setup is handled as part of the monorepo management.
See the [README](../README.md).

## Build

- `npm run build`

The JSON Forms editor app will be located in the `build` directory.
Note that the build uses the built version of the `@jsonforms/editor` component.

## Develop

### CRA

The app is based on `create-react-app`.

We use `rescripts` to customize non-configurable CRA features:

- We add the `MonacoWebpackPlugin` to the build
- We also add the `@jsonforms/editor` sources to the build.

By consuming the sources we don't exactly behave like a regular consumer of the library.
See the [testapp](../testapp) for smoke tests regarding this use case.

### Scripts

- Start the app with `npm start`
- Run unit tests with `npm run test`
- Run UI tests with `npm run cypress:open`
