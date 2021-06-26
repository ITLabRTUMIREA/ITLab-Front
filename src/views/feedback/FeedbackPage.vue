<!-- TEMPLATE BEGIN -->
<template>
  <div class="feedback-page">
    <vue-headful title="Обратная связь"></vue-headful>
    <page-content>
      <template slot="header">Обратная связь</template>

      <div id="feedback-page"></div>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import Icon from 'vue-awesome/components/Icon';

import CPageContent from '@/components/layout/PageContent.vue';

@Component({
  components: {
    Icon,
    'page-content': CPageContent
  }
})
export default class FeedbackPage extends Vue {
}

export const feedbackPageRoute: RouteConfig = {
  path: '/feedback',
  name: 'FeedbackPage',
  component: FeedbackPage,
  children: [
    {
      path: '*'
    }
  ]
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