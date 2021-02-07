import { Module } from 'vuex';
import { RootState } from '@/store';

// import all
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { IReportState } from './types';

export * from './types';

export const state: IReportState = {
  reports: [],
  files: []
};

export const reports: Module<IReportState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
