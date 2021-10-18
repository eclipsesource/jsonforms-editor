/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */

import { CategorizationLayout, EditorUISchemaElement } from '../model';
import { SelectedElement } from '../selection';

export interface CategorizationService {
  clearTabSelections: () => void;
  removeElement: (element: EditorUISchemaElement) => void;

  getTabSelection: (categorization: CategorizationLayout) => SelectedElement;

  setTabSelection: (
    categorization: CategorizationLayout,
    selection: SelectedElement
  ) => void;
}

export class CategorizationServiceImpl implements CategorizationService {
  private parentUuids = new Map<string, string[]>();
  private selectedTabs = new Map<string, SelectedElement>();

  getTabSelection: (categorization: CategorizationLayout) => SelectedElement = (
    categorization
  ) => this.selectedTabs.get(categorization.uuid);

  setTabSelection: (
    categorization: CategorizationLayout,
    selection: SelectedElement
  ) => void = (categorization, selection) => {
    this.selectedTabs.set(categorization.uuid, selection);

    if (!this.parentUuids.has(categorization.uuid)) {
      // capture element parents that are Categorization or Category
      this.parentUuids.set(
        categorization.uuid,
        this.getParentCategoryIds(categorization.parent)
      );
    }
  };

  clearTabSelections: () => void = () => {
    this.selectedTabs.clear();
    this.parentUuids.clear();
  };

  removeElement: (element: EditorUISchemaElement) => void = (element) => {
    // no need to hold the memory for Map entry in this case
    this.selectedTabs.delete(element.uuid);
    this.parentUuids.delete(element.uuid);

    this.parentUuids.forEach((parents, uuid, map) => {
      if (parents.includes(element.uuid)) {
        map.delete(uuid);
        this.selectedTabs.delete(uuid);
      }
    });
  };

  private getParentCategoryIds = (
    categorization: EditorUISchemaElement | undefined
  ): string[] => {
    if (categorization === undefined) {
      return [];
    }
    if (
      categorization.type === 'Categorization' ||
      categorization.type === 'Category'
    ) {
      return [
        categorization.uuid,
        ...this.getParentCategoryIds(categorization.parent),
      ];
    } else {
      return this.getParentCategoryIds(categorization.parent);
    }
  };
}
