# jsonforms-editor

Editor for JSON Schema and JSON Forms Ui Schema

[![Build Status](https://travis-ci.com/eclipsesource/jsonforms-editor.svg?branch=master)](https://travis-ci.com/eclipsesource/jsonforms-editor) [![Netlify Status](https://api.netlify.com/api/v1/badges/2c2a42d3-77fb-4cd8-aca1-4cfa6c9a4a03/deploy-status)](https://app.netlify.com/sites/jsonforms-editor/deploys)

## Setup

- `npm ci`

## Build

- `npm run build`

### Setup and build with minimal dependencies

- `npm ci --only=prod`
- `npm run build`

## Develop

### Recommended setup

- Node >= 12
- Visual Studio Code
- Install recommended extensions

Linting, formatting and import sorting should work automatically.

### Scripts

- Start the app with `npm start`
- Run unit tests with `npm run test`
- Run UI tests with `npm run cypress:open`

### Debugging in VS Code

Start the app by running `npm start` and start debugging in VS Code by pressing F5 or by clicking the green debug icon (launch config `Chrome Debug`).
