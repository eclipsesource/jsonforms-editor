/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
Cypress.Commands.add(
  'dragTo',
  { prevSubject: 'element' },
  (subject, targetEl) => {
    cy.wrap(subject)
      .trigger('mousedown', { which: 1 })
      .trigger('dragstart')
      .trigger('drag', {});
    cy.get(targetEl)
      .trigger('dragover')
      .trigger('drop')
      .then(($targetEl) => {
        $targetEl.trigger('dragend');
        $targetEl.trigger('mouseup', { which: 1 });
      });
  }
);
