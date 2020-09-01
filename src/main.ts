import './set-public-path';
import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';

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

import Default from '@/components/layout/Default.vue';
import NoSidebar from '@/components/layout/NoSidebar.vue';
import vueHeadful from 'vue-headful';

Vue.component('default-layout', Default);
Vue.component('no-sidebar-layout', NoSidebar);
Vue.component('vue-headful', vueHeadful);

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
// function getUserManagerConfiguration() {

//   let temp: any = null;
//   console.log("AXIOS");
  
//   axios.get(`http://localhost:8081/config.json`)
//   .then((a: any) => {
//     console.log("THEN");
    
//     initConfiguration(a.data);
//     const userManager = new UserManager(new Oidc.UserManager({
//       authority: configuration.VUE_APP_AUTHORITY,
//       client_id: configuration.VUE_APP_CLIENT_ID,
//       redirect_uri: configuration.VUE_APP_REDIRECT_URI,
//       response_type: configuration.VUE_APP_RESPONSE_TYPE,
//       scope: configuration.VUE_APP_SCOPE,
//       post_logout_redirect_uri: configuration.VUE_APP_POST_LOGOUT_REDIRECT_URI,
//       automaticSilentRenew: true,
//       silent_redirect_uri: configuration.VUE_APP_SILENT_REDIRECT_URI
//     }));

//     Vue.prototype.$userManager = userManager;
//     temp = userManager;
//   });
//   console.log("RETURN");
  
//   return temp;
// }

let userManager!: any;

let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:8081/config.json', false);
xhr.send();

if (xhr.status != 200) {
  console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
} else {
  let jsonResponse = JSON.parse(xhr.response)

  initConfiguration(jsonResponse);
   userManager = new UserManager(new Oidc.UserManager({
     authority: configuration.VUE_APP_AUTHORITY,
     client_id: configuration.VUE_APP_CLIENT_ID,
     redirect_uri: configuration.VUE_APP_REDIRECT_URI,
     response_type: configuration.VUE_APP_RESPONSE_TYPE,
     scope: configuration.VUE_APP_SCOPE,
     post_logout_redirect_uri: configuration.VUE_APP_POST_LOGOUT_REDIRECT_URI,
     automaticSilentRenew: true,
     silent_redirect_uri: configuration.VUE_APP_SILENT_REDIRECT_URI
   }));
}

// (async function(){
//   console.log("AXIOS");
//   let response = await axios.get(`http://localhost:8081/config.json`);
//   console.log("AFTER AXIOS");
//   console.log("RESPONSE " + response);
  
  
//   initConfiguration(response.data);
//   userManager = new UserManager(new Oidc.UserManager({
//     authority: configuration.VUE_APP_AUTHORITY,
//     client_id: configuration.VUE_APP_CLIENT_ID,
//     redirect_uri: configuration.VUE_APP_REDIRECT_URI,
//     response_type: configuration.VUE_APP_RESPONSE_TYPE,
//     scope: configuration.VUE_APP_SCOPE,
//     post_logout_redirect_uri: configuration.VUE_APP_POST_LOGOUT_REDIRECT_URI,
//     automaticSilentRenew: true,
//     silent_redirect_uri: configuration.VUE_APP_SILENT_REDIRECT_URI
//   }));
//   console.log(userManager);
  
// })();
// axios.get(`http://localhost:8081/config.json`)
//   .then((a: any) => {
//     console.log("THEN");
    
//     initConfiguration(a.data);
//     userManager = new UserManager(new Oidc.UserManager({
//       authority: configuration.VUE_APP_AUTHORITY,
//       client_id: configuration.VUE_APP_CLIENT_ID,
//       redirect_uri: configuration.VUE_APP_REDIRECT_URI,
//       response_type: configuration.VUE_APP_RESPONSE_TYPE,
//       scope: configuration.VUE_APP_SCOPE,
//       post_logout_redirect_uri: configuration.VUE_APP_POST_LOGOUT_REDIRECT_URI,
//       automaticSilentRenew: true,
//       silent_redirect_uri: configuration.VUE_APP_SILENT_REDIRECT_URI
//     }));

//     Vue.prototype.$userManager = userManager;
//   });

// const userManager = getUserManagerConfiguration();

Vue.prototype.$userManager = userManager;

Vue.config.productionTip = false;

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render: (h: any) => h(App),
    router: router(userManager),
    store,
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
