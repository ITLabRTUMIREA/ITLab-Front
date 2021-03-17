import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { ISalaryState } from './types';

export * from './types';

export const state: ISalaryState = {
    eventSalaries: [],
    reportsSalaries: []
};

export const salary: Module<ISalaryState, RootState> = {
  state,
  actions,
  getters,
  mutations
};
