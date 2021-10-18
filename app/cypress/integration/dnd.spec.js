/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
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

describe('Control Creation Dnd Tests on Example model', () => {
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

describe('Dnd Move Tests on Example model', () => {
  beforeEach(() => {
    cy.visit('/');
    //SETUP: horizontal layout with two controls("personalData/height" and "name") and a vertical layout
    // add a layout
    cy.get('[data-cy="HorizontalLayout-source"]').dragTo(
      '[data-cy="nolayout-drop"]'
    );
    cy.get('[data-cy="/properties/personalData-source"]').click();
    cy.get(
      '[data-cy="/properties/personalData/properties/height-source"]'
    ).dragTo('[data-cy="/-drop-0"]');
    cy.get('[data-cy="/properties/name-source"]').dragTo(
      '[data-cy="/-drop-1"]'
    );
    cy.get('[data-cy="VerticalLayout-source"]').dragTo('[data-cy="/-drop-2"]');

    //check that order is: height, name
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
  });

  it('Move element in the same parent, to the right', () => {
    // MOVE "height" after "name"
    cy.get('[data-cy="editorElement-/elements/0-header"]').dragTo(
      '[data-cy="/-drop-2"]'
    );

    //check that order changed to: name, height
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
  });

  it('Move element in the same parent, to the left', () => {
    // MOVE "name" before "height"
    cy.get('[data-cy="editorElement-/elements/1-header"]').dragTo(
      '[data-cy="/-drop-0"]'
    );

    //check that order changed to: name, height
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
  });

  it('Move element to new parent', () => {
    // MOVE "height" to vertical layout
    cy.get('[data-cy="editorElement-/elements/0-header"]').dragTo(
      '[data-cy="/elements/2-drop-0"]'
    );

    //check that order changed to: name, vertical-layout/height
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
    cy.get('[data-cy="editorElement-/elements/1/elements/0"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
  });

  it('No layout change when droping element in the drop point to its left', () => {
    // drop name in the drop point before it
    cy.get('[data-cy="editorElement-/elements/0-header"]').dragTo(
      '[data-cy="/-drop-0"]'
    );

    //check that order didn't change
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
  });

  it('No layout change when droping element in the drop point to its right', () => {
    // drop name in the drop point before it
    cy.get('[data-cy="editorElement-/elements/0-header"]').dragTo(
      '[data-cy="/-drop-1"]'
    );

    //check that order didn't change
    cy.get('[data-cy="editorElement-/elements/0"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
  });

  it('Layout elements are moved with their children', () => {
    // SETUP: "height" to vertical layout
    cy.get('[data-cy="editorElement-/elements/0-header"]').dragTo(
      '[data-cy="/elements/2-drop-0"]'
    );

    //MOVE layout with control (now on position 1)
    cy.get('[data-cy="editorElement-/elements/1-header"]').dragTo(
      '[data-cy="/-drop-0"]'
    );
    //check height is contained in first element
    cy.get('[data-cy="editorElement-/elements/0/elements/0"]').should(
      'have.text',
      '#/properties/personalData/properties/height' + 'Height*'
    );
    cy.get('[data-cy="editorElement-/elements/1"]').should(
      'have.text',
      '#/properties/name' + 'Name'
    );
  });
});
