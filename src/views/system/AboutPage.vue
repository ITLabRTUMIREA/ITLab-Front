<!-- TEMPALTE BEGIN -->
<template>
  <div class="about-page d-flex flex-column justify-content-center align-items-center fullscreen-height">
    <vue-headful title="О системе"></vue-headful>
    <b-row>
      <b-col>
        <b class="system-name">ITLab-Front</b>
      </b-col>
    </b-row>
    <div class="about-content">
      <b-row class="monospace">
        <b-col class="text-right">
          Build:
        </b-col>
        <b-col>
          <a :href="`${ azureOrganizationUrl }_build/results?buildId=${ buildId }`">{{ buildId }}</a>
        </b-col>
      </b-row>
      <b-row class="monospace">
        <b-col class="text-right">
          Commit:
        </b-col>
        <b-col>
          <a :href="`${ repositoryUrl }/commit/${ lastCommitId }`">{{ lastCommitId.substring(0, 7) }}</a>
        </b-col>
      </b-row>
      <!--
      <b-row>
        <b-col class="monospace text-right">
          Master:
        </b-col>
        <b-col>
          <a href="https://capchik.visualstudio.com/MTU%20Work/_build/latest?definitionId=33" rel="nofollow"><img src="https://camo.githubusercontent.com/ce8a231919849568775bdcbb2e6ee5929e91c0f6/68747470733a2f2f6361706368696b2e76697375616c73747564696f2e636f6d2f4d5455253230576f726b2f5f617069732f6275696c642f7374617475732f52545525323049542532304c616225323066726f6e742d6d6173746572" alt="Build status" data-canonical-src="https://capchik.visualstudio.com/MTU%20Work/_apis/build/status/RTU%20IT%20Lab%20front-master" style="max-width:100%;"></a>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="monospace text-right">
          Develop:
        </b-col>
        <b-col>
          <a href="https://capchik.visualstudio.com/MTU%20Work/_build/latest?definitionId=20" rel="nofollow"><img src="https://camo.githubusercontent.com/f34518e91950b7a37c0fa009742441ba05a6288b/68747470733a2f2f6361706368696b2e76697375616c73747564696f2e636f6d2f4d5455253230576f726b2f5f617069732f6275696c642f7374617475732f525455253230576f726b253230636f6e74726f6c25323066726f6e74" alt="Build status" data-canonical-src="https://capchik.visualstudio.com/MTU%20Work/_apis/build/status/RTU%20Work%20control%20front" style="max-width:100%;"></a>
        </b-col>
      </b-row>
      -->
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import configuration from '../../stuff/configuration';
@Component
export default class AboutPage extends Vue {
  // Computed data //
  //////////////////

  get azureOrganizationUrl(): string {
    return configuration.VUE_APP_AZURE_ORGANIZATION || '';
  }

  get buildId(): string {
    return configuration.VUE_APP_BUILD_ID || '';
  }

  get repositoryUrl(): string {
    return configuration.VUE_APP_REPOSITORY || '';
  }

  get lastCommitId(): string {
    return configuration.VUE_APP_LAST_COMMIT || '';
  }
}

export const aboutPageRoute: RouteConfig = {
  path: '/about',
  name: 'AboutPage',
  component: AboutPage,
  meta: {
    secure: false,
    hideNavigation: true
  }
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.about-page {
  .system-name {
    font-size: 5rem;

    @include media-breakpoint-down(xs) {
      font-size: 3rem;
    }
  }

  .about-content {
    .col {
      min-width: 150px;
    }
  }

  .monospace {
    font-family: monospace;
    font-weight: bold;
    font-size: 1.2rem;
  }
}
</style>
<!-- STYLE END -->