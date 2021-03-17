import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import moment from 'moment-timezone';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IEventsState,
  IEvent,
  IEventType,
  IEventRole,
  EVENTS_FETCH_ALL,
  EVENTS_FETCH_ONE,
  EVENT_COMMIT,
  EVENT_DELETE,
  EVENTS_SET_ALL,
  EVENTS_SET_ONE,
  EVENTS_REMOVE_ONE,
  EVENT_TYPE_SEARCH,
  EVENT_TYPES_FETCH_ALL,
  EVENT_TYPES_FETCH_ONE,
  EVENT_TYPE_COMMIT,
  EVENT_TYPE_DELETE,
  EVENT_TYPES_SET_ALL,
  EVENT_TYPES_SET_ONE,
  EVENT_TYPES_REMOVE_ONE,
  EVENT_ROLES_FETCH_ALL,
  EVENT_ROLE_COMMIT,
  EVENT_ROLE_DELETE,
  EVENT_ROLES_SET_ALL,
  EVENT_ROLES_SET_ONE,
  EVENT_ROLES_REMOVE_ONE
} from './types';

const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const fixDates = (event: IEvent) => {
  if (event.beginTime) {
    event.beginTime = moment(event.beginTime, DATETIME_FORMAT + 'Z').toDate();
  }

  if (event.endTime) {
    event.endTime = moment(event.endTime, DATETIME_FORMAT + 'Z').toDate();
  }

  if (event.shifts) {
    event.shifts.forEach((shift) => {
      shift.beginTime = moment(shift.beginTime, DATETIME_FORMAT + 'Z').toDate();
      shift.endTime = moment(shift.endTime, DATETIME_FORMAT + 'Z').toDate();
    });
  }
};

export const actions: ActionTree<IEventsState, RootState> = {
  [EVENTS_FETCH_ALL]: (
    { commit },
    range:
      | { dateBegin: Date | undefined; dateEnd: Date | undefined }
      | undefined
  ) => {
    return new Promise((resolve, reject) => {
      let url: string = 'event/';
      if (range && (range.dateBegin || range.dateEnd)) {
        url += '?';
        if (range.dateBegin) {
          url += `begin=${moment(range.dateBegin)
            .utc()
            .format(DATETIME_FORMAT)}`;
        }
        if (range.dateBegin && range.dateEnd) {
          url += '&';
        }
        if (range.dateEnd) {
          url += `end=${moment(range.dateEnd)
            .utc()
            .format(DATETIME_FORMAT)}`;
        }
      }

      axios
        .get(url)
        .then((response) => getResponseData<IEvent[]>(response))
        .then((events) => {
          events.forEach(fixDates);
          commit(EVENTS_SET_ALL, events);
          resolve(events);
        })
        .catch((error) => {
          console.log(EVENTS_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [EVENTS_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get('event/' + id)
        .then((response) => getResponseData<IEvent>(response))
        .then((event) => {
          fixDates(event);
          commit(EVENTS_SET_ONE, event);
          resolve(event);
        })
        .catch((error) => {
          console.log(EVENTS_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [EVENT_COMMIT]: ({ commit }, event: IEvent) => {
    return new Promise((resolve, reject) => {
      if (event.eventType == null || event.shifts == null) {
        reject();
        return;
      }

      const isNewEvent = event.id === '';

      let clientIdCounter = 0;

      const eventData = {
        id: isNewEvent ? undefined : event.id,
        title: event.title,
        eventTypeId: event.eventType && event.eventType.id,
        description: event.description,
        address: event.address,
        shifts: event.shifts.map((shift) => {
          return {
            delete: shift.delete,
            id: shift.id === '' ? undefined : shift.id,
            beginTime: shift.beginTime,
            endTime: shift.endTime,
            description: shift.description,
            clientId: clientIdCounter,
            shiftSalary: {...shift.shiftSalary, clientId: clientIdCounter++},
            places: shift.places.map((place) => {
              return {
                delete: place.delete,
                id: place.id === '' ? undefined : place.id,
                targetParticipantsCount: place.targetParticipantsCount,
                description: place.description,
                clientId: clientIdCounter,
                placeSalary: {...place.placeSalary, clientId: clientIdCounter++},
                equipment: place.equipment.map((equipment) => {
                  if (isNewEvent) {
                    return equipment.id;
                  } else {
                    return {
                      delete: equipment.delete,
                      id: equipment.id
                    };
                  }
                }),
                invited: [
                  ...place.invited.map((participant) => {
                    return {
                      delete: participant.delete,
                      id: participant.user.id,
                      eventRoleId:
                        participant.eventRole && participant.eventRole.id
                    };
                  }),
                  ...place.participants.reduce((acc: any[], participant) => {
                    if (participant.delete === true) {
                      return acc.concat({
                        delete: participant.delete,
                        id: participant.user.id
                      });
                    } else {
                      return acc;
                    }
                  }, [])
                ]
              };
            })
          };
        })
      };

      const eventSalary = {
        eventId: '',
        count: event.eventSalary!.count,
        description: event.eventSalary!.description,
        shiftSalaries: [] as any,
        placeSalaries: [] as any,
      };

      eventData.shifts.forEach((shift) => {
        if (!shift.shiftSalary.hasOwnProperty('isNew')) {
          eventSalary.shiftSalaries!.push(shift.shiftSalary);
        }
        delete shift.shiftSalary;
        shift.places.forEach((place) => {
          if (!place.placeSalary.hasOwnProperty('isNew')) {
            eventSalary.placeSalaries.push(place.placeSalary);
          }
          delete place.placeSalary;
        });
      });
      const url = 'event';

      const request = isNewEvent
        ? axios.post(url, eventData)
        : axios.put(url, eventData);

      request
        .then((response) => getResponseData<IEvent>(response))
        .then((event) => {
          commit(EVENTS_SET_ONE, event);
          const shifts = event.shifts.map((shift) => {
            return shift;
          });

          const places = [] as any;

          shifts.forEach((shift) => {
            shift.places.forEach((place: any) => {
              places.push(place);
            });
          });

          eventSalary.shiftSalaries.map((shiftSalary: any) => {
            const currentShift = shifts.find((shift) => {
              return shift.clientId === shiftSalary.clientId;
            });
            if (currentShift) {
              shiftSalary.shiftId = currentShift.id;
              delete shiftSalary.clientId;
            }
          });

          eventSalary.placeSalaries.map((placeSalary: any) => {
            const currentPlace = places.find((place: any) => {
              return place.clientId === placeSalary.clientId;
            });
            if (currentPlace) {
              placeSalary.placeId = currentPlace.id;
              delete placeSalary.clientId;
            }
          });
          eventSalary.eventId = event.id;
          resolve([event, eventSalary]);
        })
        .catch((error) => {
          console.log(EVENT_COMMIT, error);
          reject(error);
        });
    });
  },

  [EVENT_DELETE]: ({ commit }, event: string | IEvent) => {
    return new Promise((resolve, reject) => {
      const id = typeof event === 'string' ? event : event.id;

      axios
        .delete(`event/${id}`)
        .then((response) => {
          const body = response.data;

          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(EVENTS_REMOVE_ONE, id);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(EVENT_DELETE, error);
          reject(error);
        });
    });
  },

  [EVENT_TYPE_SEARCH]: (
    {},
    { match = '', all = false }: { match?: string; all?: boolean }
  ) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`eventType?match=${encodeURIComponent(match)}&all=${all}`)
        .then((response) => getResponseData<IEventType[]>(response))
        .then((eventTypes) => resolve(eventTypes))
        .catch((error) => {
          console.log(EVENT_TYPE_SEARCH, error);
          reject(error);
        });
    });
  },

  [EVENT_TYPES_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('eventType?all=true')
        .then((response) => getResponseData<IEventType[]>(response))
        .then((eventTypes) => {
          commit(EVENT_TYPES_SET_ALL, eventTypes);
          resolve(eventTypes);
        })
        .catch((error) => {
          console.log(EVENT_TYPES_FETCH_ALL);
          reject(error);
        });
    });
  },

  [EVENT_TYPES_FETCH_ONE]: ({ commit }, id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`eventType/${id}`)
        .then((response) => getResponseData<IEventType>(response))
        .then((eventType) => {
          commit(EVENT_TYPES_SET_ONE, eventType);
          resolve(eventType);
        })
        .catch((error) => {
          console.log(EVENT_TYPES_FETCH_ONE, error);
          reject(error);
        });
    });
  },

  [EVENT_TYPE_COMMIT]: ({ commit }, eventType: IEventType) => {
    return new Promise((resolve, reject) => {
      const url = 'eventType';

      const request =
        eventType.id === ''
          ? axios.post(url, eventType)
          : axios.put(url, eventType);

      request
        .then((response) => getResponseData<IEventType>(response))
        .then((eventType) => {
          commit(EVENT_TYPES_SET_ONE, eventType);
          resolve(eventType);
        })
        .catch((error) => {
          console.log(EVENT_TYPE_COMMIT, error);
          reject(error);
        });
    });
  },

  [EVENT_TYPE_DELETE]: ({ commit }, eventType: string | IEventType) => {
    return new Promise((resolve, reject) => {
      const id = typeof eventType === 'string' ? eventType : eventType.id;

      axios
        .delete('eventType', { data: { id } })
        .then((response) => {
          const body = response.data;

          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(EVENT_TYPES_REMOVE_ONE, id);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(EVENT_TYPE_DELETE, error);
          reject(error);
        });
    });
  },

  [EVENT_ROLES_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('eventRole')
        .then((response) => getResponseData<IEventRole[]>(response))
        .then((eventRoles) => {
          commit(EVENT_ROLES_SET_ALL, eventRoles);
          resolve(eventRoles);
        })
        .catch((error) => {
          console.log(EVENT_ROLES_FETCH_ALL);
          reject(error);
        });
    });
  },

  [EVENT_ROLE_COMMIT]: ({ commit }, eventRole: IEventRole) => {
    return new Promise((resolve, reject) => {
      const url = 'eventRole';

      const request =
        eventRole.id === ''
          ? axios.post(url, eventRole)
          : axios.put(url, eventRole);

      request
        .then((response) => getResponseData<IEventRole>(response))
        .then((eventRole) => {
          commit(EVENT_ROLES_SET_ONE, eventRole);
          resolve(eventRole);
        })
        .catch((error) => {
          console.log(EVENT_ROLE_COMMIT, error);
          reject(error);
        });
    });
  },

  [EVENT_ROLE_DELETE]: ({ commit }, eventRole: string | IEventRole) => {
    return new Promise((resolve, reject) => {
      const id = typeof eventRole === 'string' ? eventRole : eventRole.id;

      axios
        .delete('eventRole', { data: { id } })
        .then((response) => {
          const body = response.data;

          if (response.status === 200 || response.status === 201 || response.status === 204) {
            commit(EVENT_ROLES_REMOVE_ONE, id);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(EVENT_ROLE_DELETE, error);
          reject(error);
        });
    });
  }
};
