<!-- TEMPALTE BEGIN -->
<template>
  <div id="reports-page">
    <vue-headful title="Отчёты"></vue-headful>
    <!-- <page-content :loading="loadingInProcess">
      <template slot="header">Отчёты</template>

      <b-tabs>
        <b-tab title="Написать">
          <br />
          <p>Опишите, что вы делали за последнее время, что вы считаете важным при оценке вашей работы</p>
          <p>Вы можете прикрепить изображения или документы. Формат описания поддерживает формат Markdown</p>
          
          <h4 class="mt-3">О ком отчёт</h4>
          <b-form-select
            v-model="subject"
            :options="authors"
          >
          </b-form-select>

          <h4 class="mt-4">Ваш отчёт</h4>
          <markdown-editor v-model="report">
            <template slot="title">
              <b-form-input
                v-model="name"
                placeholder="Название отчёта"
              >
              </b-form-input>
            </template>
            <template slot="actionButton">
              <b-button class="ml-md-auto" style="margin-top: 8px;" variant="primary" @click="sendReport">
                Отправить
              </b-button>
            </template>
          </markdown-editor>
        </b-tab>
        <b-tab title="Отчёты обо мне">
          <br />

          <b-row v-for="report in reportsAboutMe" :key="report.id">
            <b-col>
              <report-item
                :report="report"
                :implementer="reportImplementer.Me"
              ></report-item>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Мои отчёты о других">
          <br />
          
          <b-row v-for="report in reportsAboutOthers" :key="report.id">
            <b-col>
              <report-item
                :report="report"
                :implementer="reportImplementer.Others"
              ></report-item>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Прикрепленные файлы">
          <br />
          
          <b-row v-for="file in files" :key="file.id">
            <b-col>
              <file-item
                :file="file"
              ></file-item>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </page-content> -->
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

const LOCAL_STORAGE_API_URL = 'api-url';

@Component
export default class ReportsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  public timerId: number = 0;

  // Component methods //
  //////////////////////

  public async mounted() {
    this.timerId = setInterval(() => {
      if (document.getElementById('reports-page')!.hasChildNodes()) {
        this.loadingInProcess = false;
        clearInterval(this.timerId);
      }
    });
  }

  // Methods //
  ////////////
}

export const reportsPageRoute: RouteConfig = {
  path: '/reports',
  name: 'reports',
  component: ReportsPage,
};

export const reportPageRoute: RouteConfig = {
  path: '/reports/:id',
  name: 'reports',
  component: ReportsPage,
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';
</style>
<!-- STYLE END -->