import { MutationTree } from 'vuex';
import { IReportState, IReportTypeDefault, REPORTS_SET_ALL, REPORTS_SET_ONE } from './types';

export const mutations: MutationTree<IReportState> = {
    [REPORTS_SET_ALL]: (state, payload: IReportTypeDefault[]) => {
        state.reports = payload;
    },

    [REPORTS_SET_ONE]: (state, payload: IReportTypeDefault) => {
        state.reports.unshift(payload);
    }
};
