import Vue from 'vue';

// Plugins initialization //
///////////////////////////

// VueMoment
import VueMoment from 'vue-moment';
import 'moment/locale/ru';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/Moscow');
Vue.use(VueMoment, { moment });

// SvgIcon
import * as svgicon from 'vue-svgicon';

Vue.use(svgicon, { tagName: 'svgicon' });

// VueHammer
import { VueHammer } from 'vue2-hammer';

Vue.use(VueHammer);

// Autosize
import VueAutosize from 'vue-autosize';

Vue.use(VueAutosize);

// Bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

// Notifications
import VueNotifications from 'vue-notification';

Vue.use(VueNotifications);

// DateRangePicker

import VMdDateRangePicker from 'v-md-date-range-picker';
// import 'v-md-date-range-picker/dist/v-md-date-range-picker.css';

Vue.use(VMdDateRangePicker);

// VueMarkdown //
////////////////

import VueMarkdown from 'vue-markdown';

VueMarkdown.props.html.default = false;
VueMarkdown.props.anchorAttributes.default = () => ({ target: '_blank' });
Vue.component('vue-markdown', VueMarkdown);

// Initialize Vue //
///////////////////

import globals from '@/globals';
import store from '@/store';
import router from '@/router';
import App from './App.vue';
import axios from 'axios';
import configuration from './stuff/configuration';
import { UserManager } from './UserManager';
import Oidc from 'oidc-client';

Vue.prototype.$g = globals;

function initConfiguration(data: any): void {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      configuration[key] = element;
    }
  }
}

// Loading runtime configuration
axios.get(`${window.location.origin}/config.json`)
  .then((a: any) => {

    initConfiguration(a.data);
    const userManager = new UserManager(new Oidc.UserManager({
      authority: configuration.VUE_APP_AUTHORITY,
      client_id: configuration.VUE_APP_CLIENT_ID,
      redirect_uri: configuration.VUE_APP_REDIRECT_URI,
      response_type: configuration.VUE_APP_RESPONSE_TYPE,
      scope: configuration.VUE_APP_SCOPE,
      post_logout_redirect_uri: configuration.VUE_APP_POST_LOGOUT_REDIRECT_URI,
      automaticSilentRenew: true,
      silent_redirect_uri: configuration.VUE_APP_SILENT_REDIRECT_URI
    }));
    Vue.prototype.$userManager = userManager;
    new Vue({
      store,
      router: router(userManager),
      render: (h) => h(App)
    }).$mount('#app');
  });
