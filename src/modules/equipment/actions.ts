import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IEquipmentState,
  IEquipment,
  IEquipmentType,
  EQUIPMENT_SEARCH,
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_FETCH_ONE,
  EQUIPMENT_FETCH_MY,
  EQUIPMENT_FETCH_ASSIGNED_TO,
  EQUIPMENT_COMMIT,
  EQUIPMENT_DELETE,
  EQUIPMENT_SET_ALL,
  EQUIPMENT_SET_ONE,
  EQUIPMENT_REMOVE_ONE,
  EQUIPMENT_TYPE_SEARCH,
  EQUIPMENT_TYPES_FETCH_ALL,
  EQUIPMENT_TYPES_FETCH_ONE,
  EQUIPMENT_TYPE_COMMIT,
  EQUIPMENT_TYPE_DELETE,
  EQUIPMENT_TYPES_SET_ALL,
  EQUIPMENT_TYPES_SET_ONE,
  EQUIPMENT_TYPES_REMOVE_ONE
} from './types';

export const actions: ActionTree<IEquipmentState, RootState> = {
  [EQUIPMENT_SEARCH]: ({ }, match: string = '') => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipment?match=${encodeURIComponent(match)}`)
        .then((response) => getResponseData<IEquipment[]>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(EQUIPMENT_SEARCH, error);
          reject();
        });
    });
  },

  [EQUIPMENT_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('equipment')
        .then((response) => getResponseData<IEquipment[]>(response))
        .then((equipment) => {
          commit(EQUIPMENT_SET_ALL, equipment);
          resolve(equipment);
        })
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipment/${id}`)
        .then((response) => getResponseData<IEquipment>(response))
        .then((equipment) => {
          commit(EQUIPMENT_SET_ONE, equipment);
          resolve(equipment);
        })
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_FETCH_MY]: () => {
    return new Promise((resolve, reject) => {
      axios
        .get('equipment/user')
        .then((response) => getResponseData<IEquipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_MY, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_FETCH_ASSIGNED_TO]: ({ }, userId: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipment/user/${userId}`)
        .then((response) => getResponseData<IEquipment>(response))
        .then((equipment) => resolve(equipment))
        .catch((error) => {
          console.log(EQUIPMENT_FETCH_ASSIGNED_TO, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_COMMIT]: ({ commit }, equipment: IEquipment) => {
    return new Promise((resolve, reject) => {
      const url = 'equipment';

      const request =
        equipment.id === ''
          ? axios.post(url, equipment)
          : axios.put(url, equipment);

      request
        .then((response) => getResponseData<IEquipment>(response))
        .then((newEquipment) => {
          newEquipment.equipmentType = equipment.equipmentType;
          commit(EQUIPMENT_SET_ONE, newEquipment);
          resolve(newEquipment);
        })
        .catch((error) => {
          console.log(EQUIPMENT_COMMIT, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_DELETE]: ({ commit }, equipment: string | IEquipment) => {
    return new Promise((resolve, reject) => {
      const equipmentId =
        typeof equipment === 'string' ? equipment : equipment.id;

      axios
        .delete('equipment', { data: { id: equipmentId } })
        .then((response) => {
          const body = response.data;

          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(EQUIPMENT_REMOVE_ONE, equipmentId);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(EQUIPMENT_DELETE, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPE_SEARCH]: (
    { },
    { match = '', all = false }: { match?: string; all?: boolean }
  ) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipmentType?match=${encodeURIComponent(match)}&all=${all}`)
        .then((response) => getResponseData<IEquipmentType[]>(response))
        .then((equipmentTypes) => resolve(equipmentTypes))
        .catch((error) => {
          console.log(EQUIPMENT_TYPE_SEARCH, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPES_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('equipmentType?all=true')
        .then((response) => getResponseData<IEquipmentType[]>(response))
        .then((equipmentTypes) => {
          commit(EQUIPMENT_TYPES_SET_ALL, equipmentTypes);
          resolve(equipmentTypes);
        })
        .catch((error) => {
          console.log(EQUIPMENT_TYPES_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPES_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`equipmentType/${id}`)
        .then((response) => getResponseData<IEquipmentType>(response))
        .then((equipmentType) => {
          commit(EQUIPMENT_TYPES_SET_ONE, equipmentType);
          resolve(equipmentType);
        })
        .catch((error) => {
          console.log(EQUIPMENT_TYPES_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPE_COMMIT]: ({ commit }, equipmentType: IEquipmentType) => {
    return new Promise((resolve, reject) => {
      const url = 'equipmentType';

      const request =
        equipmentType.id === ''
          ? axios.post(url, equipmentType)
          : axios.put(url, [equipmentType]);

      request
        .then((response) => getResponseData<IEquipmentType>(response))
        .then((equipmentType) => {
          commit(EQUIPMENT_TYPES_SET_ONE, equipmentType);
          resolve(equipmentType);
        })
        .catch((error) => {
          console.log(EQUIPMENT_TYPE_COMMIT, error);
          reject(error);
        });
    });
  },

  [EQUIPMENT_TYPE_DELETE]: (
    { commit },
    equipmentType: string | IEquipmentType
  ) => {
    return new Promise((resolve, reject) => {
      const equipmentTypeId =
        typeof equipmentType === 'string' ? equipmentType : equipmentType.id;

      axios
        .delete('equipmentType', { data: { id: equipmentTypeId } })
        .then((response) => {
          const body = response && response.data;

          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(EQUIPMENT_TYPES_REMOVE_ONE, equipmentTypeId);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(EQUIPMENT_TYPE_DELETE, error);
          reject(error);
        });
    });
  }
};
