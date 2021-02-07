<!-- TEMPALTE BEGIN -->
<template>
  <div>
    <vue-headful title="Отчёты"></vue-headful>
    <page-content :loading="loadingInProcess">
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
          <b-form-input
            v-model="name"
            placeholder="Название отчёта"
          >
          </b-form-input>
          <b-form-textarea
            id="report"
            rows="10"
            v-model="report"
            @drop="handleFile"
            @dragenter="() => changeBorder(true)"
            @dragleave="() => changeBorder(false)"
            @dragover="(e) => e.preventDefault()"
            :class="textareaBorder"
          >
          </b-form-textarea>

          <b-row>
            <b-button class="ml-md-auto mr-md-3" variant="primary" @click="sendReport">
              Отправить
            </b-button>
          </b-row>
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
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';

import configuration from '../../stuff/configuration';
import CPageContent from '../../components/layout/PageContent.vue';

import {
  USERS_FETCH_ALL,
  USERS_GET_ALL_LIST
} from '../../modules/users';

import {
  IReportFile,
  IReportTypeDefault,
  REPORTS_FETCH_ALL,
  REPORT_FILES_GET_ALL,
  REPORTS_GET_ALL,
  REPORT_COMMIT,
  REPORT_FILE_COMMIT,
  REPORT_FILE_FETCH_ALL
} from '../../modules/reports';
import CReportItem, { ReportImplementer } from '../../components/ReportItem.vue';
import { IReportSalary, REPORT_SALARY_FETCH_ALL } from '../../modules/salary';
import { getResponseData } from '../../stuff';
import CFileItem from '../../components/FileItem.vue';

const LOCAL_STORAGE_API_URL = 'api-url';

@Component({
  components: {
    'page-content': CPageContent,
    'report-item': CReportItem,
    'file-item': CFileItem
  }
})
export default class ReportsPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;

  // Select field
  public subject: string = '';

  // Report field
  public name: string = '';
  public report: string = '';

  public salaries: IReportSalary[] = [];

  public baseAddress: string = location.origin;
  public accessToken?: string | null;
  public filesBaseAddress?: string = configuration.VUE_APP_FILES_BASE_ADDRESS;
  public filesLoading: boolean = false;

  public border: string = '';

  public reportImplementer = {
    Me: ReportImplementer.Me,
    Others: ReportImplementer.Others
  };

  // Component methods //
  //////////////////////

  public async mounted() {
    Promise.all([
      this.$store.dispatch(USERS_FETCH_ALL),
      this.$store.dispatch(REPORTS_FETCH_ALL),
      this.$store.dispatch(REPORT_FILE_FETCH_ALL)
    ])
      .then(async () => {
        this.subject = (await this.$userManager.getUserId()) || '';
        this.loadingInProcess = false;
        this.$store.dispatch(REPORT_SALARY_FETCH_ALL, this.subject);
      })
      .catch();

    if (localStorage.getItem('reportText') !== null) {
      this.report = localStorage.getItem('reportText') || '';
    }

    setInterval(() => localStorage.setItem('reportText', this.report), 1000);
  }

  // Methods //
  ////////////

  public async sendReport() {
    const report: IReportTypeDefault = {
      id: '',
      name: this.name,
      text: this.report,
      assignees: {
        reporter: (await this.$userManager.getUserId()) || '',
        implementer: this.subject
      }
    };

    this.$store.dispatch(REPORT_COMMIT, report)
      .then(async () => {
        this.name = '';
        this.report = '';
        this.subject = (await this.$userManager.getUserId()) || '';
      });
  }

  public async handleFile(e: DragEvent) {
    e.preventDefault();
    this.changeBorder(false);

    const files: File[] = [];

    // @ts-ignore
    if (e.dataTransfer.items) {
      // @ts-ignore
      for (const item of e.dataTransfer.items) {
        if (item.kind === 'file') {
          files.push(item.getAsFile());
        }
      }
    } else {
      // @ts-ignore
      for (const file of e.dataTransfer.files) {
        if (file) {
          files.push(file);
        }
      }
    }

    const area = document.getElementById('report') as HTMLTextAreaElement;
    if (area.selectionStart || area.selectionEnd === 0 && files.length > 0) {
      this.filesLoading = true;

      const end = area.selectionEnd;
      for (const file of files) {

        this.report = this.report.substring(0, end) + `\n[Uploading ${file.name}...]()\n`
          + this.report.substring(end, this.report.length);

        const fileData = (await this.$store.dispatch(REPORT_FILE_COMMIT, file));

        const isImg = /[w]*.(jpg|png|gif)$/.test(fileData.filename.toLowerCase());

        this.report = this.report.replace(
          `[Uploading ${file.name}...]()`,
          `${isImg ? '!' : ''}[${fileData.filename}](${this.origin}mfs/download/${fileData.id})`
        );
      }
    }
  }

  public changeBorder(status: boolean) {
    if (status) {
      this.border = 'drop-border';
    } else {
      this.border = '';
    }
  }

  get reportsAboutMe() {
    return (this.$store.getters[REPORTS_GET_ALL] as IReportTypeDefault[]).filter((report) =>
      report.assignees.implementer.indexOf(this.subject) > -1
    );
  }

  get reportsAboutOthers() {
    return (this.$store.getters[REPORTS_GET_ALL] as IReportTypeDefault[]).filter((report) =>
      report.assignees.implementer.indexOf(this.subject) === -1
        && report.assignees.reporter.indexOf(this.subject) !== -1
    );
  }

  get authors() {
    return this.$store.getters[USERS_GET_ALL_LIST];
  }

  get files() {
    return this.$store.getters[REPORT_FILES_GET_ALL];
  }

  get textareaBorder() {
    return this.border;
  }

  get origin(): string {
    console.log(location.origin);
    if (location.origin.indexOf(':') > -1) {
      return localStorage.getItem('api-url') || '';
    } else {
      return location.origin + '/api/';
    }
  }
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

.drop-border {
  box-shadow: -1px 1px 0 #007bff, 1px -1px 0 #007bff, -1px -1px 0 #007bff, 1px 1px 0 #007bff;
}
</style>
<!-- STYLE END -->