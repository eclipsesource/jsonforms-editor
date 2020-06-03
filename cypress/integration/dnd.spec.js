/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

describe('Layout Dnd Tests on Example model', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Create Horizontal Layout', () => {
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="/-drop-0"]');
  });

  it('Create Vertical Layout', () => {
    cy.get('[data-cy="VerticalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="/-drop-0"]');
  });
});

describe('Control Dnd Tests on Example model', () => {
  beforeEach(() => {
    cy.visit('/');
    // add a layout
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
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
