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
  buildLinkedUiSchemaTree,
  containsControls,
  getDetailContainer,
  LinkedLayout,
} from './uischema';

test('set uuids on single element', () => {
  const element = simpleControl();
  const enrichedElement = buildLinkedUiSchemaTree(element);
  expect(enrichedElement).toHaveProperty('uuid');
});

test('set uuids on nested elements', () => {
  const layout = simpleLayout();
  const enrichedLayout = buildLinkedUiSchemaTree(layout) as LinkedLayout;
  expect(enrichedLayout).toHaveProperty('uuid');
  expect(enrichedLayout.elements[0]).toHaveProperty('uuid');
  expect(enrichedLayout.elements[1]).toHaveProperty('uuid');
});

test('set uuids on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedLayout = buildLinkedUiSchemaTree(controlWithDetail);
  expect(enrichedLayout).toHaveProperty('uuid');
  expect(enrichedLayout.options!.detail.elements[0]).toHaveProperty('uuid');
  expect(enrichedLayout.options!.detail.elements[1]).toHaveProperty('uuid');
});

test('set parent on detail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedLayout = buildLinkedUiSchemaTree(controlWithDetail);
  expect(getRoot(enrichedLayout.options!.detail)).toBe(enrichedLayout);
  expect(getRoot(enrichedLayout.options!.detail.elements[0])).toBe(
    enrichedLayout
  );
});

test('isInDetail', () => {
  const controlWithDetail = simpleControl();
  controlWithDetail.options = { detail: simpleLayout() };
  const enrichedControlWithDetail = buildLinkedUiSchemaTree(controlWithDetail);
  expect(getDetailContainer(enrichedControlWithDetail)).toBeFalsy();
  expect(getDetailContainer(enrichedControlWithDetail.options!.detail)).toBe(
    enrichedControlWithDetail
  );
  expect(
    getDetailContainer(enrichedControlWithDetail.options!.detail.elements[0])
  ).toBe(enrichedControlWithDetail);
});

test('containsControls', () => {
  expect(containsControls(simpleLinkedControl())).toBeTruthy();
  const layout = simpleLinkedLayout();
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

const simpleLinkedControl = () => buildLinkedUiSchemaTree(simpleControl());

const simpleLinkedLayout = (): LinkedLayout =>
  buildLinkedUiSchemaTree(simpleLayout()) as LinkedLayout;
