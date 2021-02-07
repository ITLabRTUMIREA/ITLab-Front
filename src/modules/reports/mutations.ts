import { MutationTree } from 'vuex';
import {
    IReportFile,
    IReportState,
    IReportTypeDefault,
    REPORT_FILES_SET_ALL,
    REPORT_FILE_SET_ONE,
    REPORTS_SET_ALL,
    REPORTS_SET_ONE,
    REPORT_FILE_REMOVE
} from './types';

export const mutations: MutationTree<IReportState> = {
    [REPORTS_SET_ALL]: (state, payload: IReportTypeDefault[]) => {
        state.reports = payload;
    },

    [REPORTS_SET_ONE]: (state, payload: IReportTypeDefault) => {
        state.reports.unshift(payload);
    },

    [REPORT_FILES_SET_ALL]: (state, payload: IReportFile[]) => {
        state.files = payload;
    },

    [REPORT_FILE_SET_ONE]: (state, payload: IReportFile) => {
        state.files.unshift(payload);
    },

    [REPORT_FILE_REMOVE]: (state, payload: string) => {
        state.files = state.files.filter((file) => file.id.indexOf(payload) === -1);
    }
};
