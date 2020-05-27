/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
describe('Dnd Tests on Example model', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Create "name" Control', () => {
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="/-drop-0"]'
    );
    // TODO more specific check
    cy.get('input');
  });

  it('Create "personalData/height" Control', () => {
    // expand personalData
    cy.get('[data-cy="/properties/personalData-source"]').click();
    // drag personalData/height
    cy.get(
      '[data-cy="/properties/personalData/properties/height-source"]'
    ).dragTo('[data-cy="/-drop-0"]');
    // TODO more specific check
    cy.get('input');
  });
});
