import traverse from 'json-schema-traverse';

export type SchemaElementType = 'Object' | 'Array' | 'Primitive' | 'Other';

export abstract class SchemaElement {
  abstract readonly type: SchemaElementType;
  parent?: SchemaElement;
  abstract readonly children: ReadonlyArray<SchemaElement>;
  readonly schema: any;
  abstract readonly keywords: Map<SchemaElement, string>;
  readonly other: Map<SchemaElement, string> = new Map();

  constructor(schema: any) {
    this.schema = schema;
  }
  get label(): string {
    return determineLabel(this);
  }
  get path(): string {
    return this.parent
      ? `${this.parent.path}/${this.parent.keywords.get(this)}`
      : '';
  }
  toPrintableObject(): any {
    return {
      type: this.type,
      path: this.path,
      schema: this.schema,
      children: Array.from(this.keywords.entries()).map(([el, key]) => [
        key,
        el.toPrintableObject(),
      ]),
    };
  }
}

export class ArrayElement extends SchemaElement {
  type: SchemaElementType = 'Array';
  items: Array<SchemaElement> | SchemaElement = [];
  get children(): ReadonlyArray<SchemaElement> {
    const items = Array.isArray(this.items) ? this.items : [this.items];
    return [...items, ...Array.from(this.other.keys())];
  }
  get keywords(): Map<SchemaElement, string> {
    const itemEntries: [SchemaElement, string][] = Array.isArray(this.items)
      ? this.items.map((element, index) => [element, `items/${index}`])
      : [[this.items, 'items']];
    return new Map<SchemaElement, string>([
      ...itemEntries,
      ...Array.from(this.other.entries()),
    ]);
  }
  set children(nn) {}
  set keywords(nn) {}
}

export class ObjectElement extends SchemaElement {
  type: SchemaElementType = 'Object';
  readonly properties: Map<SchemaElement, string> = new Map();
  get children(): ReadonlyArray<SchemaElement> {
    return [
      ...Array.from(this.properties.keys()),
      ...Array.from(this.other.keys()),
    ];
  }
  get keywords(): Map<SchemaElement, string> {
    const propertyEntries: [SchemaElement, string][] = Array.from(
      this.properties.entries()
    ).map(([element, prop]) => [element, `properties/${prop}`]);
    return new Map<SchemaElement, string>([
      ...propertyEntries,
      ...Array.from(this.other.entries()),
    ]);
  }
  set children(nn) {}
  set keywords(nn) {}
}

export class PrimitiveElement extends SchemaElement {
  type: SchemaElementType = 'Primitive';
  get children(): ReadonlyArray<SchemaElement> {
    return [...Array.from(this.other.keys())];
  }
  get primitiveType(): string {
    return (
      this.schema.type ||
      (this.schema.enum && 'enum') ||
      (this.schema.const && 'const') ||
      '<unknown>'
    );
  }
  get keywords(): Map<SchemaElement, string> {
    return new Map<SchemaElement, string>(this.other.entries());
  }
  set children(nn) {}
  set keywords(nn) {}
}

/**
 * Could be an object or an array but not both
 */
export class OtherElement extends SchemaElement {
  type: SchemaElementType = 'Other';
  readonly items: Array<SchemaElement> = [];
  get children(): ReadonlyArray<SchemaElement> {
    return [...this.items, ...Array.from(this.other.keys())];
  }
  get keywords(): Map<SchemaElement, string> {
    return new Map<SchemaElement, string>(this.other.entries());
  }
  set children(nn) {}
  set keywords(nn) {}
}

const isElementOfType = <T extends SchemaElement>(type: SchemaElementType) => (
  schemaElement: SchemaElement | undefined
): schemaElement is T => schemaElement?.type === type;

export const isObjectElement = isElementOfType<ObjectElement>('Object');
export const isArrayElement = isElementOfType<ArrayElement>('Array');
export const isPrimitiveElement = isElementOfType<PrimitiveElement>(
  'Primitive'
);
export const isOtherElement = isElementOfType<OtherElement>('Other');

const determineLabel = (schemaElement: SchemaElement) => {
  if (schemaElement.schema.title) {
    return schemaElement.schema.title;
  }
  if (
    isObjectElement(schemaElement.parent) &&
    schemaElement.parent.properties.has(schemaElement)
  ) {
    return schemaElement.parent.properties.get(schemaElement);
  }
  if (
    isArrayElement(schemaElement.parent) &&
    Array.isArray(schemaElement.parent.items)
  ) {
    for (let i = 0; i < schemaElement.parent.items.length; i++) {
      if (schemaElement.parent.items[i] === schemaElement) {
        return `[${i}]`;
      }
    }
  }
  return '<No label>';
};

const createElementForType = (
  schema: any,
  type: SchemaElementType
): SchemaElement => {
  switch (type) {
    case 'Object':
      return new ObjectElement(schema);
    case 'Array':
      return new ArrayElement(schema);
    case 'Primitive':
      return new PrimitiveElement(schema);
    default:
      return new OtherElement(schema);
  }
};

const createSingleElement = (schema: any) =>
  createElementForType(schema, determineType(schema));

const getUndefined = (): SchemaElement | undefined => undefined;

export const buildSchemaTree = (schema: any): SchemaElement | undefined => {
  // workaround needed because of TS compiler issue
  // https://github.com/Microsoft/TypeScript/issues/11498
  let currentElement: SchemaElement | undefined = getUndefined();

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
        const newElement = createSingleElement(currentSchema);
        newElement.parent = currentElement;
        const path = pointer.split('/');
        if (
          isObjectElement(currentElement) &&
          path[path.length - 2] === 'properties'
        ) {
          currentElement.properties.set(newElement, `${indexOrProp}`);
        } else if (
          isArrayElement(currentElement) &&
          path[path.length - 2] === 'items'
        ) {
          (currentElement.items as SchemaElement[]).push(newElement);
        } else if (
          isArrayElement(currentElement) &&
          path[path.length - 1] === 'items'
        ) {
          currentElement.items = newElement;
        } else {
          currentElement?.other.set(newElement, `${indexOrProp}`);
        }
        currentElement = newElement;
      },
      post: () => {
        currentElement = currentElement?.parent || currentElement;
      },
    },
  });

  if (!currentElement) {
    return undefined;
  }

  return currentElement;
};

const determineType = (schema: any): SchemaElementType => {
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
      case 'const':
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
