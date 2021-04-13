<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-sidebar" @click="toggleMenu($event)" v-bind:class="{ 'mobile-hidden': isMobileMenuHidden }">
    <div v-if="!isMobileMenuHidden" style="width: 100vw; height: 100vh;" @click="toggleMenu($event, true)"></div>
    <span class="menu-open" @click="toggleMenu($event, false)">
      <svgicon name="bars" height="32" class="bars"></svgicon>
    </span>
    <div class="nav-sidebar noselect">
      <div class="inner-scroll">
        <div class="home">
          <div class="text">{{ $g.SYSTEM_NAME }}</div>
          <span class="menu-toggle" @click="toggleMenu($event, true)">
            <svgicon name="bars" height="32" class="bars"></svgicon>
          </span>
        </div>

        <div v-for="group in groups" :key="group.name">
          <hr>
          <div class="group-name">{{group.title}}</div>
          <b-nav vertical>
            <b-nav-item v-for="section in group.sections" :key="section.name" :to="section.homeURL" @click="toggleMenu($event, true)" exact v-bind:class="{'active': section.name == $route.meta.parentSection}">
              {{section.title}}
              <span class="badge badge-pill badge-primary" v-if="section.badgeText">{{ section.badgeText }}</span>
            </b-nav-item>
          </b-nav>
        </div>
        <hr>
      </div>
        <div class="exit-button" @click="logout()">Выход</div>
      </div>
    </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Hammer from 'hammerjs';

import '@/icons/bars';

import { IGroup, LAYOUT_GROUPS_GET } from '@/modules/layout';

import {
  NOTIFICATIONS_FETCH,
  NOTIFICATIONS_GET_COUNT
} from '@/modules/notifications';

import { LAYOUT_BADGE_TEXT_SET } from '@/modules/layout';

@Component
export default class CSidebar extends Vue {
  // Properties //
  ///////////////

  public swipeArea?: HammerManager;

  public isMobileMenuHidden: boolean = true;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$store.dispatch(NOTIFICATIONS_FETCH);
  }

  public created() {
    document.body.style.userSelect = 'text';
    setInterval(() => {
      this.$store.dispatch(NOTIFICATIONS_FETCH);
    }, 10000);
    this.$watch(
      () => this.$store.getters[NOTIFICATIONS_GET_COUNT],
      (n: number, o: number) => {
        this.$store.commit(LAYOUT_BADGE_TEXT_SET, {
          sectionName: 'notifications',
          badgeText: n > 0 ? `${n}` : undefined
        });
      }
    );
  }

  // Methods //
  ////////////

  public toggleMenu(event: any, force: boolean | undefined) {
    if (event.target.className !== 'sidebar-component' && force === undefined) {
      return;
    }

    const value: boolean =
      force === undefined ? !this.isMobileMenuHidden : force;

    this.isMobileMenuHidden = value;
    document.body.classList.toggle('sidebar-open', !value);
  }

  public async logout() {
    await this.$userManager.signout();
  }

  // Computed data //
  //////////////////

  get groups(): IGroup[] {
    return this.$store.getters[LAYOUT_GROUPS_GET];
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.c-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
  background-color: #29292949;

  .bars {
    @include theme-specific() {
      fill: getstyle(page-font-color);
    }
  }

  .home {
    width: 100%;
    display: inline-flex;
    padding: 1rem 1rem 0 1rem;

    .text {
      font-size: 1.25rem;
      white-space: nowrap;
      font-weight: 600;
      display: inline-block;
    }

    .menu-toggle {
      margin-left: auto;
      height: 32px;

      @include media-breakpoint-up(lg) {
        display: none;
      }
    }
  }

  .nav-sidebar {
    z-index: 1;
    position: fixed;
    width: $sidebar-width;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    transform: translate3d(0, 0, 0);
    display: flex;
    flex-direction: column;
    align-items: stretch;

    .inner-scroll {
      width: 100%;
      height: calc(100% - 50px + 1rem);
      overflow-y: auto;

      .group-name {
        padding: 5px;
        padding-left: 1rem;
        font-weight: bold;

        @include theme-specific() {
          color: getstyle(sidebar-group-font-color);
        }
      }

      .nav-item {
        a {
          padding-left: 2rem;

          @include theme-specific() {
            color: getstyle(sidebar-section-font-color);
          }

          &:hover {
            @include theme-specific() {
              background: getstyle(sidebar-section-background-color);
            }
          }
        }

        &.active {
          @include theme-specific() {
            box-shadow: inset 4px 0 0
              getstyle(sidebar-active-section-highlight-color);
            background: getstyle(sidebar-section-background-color);
          }
        }

        &.active a {
          font-weight: 600;
        }
      }
    }

    .exit-button {
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: 16px;
      border: none;
      line-height: 1;
      font-weight: bold;
      margin-top: auto;
      border-top: 2px solid;
      border-right: 2px solid;
      cursor: pointer;

      @include media-breakpoint-down(md) {
        border-left: 2px solid;
        border-right: 0px;
      }

      @include theme-specific {
        color: getstyle(sidebar-section-font-color);
        border-color: getstyle(sidebar-shadow-color);
        background-color: getstyle(sidebar-background-color);

        &:hover {
          background: getstyle(sidebar-shadow-color);
        }
      }
    }

    @include theme-specific() {
      background-color: getstyle(sidebar-background-color);
      box-shadow: inset 2px 0 0 getstyle(sidebar-shadow-color);
    }
  }

  .menu-open {
    position: fixed;
    height: 32px;
    right: 1rem;
    top: 1rem;
  }

  &:not(.mobile-hidden) {
    .menu-open {
      display: none;
    }
  }

  &.mobile-hidden {
    width: 0px;

    .nav-sidebar {
      display: none;
    }
  }

  @include media-breakpoint-up(lg) {
    width: 0;

    .menu-open {
      display: none;
    }

    .nav-sidebar {
      left: 0;

      @include theme-specific() {
        box-shadow: inset -2px 0 0 getstyle(sidebar-shadow-color);
      }
    }

    &.mobile-hidden .nav-sidebar {
      display: block;
    }
  }
}

body {
  @include media-breakpoint-down(md) {
    &.sidebar-open {
      overflow: hidden;
    }
  }
}
</style>
<!-- STYLE END -->