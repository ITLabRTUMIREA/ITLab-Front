<!-- TEMPLATE BEGIN -->
<template>
  <div class="projects-page">
    <page-content>
      <template slot="header">Проекты</template>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';
import Icon from 'vue-awesome/components/Icon';

import {
  IProject,
  PROJECTS_FETCH_ALL,
  PROJECTS_GET_ALL,
  PROJECT_DELETE
} from '@/modules/projects';

import CPageContent from '@/components/layout/PageContent.vue';
import { log } from 'util';

@Component({
  components: {
    Icon,
    'page-content': CPageContent
  }
})
export default class ProjectsPage extends Vue {
  public APP_ID: string = '5c30d909f3ba9f9e3141a286626f90ea';
  public APP_TOKEN: string =
    'd366bf5ed0622c00e27f4532b7be509371a214a471355740e98374bffdf4a92d';

  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public projects: any[] = [];

  private canEditUserPropertyTypes: boolean | null = false;

  // Component methods //
  //////////////////////

  public async mounted() {
  }
}

export const projectsPageRoute: RouteConfig = {
  path: '/projects',
  name: 'ProjectsPage',
  component: ProjectsPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.projects-page {
  .board-tile,
  .board-tile-fade {
    border-radius: 3px;
    display: block;
  }

  .board-tile-fade {
    background-color: rgba(0, 0, 0, 0.15);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .board-tile {
    width: 100%;
    background-color: #959da1;
    background-size: cover;
    background-position: 50%;
    color: #fff;
    line-height: 20px;
    margin: 0 8px 8px 0;
    padding: 8px;
    position: relative;
    text-decoration: none;

    .board-tile-details {
      display: block;
      min-height: 64px;
      padding-right: 40px;
      position: relative;

      .board-tile-details-name {
        font-size: 16px;
        font-weight: 700;
        display: inline-block;
        overflow: hidden;
        max-height: 40px;
      }

      &.is-badged {
        min-height: 64px;
        padding-bottom: 16px;
      }
    }
  }
}
</style>
<!-- STYLE END -->