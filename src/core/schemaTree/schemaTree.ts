import traverse from 'json-schema-traverse';

export type SchemaTreeItemType = 'Object' | 'Array' | 'Primitive' | 'Other';

export interface SchemaTreeItem {
  type: SchemaTreeItemType;
  parent: SchemaTreeItem | undefined;
  children: Array<SchemaTreeItem>;
  schema: any;
  path: string;
  label: string;
  description?: string;
  textDecoration?: string;
}

const getUndefined = (): SchemaTreeItem | undefined => undefined;

export const buildSchemaTree = (schema: any): SchemaTreeItem | undefined => {
  // workaround needed because of TS compiler issue
  // https://github.com/Microsoft/TypeScript/issues/11498
  let currentItem: SchemaTreeItem | undefined = getUndefined();

  traverse(schema, {
    cb: {
      pre: (
        currentSchema: any,
        pointer,
        rootSchema,
        parentPointer,
        parentKeyword,
        parentSchema,
        indexOrProp
      ) => {
        const newItem: SchemaTreeItem = {
          type: determineType(currentSchema),
          parent: currentItem,
          children: [],
          schema: currentSchema,
          path: pointer,
          label: currentSchema.title ? currentSchema.title : indexOrProp,
          description: currentSchema.description,
        };
        currentItem?.children.push(newItem);
        currentItem = newItem;
      },
      post: () => {
        currentItem = currentItem?.parent || currentItem;
      },
    },
  });

  if (!currentItem) {
    return undefined;
  }

  if (!currentItem.label || currentItem.label === '') {
    currentItem.label = 'Root';
  }
  return currentItem;
};

const determineType = (schema: any): SchemaTreeItemType => {
  if (!schema) {
    return 'Other';
  }
  if (schema.type) {
    switch (schema.type) {
      case 'object':
        return 'Object';
      case 'array':
        return 'Array';
      case 'number':
      case 'integer':
      case 'string':
      case 'boolean':
        return 'Primitive';
      default:
        return 'Other';
    }
  }
  if (schema.properties) {
    return 'Object';
  }
  if (schema.items) {
    return 'Array';
  }
  if (schema.enum) {
    return 'Primitive';
  }
  return 'Other';
};
