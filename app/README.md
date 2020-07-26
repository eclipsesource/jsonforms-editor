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
- In development we also add the `@jsonforms/editor` sources to the build. See [development mode](#development-mode).

### Scripts

- Start the app with `npm start`
- Run unit tests with `npm run test`
- Run UI tests with `npm run cypress:open`

### Development mode

The development server of the app also includes the typescript library build.
This is controlled via the `REACT_APP_BUILD_FROM_SOURCE=true` environment variable.
Set to `false` to test the regular build in the development server.
Note that you then need to rebuild the `@jsonforms/editor` library component with every change.

In `@jsonforms/editor` we switch between the modes via the `index.js` main.
