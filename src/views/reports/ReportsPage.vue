<!-- TEMPALTE BEGIN -->
<template>
  <div>
    <vue-headful title="Отчёты"></vue-headful>
    <page-content :loading="!loadingInProcess"> <!-- TODO: Change loading NOT -->
      <template slot="header">Отчёты</template>

      <b-tabs>
        <b-tab title="Написать">
          <br />
          <p>Опишите, что вы делали за последнее время, что вы считаете важным при оценке вашей работы</p>
          <p>Вы можете прикрепить изображения или документы. Формат описания поддерживает формат Markdown</p>
          
          <h4 class="mt-3">О ком отчёт</h4>
          <b-form-select
            v-model="author"
            :options="authors"
          >
          </b-form-select>

          <h4 class="mt-4">Ваш отчёт</h4>
          <b-form-input
            v-model="name"
            placeholder="Название отчёта"
          >
          </b-form-input>
          <b-form-textarea
            rows="10"
            v-model="report"
          >
          </b-form-textarea>
        </b-tab>
        <b-tab title="Отчёты обо мне">
          <br />
          
        </b-tab>
        <b-tab title="Мои отчёты о других">
          <br />
          
        </b-tab>
        <b-tab title="Прикрепленные файлы">
          <br />
          
        </b-tab>
      </b-tabs>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';
import configuration from '../../stuff/configuration';
import CPageContent from '../../components/layout/PageContent.vue';

const LOCAL_STORAGE_API_URL = 'api-url';

@Component({
  components: {
    'page-content': CPageContent
  }
})
export default class ReportsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  // Select field
  public author: string = '';
  public authors: Array<{ text: string, value: string }> = [];

  // Report field
  public name: string = '';
  public report: string = '';

  public baseAddress: string = location.origin;
  public accessToken?: string | null;
  public filesBaseAddress?: string = configuration.VUE_APP_FILES_BASE_ADDRESS;

  // Component methods //
  //////////////////////

  public async mounted() {
    this.authors.push({ text: 'Qqq', value: '1' });
    this.authors.push({ text: 'www', value: '2' });
    this.authors.push({ text: 'eee', value: '3' });
    this.authors.push({ text: 'aaa', value: '4' });
    this.author = '1';
  }

  // Methods //
  ////////////

}

export const reportsPageRoute: RouteConfig = {
  path: '/reports',
  name: 'reports',
  component: ReportsPage,
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

select {
  color: #007bff !important;

  > * {
    color: #1e1e1e !important;
  }
}
</style>
<!-- STYLE END -->