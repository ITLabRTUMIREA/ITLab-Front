import { GetterTree } from 'vuex';
import { RootState } from '@/store';

import {
  ISalaryState,
  ReportSalary,
  REPORT_SALARY_GET_ALL,
  REPORT_SALARY_GET_ONE
} from './types';

export const getters: GetterTree<ISalaryState, RootState> = {
  [REPORT_SALARY_GET_ALL]: (state) => {
    return state.reportsSalaries;
  },

  [REPORT_SALARY_GET_ONE]: (state) => (reportId: string) => {
    console.log(`${reportId}: ${JSON.stringify(state.reportsSalaries.find((salary) => salary.reportId === reportId))}`);
    return state.reportsSalaries.find((salary) => salary.reportId === reportId) || new ReportSalary();
  }
};
