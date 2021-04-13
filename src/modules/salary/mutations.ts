import { MutationTree } from 'vuex';

import {
  IReportSalary,
  ISalaryState,
  REPORT_SALARY_SET_ALL
} from './types';

export const mutations: MutationTree<ISalaryState> = {
  [REPORT_SALARY_SET_ALL]: (state, payload: IReportSalary[]) => {
    state.reportsSalaries = payload;
  }
};
