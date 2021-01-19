import { Module } from 'vuex';
import { RootState } from '@/store';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { ILayoutState } from './types';

export * from './types';

// used pages

import {
  // @ts-ignore
  loginPageRoute,
  // @ts-ignore
  registrationPageRoute,
  // @ts-ignore
  passwordRestorePageRoute,
  // @ts-ignore
  processingAgreementPageRoute,
  // @ts-ignore
  loginCallBackPageRoute,
  // @ts-ignore
  silentCallBackPageRoute,
} from '@/views/authorization';

// @ts-ignore
import { notificationsPageRoute } from '@/views/notifications';

import {
  // @ts-ignore
  eventsPageRoute,
  // @ts-ignore
  eventEditPageRoute,
  // @ts-ignore
  eventDetailPageRoute
} from '@/views/events';

// @ts-ignore
import { equipmentPageRoute, equipmentEditPageRoute } from '@/views/equipment';

// @ts-ignore
import { projectsPageRoute, projectEditPageRoute } from '@/views/projects';

// @ts-ignore
import { profilePageRoute } from '@/views/profile';


import {
  // @ts-ignore
  aboutPageRoute,
  // @ts-ignore
  usersPageRoute,
  // @ts-ignore
  settingsPageRoute,
  // @ts-ignore,
  typeEditPageRoute,
  // @ts-ignore
  backendSelectionPageRoute,
  // @ts-ignore
  reportsPageRoute
} from '@/views/system';

export const state: ILayoutState = {
  stuff: [
    aboutPageRoute,
    loginPageRoute,
    loginCallBackPageRoute,
    silentCallBackPageRoute,
    registrationPageRoute,
    passwordRestorePageRoute,
    processingAgreementPageRoute,
    backendSelectionPageRoute
  ],
  groups: [
    {
      name: 'general',
      title: 'Общее',
      sections: [
        {
          name: 'profile',
          title: 'Профиль',
          homeURL: '/profile',
          pages: [profilePageRoute]
        },
        {
          name: 'notifications',
          title: 'Уведомления',
          homeURL: '/notifications',
          pages: [notificationsPageRoute]
        },
        {
          name: 'events',
          title: 'События',
          homeURL: '/events',
          pages: [eventsPageRoute, eventDetailPageRoute, eventEditPageRoute]
        },
        {
          name: 'equipment',
          title: 'Оборудование',
          homeURL: '/equipment',
          pages: [equipmentPageRoute, equipmentEditPageRoute]
        },
        {
          name: 'projects',
          title: 'Проекты (в разработке)',
          homeURL: '/projects',
          pages: [projectsPageRoute, projectEditPageRoute],
          anotherFrontEnd: true
        },
        {
          name: 'reports',
          title: 'Отчеты (тестирование)',
          homeURL: `/reports`,
          pages: [reportsPageRoute]
        }
      ]
    },
    {
      name: 'system',
      title: 'Система',
      sections: [
        {
          name: 'users',
          title: 'Пользователи',
          homeURL: '/users',
          pages: [usersPageRoute]
        },
        {
          name: 'typeEdit',
          title: 'Типы',
          homeURL: '/type_edit',
          pages: [typeEditPageRoute]
        },
        {
          name: 'profileSettings',
          title: 'Настройки',
          homeURL: '/settings',
          pages: [settingsPageRoute]
        }
      ]
    }
  ]
};

export const layout: Module<ILayoutState, RootState> = {
  state,
  getters,
  actions,
  mutations
};
