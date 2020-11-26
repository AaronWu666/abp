import { ConfigStateService } from '@abp/ng.core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ePropType } from '../lib/enums/props.enum';
import { EntityPropList } from '../lib/models/entity-props';
import { FormPropList } from '../lib/models/form-props';
import { ObjectExtensions } from '../lib/models/object-extensions';
import {
  getObjectExtensionEntitiesFromStore,
  mapEntitiesToContributors,
} from '../lib/utils/state.util';

const configState = new ConfigStateService();
configState.setState(createMockState() as any);

describe('State Utils', () => {
  describe('#getObjectExtensionEntitiesFromStore', () => {
    it('should return observable entities of an existing module', async () => {
      const entities = await getObjectExtensionEntitiesFromStore(
        configState,
        'Identity',
      ).toPromise();
      expect('Role' in entities).toBe(true);
    });

    it('should return observable empty object if module does not exist', async () => {
      const entities = await getObjectExtensionEntitiesFromStore(configState, 'Saas').toPromise();
      expect(entities).toEqual({});
    });

    it('should not emit when object extensions do not exist', done => {
      const emptyConfigState = new ConfigStateService();
      const emit = jest.fn();

      getObjectExtensionEntitiesFromStore(emptyConfigState, 'Identity').subscribe(emit);

      setTimeout(() => {
        expect(emit).not.toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  describe('#mapEntitiesToContributors', () => {
    it('should return contributors from given entities', async () => {
      const contributors = await of(createMockEntities())
        .pipe(mapEntitiesToContributors(configState, 'AbpIdentity'), take(1))
        .toPromise();

      const propList = new EntityPropList();
      contributors.prop.Role.forEach(callback => callback(propList));

      expect(propList.length).toBe(3);
      expect(propList.head.value.name).toBe('Title');
      expect(propList.head.next.value.name).toBe('IsHero');
      expect(propList.head.next.next.value.name).toBe('MyEnum');

      const createFormList = new FormPropList();
      contributors.createForm.Role.forEach(callback => callback(createFormList));

      expect(createFormList.length).toBe(2);
      expect(createFormList.head.value.name).toBe('Title');
      expect(createFormList.head.next.value.name).toBe('MyEnum');

      const editFormList = new FormPropList();
      contributors.editForm.Role.forEach(callback => callback(editFormList));

      expect(editFormList.length).toBe(2);
      expect(editFormList.head.value.name).toBe('Title');
      expect(editFormList.head.next.value.name).toBe('IsHero');
    });
  });
});

function createMockState() {
  return {
    objectExtensions: {
      modules: {
        Identity: {
          entities: createMockEntities(),
          configuration: null,
        },
      },
      enums: {
        'MyCompanyName.MyProjectName.MyEnum': {
          fields: [
            {
              name: 'MyEnumValue0',
              value: 0,
            },
            {
              name: 'MyEnumValue1',
              value: 1,
            },
            {
              name: 'MyEnumValue2',
              value: 2,
            },
          ],
          localizationResource: null,
        },
      },
    },
    localization: {
      values: {
        Default: {},
        AbpIdentity: {},
      },
      defaultResourceName: 'Default',
      currentCulture: null,
      languages: [],
    },
  };
}

function createMockEntities(): Record<string, ObjectExtensions.EntityExtensionDto> {
  return {
    Role: {
      properties: {
        Title: {
          type: 'System.String',
          typeSimple: ePropType.String,
          displayName: null,
          api: {
            onGet: {
              isAvailable: true,
            },
            onCreate: {
              isAvailable: true,
            },
            onUpdate: {
              isAvailable: true,
            },
          },
          ui: {
            onTable: {
              isSortable: true,
              isVisible: true,
            },
            onCreateForm: {
              isVisible: true,
            },
            onEditForm: {
              isVisible: true,
            },
            lookup: {},
          },
          attributes: [
            {
              typeSimple: 'required',
              config: {},
            },
            {
              typeSimple: 'stringLength',
              config: {
                maximumLength: 20,
                minimumLength: 2,
              },
            },
          ],
          configuration: {},
          defaultValue: null,
        },
        IsHero: {
          type: 'System.Boolean',
          typeSimple: ePropType.Boolean,
          displayName: null,
          api: {
            onGet: {
              isAvailable: true,
            },
            onCreate: {
              isAvailable: true,
            },
            onUpdate: {
              isAvailable: true,
            },
          },
          ui: {
            onTable: {
              isSortable: false,
              isVisible: true,
            },
            onCreateForm: {
              isVisible: false,
            },
            onEditForm: {
              isVisible: true,
            },
            lookup: {},
          },
          attributes: [],
          configuration: {},
          defaultValue: null,
        },
        AsOf: {
          type: 'System.Date',
          typeSimple: ePropType.Date,
          displayName: {
            name: 'Active as of',
            resource: 'AbpIdentity',
          },
          api: {
            onGet: {
              isAvailable: true,
            },
            onCreate: {
              isAvailable: true,
            },
            onUpdate: {
              isAvailable: true,
            },
          },
          ui: {
            onTable: {
              isSortable: false,
              isVisible: false,
            },
            onCreateForm: {
              isVisible: false,
            },
            onEditForm: {
              isVisible: false,
            },
            lookup: {},
          },
          attributes: [],
          configuration: {},
          defaultValue: null,
        },
        MyEnum: {
          type: 'MyCompanyName.MyProjectName.MyEnum',
          typeSimple: ePropType.Enum,
          displayName: null,
          api: {
            onGet: {
              isAvailable: true,
            },
            onCreate: {
              isAvailable: true,
            },
            onUpdate: {
              isAvailable: true,
            },
          },
          ui: {
            onTable: {
              isSortable: false,
              isVisible: true,
            },
            onCreateForm: {
              isVisible: true,
            },
            onEditForm: {
              isVisible: false,
            },
            lookup: {},
          },
          attributes: [
            {
              typeSimple: 'required',
              config: {
                allowEmptyStrings: false,
              },
            },
            {
              typeSimple: 'enumDataType',
              config: {
                enumType: 'MyCompanyName.MyProjectName.MyEnum',
                dataType: 'Custom',
                customDataType: 'Enumeration',
              },
            },
          ],
          configuration: {},
          defaultValue: 2,
        },
      },
      configuration: {},
    },
    User: {
      properties: null,
      configuration: {},
    },
    ClaimType: null,
  };
}
