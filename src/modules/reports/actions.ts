import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IReportState,
  IReportTypeDefault,
  REPORTS_FETCH_ALL,
  REPORTS_SET_ALL,
  REPORTS_SET_ONE,
  REPORT_COMMIT
} from './types';

const fixDate = (report: IReportTypeDefault) => {
  report.date = report.date + 'Z';
};

export const actions: ActionTree<IReportState, RootState> = {
  [REPORTS_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('reports?sorted_by=date')
        .then((response) => getResponseData<IReportTypeDefault[]>(response))
        .then((reports) => {
          reports.forEach(fixDate);
          reports.reverse();
          commit(REPORTS_SET_ALL, reports);
          resolve();
        })
        .catch((error) => {
          console.log(REPORTS_FETCH_ALL, error);
          reject();
        });
    });
  },

  [REPORT_COMMIT]: ({ commit }, report: IReportTypeDefault) => {
    return new Promise((resolve, reject) => {
      const isNewReport = report.id === '';

      const reportData = {
        id: report.id,
        name: report.name,
        text: report.text,
        date: new Date().toISOString(),
        assignees: {
          reporter: report.assignees.reporter,
          implementer: report.assignees.implementer
        },
        archived: false
      };

      if (reportData.id === '') {
        // @ts-ignore
        delete reportData.id;
      }

      const request = reportData.id
        ? axios.put(`reports/${reportData.id}`)
        : axios.post(`reports?implementer=${reportData.assignees.implementer}`, reportData);

      request
        .then((response) => getResponseData<IReportTypeDefault>(response))
        .then((report) => {
          fixDate(report);
          commit(REPORTS_SET_ONE, report);
          resolve();
        })
        .catch((error) => {
          console.log(REPORT_COMMIT, error);
          reject();
        });
    });
  }
};
