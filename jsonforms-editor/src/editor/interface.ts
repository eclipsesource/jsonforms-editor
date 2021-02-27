/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
export interface PreviewTab {
  name: string;
  Component: React.ComponentType;
}
export interface PaletteTab {
  name: string;
  Component: React.ComponentType;
  icon: React.ReactElement;
}
