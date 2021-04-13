<!-- TEMPALTE BEGIN -->
<template>
  <div class="backend-selection-page">
    <vue-headful title="Смена API"></vue-headful>
    <b-container class="content">
      <br>
      <b-form>
        <b-form-group label="API URL">
          <b-input-group>
            <b-form-input type="text" v-model="apiUrl">
            </b-form-input>
            <b-input-group-append>
              <b-button variant="outline-primary" @click="applyChanges">Apply</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-button variant="outline-secondary" @click="resetDefaults">Default</b-button>
          
          <b-button variant="outline-secondary ml-1" v-for="(url, index) in backendApiVariants" :key="`url-${index}`" @click="setApiUrl(url)">
            {{ url }}
          </b-button>
        </b-form-group>
      </b-form>
    </b-container>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';
import configuration from '../../stuff/configuration';

const LOCAL_STORAGE_API_URL = 'api-url';

@Component
export default class BackendSelectionPage extends Vue {
  // Properties //
  ///////////////

  public apiUrl: string = '';

  public backendApiVariants = [
    '/api/',
    'http://localhost:5000/api/'
  ];

  // Component methods //
  //////////////////////

  public mounted() {
    this.apiUrl = axios.defaults.baseURL || '';
  }

  // Methods //
  ////////////

  public applyChanges() {
    localStorage.setItem(LOCAL_STORAGE_API_URL, this.apiUrl);
    axios.defaults.baseURL = this.apiUrl;

    this.$notify({
      text: 'Изменения сохранены',
      duration: 500
    });
  }

  public resetDefaults() {
    this.setApiUrl(configuration.VUE_APP_API_URL || '/api/');
  }

  public setApiUrl(url: string) {
    localStorage.removeItem('api-url');
    this.apiUrl = url;
    axios.defaults.baseURL = this.apiUrl;
  }
}

export const backendSelectionPageRoute: RouteConfig = {
  path: '/backend_selection',
  name: 'BackendSelection',
  component: BackendSelectionPage,
  meta: {
    secure: false,
    hideNavigation: true
  }
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->