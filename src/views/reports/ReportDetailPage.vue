<!-- TEMPALTE BEGIN -->
<template>
  <div>
    <vue-headful title="Отчёты"></vue-headful>
    <page-content :loading="loadingInProcess">
      <template slot="header">Отчёты</template>

      <b-row>
        <b-col md="auto" class="mr-auto">
          <h4>{{ report.name || `Отчёт (${date})` }}</h4>
        </b-col>
        <b-col md="auto" style="margin: auto 0;">
          <b>{{date}}</b>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <div id="preview">
            <markdown-it-vue class="md-body" :content="report.text" />
          </div>
        </b-col>
      </b-row>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import moment from 'moment-timezone';
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import CPageContent from '../../components/layout/PageContent.vue';
import { ReportTypeDefault, REPORT_FETCH_ONE } from '../../modules/reports';

import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';

Vue.component(MarkdownItVue.name, MarkdownItVue);

@Component({
    components: {
      'page-content': CPageContent
    }
})
export default class ReportDetailPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = false;

  public report: ReportTypeDefault = new ReportTypeDefault();

  // Component methods //
  //////////////////////

  public async mounted() {
    this.loadingInProcess = true;

    const reportId = this.$route.params.id;
    if (reportId) {
      this.$store.dispatch(REPORT_FETCH_ONE, reportId)
        .then((report) => {
          this.report = report;
          this.loadingInProcess = false;
        });
    }
  }

  // Methods //
  ////////////

  get date(): string {
    if (!this.report.date) {
      return '';
    }

    return moment(this.report.date).format('DD.MM.YYYY');
  }
}

export const reportDetailPageRoute: RouteConfig = {
  path: '/reports/:id',
  name: 'ReportDetailPage',
  component: ReportDetailPage,
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss" scope>
@import '@/styles/general.scss';

.theme-dark {
  #preview {
    background-color: #333333;
    border-color: #333333;
    color: #d6d6d6;

    .markdown-body {
      color: #d6d6d6;

      code {
        background-color: rgba(162, 148, 255 , 0.1);
      }
    }
  }

  hr {
    border-color: #333333;
  }
}

#preview {
  padding: 6px 12px;
  border-radius: 0.25rem;
  background-color: #fff;
  border: 1px solid #ced4da;
}
</style>
<!-- STYLE END -->