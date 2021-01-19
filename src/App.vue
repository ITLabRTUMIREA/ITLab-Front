<!-- TEMPLATE BEGIN -->
<template>
  <div id="app" v-bind:class="theme">
    <notifications position="top right"></notifications>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { PROFILE_SETTINGS_THEME_GET } from '@/modules/profile';

const defaultLayout = 'default';

export default class App extends Vue {
  // Component methods //
  //////////////////////

  public created() {
    this.$watch('theme', (theme: string) => this.updateBrowserTitleColor());

    this.updateBrowserTitleColor();
  }

  // Methods //
  ////////////

  public updateBrowserTitleColor() {
    const color = this.theme === 'theme-dark' ? '#333333' : '#ffffff';

    const metaList: string[] = [
      'theme-color',
      'msapplication-navbutton-color',
      'apple-mobile-web-app-status-bar-style'
    ];

    metaList.forEach((meta) => {
      const metaElement = document.querySelector(`meta[name=${meta}]`);
      if (metaElement) {
        metaElement.setAttribute('content', color);
      }
    });
  }

  // Computed data //
  //////////////////

  get theme(): string {
    const themeName = this.$store.getters[PROFILE_SETTINGS_THEME_GET];
    return `theme-${themeName}`;
  }

  get layout(): string {
    return (this.$route.meta.layout || defaultLayout) + '-layout';
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

html,
body {
  min-height: 100%;
}

#app {
  height: inherit;
  min-height: inherit;
  width: 100%;

  .layout {

    .content-wrapper-another-front {
      position: fixed;
      top: 0;
      padding-top: 50px;
      width: 100%;
    }

    .content-wrapper {
      min-height: 100vh;
      width: 100%;
      height: 100%;
    }

    &.with-sidebar {
      @include media-breakpoint-up(lg) {
        padding-left: $sidebar-width;
      }

      .content-wrapper {
        padding-top: 50px;
      }
    }
  }

  @each $theme, $map in $themes {
    &.#{$theme} {
      background-color: map-get($map, page-background-color);
      color: map-get($map, page-font-color);
    }
  }
}

.notifications {
  padding: 10px;
}

.page-title {
  @include media-breakpoint-down(md) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    font-size: 20pt;
    height: calc(2rem + 32px);
    line-height: calc(2rem + 32px);
    padding-left: 1rem;
    border-bottom: 2px solid;

    .btn {
      position: relative;
      top: -4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
      border-radius: 0.2rem;
    }

    @include theme-specific() {
      background-color: getstyle(title-background-color);
      border-color: getstyle(title-border-color);
    }
  }
}
</style>
<!-- STYLE END -->
