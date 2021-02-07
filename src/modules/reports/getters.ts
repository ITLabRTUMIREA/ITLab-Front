import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  IReportState, REPORT_FILES_GET_ALL, REPORTS_GET_ALL
} from './types';

export const getters: GetterTree<IReportState, RootState> = {
  [REPORTS_GET_ALL]: (state) => {
    return state.reports;
  },

  [REPORT_FILES_GET_ALL]: (state) => {
    return state.files;
  }
};
