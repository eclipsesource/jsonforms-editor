/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement } from '@jsonforms/core';

import {
  createControlWithScope,
  createLayout,
} from '../util/generators/uiSchema';
import { buildAndLinkUISchema, getRoot } from '../util/schemasUtil';
import {
  containsControls,
  EditorControl,
  EditorLayout,
  getDetailContainer,
} from './uischema';

test('set uuids on single element', () => {
  const element = simpleControl();
  const { uiSchema: enrichedElement } = buildAndLinkUISchema(
    undefined,
    element
  );
  expect(enrichedElement).toHaveProperty('uuid');
});

test('set uuids on nested elements', () => {
  const layout = simpleLayout();
  const { uiSchema: enrichedLayout } = buildAndLinkUISchema(undefined, layout);
  expect(enrichedLayout).toHaveProperty('uuid');
  expect((enrichedLayout as EditorLayout).elements[0]).toHaveProperty('uuid');
  expect((enrichedLayout as EditorLayout).elements[1]).toHaveProperty('uuid');
});

test('set uuids on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const { uiSchema: enrichedLayout } = buildAndLinkUISchema(
    undefined,
    controlWithDetail
  );
  expect(enrichedLayout).toHaveProperty('uuid');
  expect(
    (enrichedLayout as EditorLayout).options!.detail.elements[0]
  ).toHaveProperty('uuid');
  expect(
    (enrichedLayout as EditorLayout).options!.detail.elements[1]
  ).toHaveProperty('uuid');
});

test('set parent on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const { uiSchema: enrichedLayout } = buildAndLinkUISchema(
    undefined,
    controlWithDetail
  );
  expect(getRoot((enrichedLayout as EditorLayout).options!.detail)).toBe(
    enrichedLayout
  );
  expect(
    getRoot((enrichedLayout as EditorLayout).options!.detail.elements[0])
  ).toBe(enrichedLayout);
});

test('isInDetail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const { uiSchema: enrichedControlWithDetail } = buildAndLinkUISchema(
    undefined,
    controlWithDetail
  );
  expect(enrichedControlWithDetail).toBeDefined();
  expect(
    getDetailContainer(enrichedControlWithDetail as EditorControl)
  ).toBeFalsy();
  expect(
    getDetailContainer(
      (enrichedControlWithDetail as EditorControl).options!.detail
    )
  ).toBe(enrichedControlWithDetail);
  expect(
    getDetailContainer(
      (enrichedControlWithDetail as EditorControl).options!.detail.elements[0]
    )
  ).toBe(enrichedControlWithDetail);
});

test('containsControls', () => {
  expect(containsControls(simpleEditorControl())).toBeTruthy();
  const layout = simpleEditorLayout();
  expect(containsControls(layout)).toBeTruthy();
  layout.elements = [];
  expect(containsControls(layout)).toBeFalsy();
});

const simpleControl = (): ControlElement => ({
  type: 'Control',
  scope: '#',
});

const simpleLayout = () => ({
  type: 'VerticalLayout',
  elements: [simpleControl(), simpleControl()],
});

const simpleEditorControl = () => createControlWithScope('#');

const simpleEditorLayout = (): EditorLayout => {
  const layout = createLayout('VerticalLayout') as EditorLayout;
  layout.elements = [simpleEditorControl(), simpleEditorControl()];
  return layout;
};
