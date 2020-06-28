/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { ControlElement } from '@jsonforms/core';

import { getRoot } from '../util/clone';
import {
  buildEditorUiSchemaTree,
  containsControls,
  EditorLayout,
  getDetailContainer,
} from './uischema';

test('set uuids on single element', () => {
  const element = simpleControl();
  const enrichedElement = buildEditorUiSchemaTree(element);
  expect(enrichedElement).toHaveProperty('uuid');
});

test('set uuids on nested elements', () => {
  const layout = simpleLayout();
  const enrichedLayout = buildEditorUiSchemaTree(layout) as EditorLayout;
  expect(enrichedLayout).toHaveProperty('uuid');
  expect(enrichedLayout.elements[0]).toHaveProperty('uuid');
  expect(enrichedLayout.elements[1]).toHaveProperty('uuid');
});

test('set uuids on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedLayout = buildEditorUiSchemaTree(controlWithDetail);
  expect(enrichedLayout).toHaveProperty('uuid');
  expect(enrichedLayout.options!.detail.elements[0]).toHaveProperty('uuid');
  expect(enrichedLayout.options!.detail.elements[1]).toHaveProperty('uuid');
});

test('set parent on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedLayout = buildEditorUiSchemaTree(controlWithDetail);
  expect(getRoot(enrichedLayout.options!.detail)).toBe(enrichedLayout);
  expect(getRoot(enrichedLayout.options!.detail.elements[0])).toBe(
    enrichedLayout
  );
});

test('isInDetail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedControlWithDetail = buildEditorUiSchemaTree(controlWithDetail);
  expect(getDetailContainer(enrichedControlWithDetail)).toBeFalsy();
  expect(getDetailContainer(enrichedControlWithDetail.options!.detail)).toBe(
    enrichedControlWithDetail
  );
  expect(
    getDetailContainer(enrichedControlWithDetail.options!.detail.elements[0])
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

const simpleEditorControl = () => buildEditorUiSchemaTree(simpleControl());

const simpleEditorLayout = (): EditorLayout =>
  buildEditorUiSchemaTree(simpleLayout()) as EditorLayout;
