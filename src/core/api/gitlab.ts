const exampleSchema = {
  type: 'object',
  title: 'Person',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    birthDate: {
      type: 'string',
      format: 'date',
    },
    personalData: {
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          description: 'Please enter your age.',
        },
        height: {
          type: 'number',
        },
        drivingSkill: {
          type: 'number',
          maximum: 10,
          minimum: 1,
          default: 7,
        },
      },
      required: ['age', 'height'],
    },
    friends: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Friend',
        properties: {
          name: {
            type: 'string',
          },
          isClose: {
            type: 'boolean',
          },
        },
      },
    },
    nationality: {
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    occupation: {
      type: 'string',
    },
  },
};

const exampleUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
        {
          type: 'Control',
          scope: '#/properties/birthDate',
        },
        {
          type: 'Control',
          scope: '#/properties/nationality',
        },
        {
          type: 'Control',
          scope: '#/properties/occupation',
        },
      ],
    },
    {
      type: 'Label',
      text: 'Additional Information',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/personalData/properties/age',
        },
        {
          type: 'Control',
          scope: '#/properties/personalData/properties/height',
        },
        {
          type: 'Control',
          scope: '#/properties/personalData/properties/drivingSkill',
        },
      ],
    },
    {
      type: 'Control',
      scope: '#/properties/friends',
    },
  ],
};

export interface GitLabService {
  getSchema(): Promise<any>;
  getUiSchmema(): Promise<any>;
}

export class GitLabServiceMock implements GitLabService {
  getSchema = async () => exampleSchema;
  getUiSchmema = async () => exampleUischema;
}
