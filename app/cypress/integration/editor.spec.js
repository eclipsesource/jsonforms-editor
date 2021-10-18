/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
describe('Remove controls', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Can remove control root', () => {
    // SETUP: add one control
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );

    // remove control
    cy.get('[data-cy="editorElement-/-removeButton"]').click();

    // check that layout is empty
    cy.get('[data-cy="nolayout-drop"]');
  });

  it('Can remove layout root', () => {
    // SETUP: add a layout with one control
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="/-drop-0"]'
    );

    // remove layuot with control
    cy.get('[data-cy="editorElement-/-removeButton"]').click();
    cy.get('[data-cy="ok-button"]').click();

    // check that layout is empty
    cy.get('[data-cy="nolayout-drop"]');
  });

  it('Can remove control', () => {
    // SETUP: add a layout with three controls
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="/properties/birthDate-source"]').dragTo(
      '[data-cy="/-drop-0"]'
    );
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="/-drop-1"]'
    );
    cy.get('[data-cy="/properties/occupation-source"]').dragTo(
      '[data-cy="/-drop-2"]'
    );

    // remove middle control
    cy.get('[data-cy="editorElement-/elements/1-removeButton"]').click();

    // check that height and occupation controls remain
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'contain.text',
      'Birth Date'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/occupation' + 'Occupation'
    );
  });

  it('Can remove layout', () => {
    // SETUP: add a layout with three elements (two controls, one layout)
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="/-drop-0"]'
    );
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="/-drop-1"]'
    );
    cy.get('[data-cy="/properties/occupation-source"]').dragTo(
      '[data-cy="/-drop-2"]'
    );

    // remove middle control
    cy.get('[data-cy="editorElement-/elements/0-removeButton"]').click();

    // check that height and occupation controls remain
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'contain.text',
      'Name'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/occupation' + 'Occupation'
    );
  });
});
