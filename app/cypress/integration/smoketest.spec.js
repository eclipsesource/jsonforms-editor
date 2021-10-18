/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
describe('Smoketest', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Renders Title', () => {
    cy.contains('JSON Forms Editor');
  });
});
