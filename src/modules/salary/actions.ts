import { ActionTree } from 'vuex';
import store, { RootState } from '@/store';
import axios from 'axios';
import moment from 'moment-timezone';

import { getResponseData } from '@/stuff';

import {
  IEventSalary,
  ISalaryState,
  EVENT_SALARY_FETCH_ALL,
  EVENT_SALARY_FETCH_ONE,
  EVENT_SALARY_COMMIT,
  EVENT_SALARY_DELETE,
  REPORT_SALARY_FETCH_ALL,
  REPORT_SALARY_SET_ALL,
  ReportSalary,
  IReportSalary,
} from './types';
import { salary } from '.';

const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const actions: ActionTree<ISalaryState, RootState> = {
  [EVENT_SALARY_FETCH_ALL]: ({ }, range: | { dateBegin: Date | undefined; dateEnd: Date | undefined } | undefined
  ) => {
    return new Promise((resolve, reject) => {
      let url: string = '/salary/v1/event/';
      if (range) {
        if (range.dateBegin) {
          url = url + '?' + `begin=${moment(range.dateBegin)
            .utc()
            .format(DATETIME_FORMAT)}`;
        }
      }
      axios.get(url)
        .then((response) => getResponseData<IEventSalary>(response))
        .then((eventSalary) => {
          resolve(eventSalary);
        })
        .catch((error) => {
          console.log(EVENT_SALARY_FETCH_ALL, error);
          reject(error);
        });
    });
  },

  [EVENT_SALARY_FETCH_ONE]: ({ }, eventId: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`/salary/v1/event/${eventId}`)
        .then((response) => getResponseData<IEventSalary>(response))
        .then((eventSalary) => {
          resolve(eventSalary);
        })
        .catch((error) => {
          resolve(false);
        });
    });
  },

  [EVENT_SALARY_COMMIT]: ({ }, eventSalary: IEventSalary | any) => {

    const id = eventSalary.eventId;
    delete eventSalary.eventId;

    return new Promise((resolve, reject) => {
      axios.put(`/salary/v1/event/${id}`, eventSalary)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(EVENT_SALARY_COMMIT, error);
          reject(error);
        });
    });
  },

  [EVENT_SALARY_DELETE]: ({ }, id: string) => {
    return new Promise((resolve, reject) => {
      axios.delete(`/salary/v1/event/${id}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(EVENT_SALARY_DELETE, error);
          reject(error);
        });
    });
  },

  [REPORT_SALARY_FETCH_ALL]: ({ commit }, userId: string) => {
    return new Promise((resolve, reject) => {
      axios.get(`salary/v1/report/user/${userId}`)
        .then((response) => getResponseData<IReportSalary[]>(response))
        .then((salaries) => {
          commit(REPORT_SALARY_SET_ALL, salaries);
          resolve(salaries);
        })
        .catch((error) => {
          console.log(REPORT_SALARY_FETCH_ALL, error);
          reject();
        });
    });
  }
};
