import { ActionTree } from 'vuex';
import { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
  IReportFile,
  IReportState,
  IReportTypeDefault,
  REPORTS_FETCH_ALL,
  REPORT_FILES_SET_ALL,
  REPORT_FILE_SET_ONE,
  REPORTS_SET_ALL,
  REPORTS_SET_ONE,
  REPORT_COMMIT,
  REPORT_FILE_COMMIT,
  REPORT_FILE_FETCH_ALL,
  REPORT_FILE_DELETE,
  REPORT_FILE_REMOVE
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
          resolve(reports);
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
          resolve(report);
        })
        .catch((error) => {
          console.log(REPORT_COMMIT, error);
          reject();
        });
    });
  },

  [REPORT_FILE_FETCH_ALL]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.get('mfs/files?sorted_by=date')
        .then((response) => getResponseData<IReportFile[]>(response))
        .then((files) => {
          files.reverse();
          commit(REPORT_FILES_SET_ALL, files);
          resolve(files);
        })
        .catch((error) => {
          console.log(REPORT_FILE_FETCH_ALL, error);
          reject();
        });
    });
  },

  [REPORT_FILE_COMMIT]: ({ commit }, file: File) => {
    return new Promise((resolve, reject) => {
      const body = new FormData();
      body.append('uploadingForm', file);
      body.append('fileDescription', file);

      axios.post('mfs/files/upload', body)
        .then((response) => getResponseData<IReportFile>(response))
        .then((file) => {
          commit(REPORT_FILE_SET_ONE, file);
          resolve(file);
        })
        .catch((error) => {
          console.log(REPORT_FILE_COMMIT, error);
          reject();
        });
    });
  },

  [REPORT_FILE_DELETE]: ({ commit }, fileId: string) => {
    return new Promise((resolve, reject) => {
      axios.delete(`mfs/files/${fileId}`)
        .then(() => {
          commit(REPORT_FILE_REMOVE, fileId);
          resolve(true);
        })
        .catch((error) => {
          console.log(REPORT_FILE_DELETE, error);
          reject();
        });
    });
  }
};
