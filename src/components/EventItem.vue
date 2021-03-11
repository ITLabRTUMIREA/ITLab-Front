<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-event-item" v-bind:class="currentState">
    <div class="title-row">
      <b-row>
        <b-col cols="auto mr-auto" @mouseup="checkDateHover">
          <strong style="line-height: 31px">
            <span>
              <icon name="clock" style="position: relative; top: -2px"></icon>
            </span>
            &nbsp;
            <span class="date desktop">
              <span v-if="dateHovered">{{ beginTime }}</span>
              <span v-else>{{ beginTimeCalendar }}</span>
            </span>
            <span class="date mobile">
              <span>{{ beginTime }}</span>
            </span>
          </strong>
        </b-col>
        <salary-item :id="event.id" :salary="eventSalary" :editable="false" style="padding: 0 15px; margin: auto 0;"></salary-item>
        <b-col cols="auto" v-if="canEditEvent">
          <b-button
            variant="outline-warning"
            class="btn-sm button-edit"
            :to="'events/edit/' + event.id"
          >Изменить</b-button>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col md="8">
          <h3 style="margin-bottom: 0">{{ event.title }}</h3>
          <small
            style="position: relative; top: -5px"
            v-if="event.eventType"
          >{{ event.eventType.title }}</small>
          <p>
            <a
              :href="`https://maps.yandex.ru/?text=${ encodeURIComponent(event.address) }`"
              target="_blank"
            >{{ event.address }}</a>
          </p>
        </b-col>
        <b-col md="4">
          <b-row>
            <b-col>
              Готовность:
              <b-progress class="w-100 mb-2" height="2rem" :max="1">
                <b-progress-bar :value="completeness"></b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Начало:
              <b>{{ beginTimeShort }}</b>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Длительность:
              <b>{{ duration }}</b>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="12" md="auto">
          <b-button :to="'events/' + event.id" variant="primary" class="w-100">Подробнее</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';
import moment from 'moment';

import CSalaryItem from '@/components/SalaryItem.vue';

import 'vue-awesome/icons/clock';
import 'vue-awesome/icons/edit';
import 'vue-awesome/icons/eye-slash';

import { IEvent } from '@/modules/events';
import { PROFILE_HAS_ROLE } from '@/modules/profile';
import { getNounDeclension } from '@/stuff';

import { IEventSalary, EVENT_SALARY_FETCH_ONE } from '@/modules/salary';

enum State {
  Default,
  Waiting,
  Success
}

@Component({
  components: {
    icon: Icon,
    'salary-item': CSalaryItem,
  }
})
export default class CEventItem extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public event!: IEvent;

  @Prop()
  public eventSalary!: IEventSalary | any;

  public dateHovered: boolean = false;
  public canEditEvent: boolean | null = false;

  // Methods //
  ////////////

  public async mounted() {
    this.canEditEvent = await this.$userManager.userHasRole('CanEditEvent');
  }

  public checkDateHover() {
    if (
      window.getSelection() == null ||
      window.getSelection()!.toString().length === 0
    ) {
      this.dateHovered = !this.dateHovered;
    }
  }

  // Computed data //
  //////////////////

  get currentState(): any {
    const state: State =
      this.event.participating === true ? State.Success : State.Default;

    switch (+state) {
      case State.Default:
        return { default: true };
      case State.Waiting:
        return { waiting: true };
      case State.Success:
        return { success: true };
    }
  }

  get beginTime(): string {
    if (!this.event.beginTime) {
      return '';
    }

    return moment(this.event.beginTime).format(this.$g.DATETIME_FORMAT);
  }

  get beginTimeCalendar(): string {
    if (!this.event.beginTime) {
      return '';
    }

    return moment(this.event.beginTime).calendar();
  }

  get beginTimeShort(): string {
    if (!this.event.beginTime) {
      return '';
    }

    return moment(this.event.beginTime).format(this.$g.TIME_FORMAT);
  }

  get completeness(): number {
    if (
      this.event.targetParticipantsCount == null ||
      this.event.currentParticipantsCount == null
    ) {
      return 0;
    }

    if (
      this.event.currentParticipantsCount >
        this.event.targetParticipantsCount ||
      this.event.targetParticipantsCount === 0
    ) {
      return 100;
    } else {
      return (
        this.event.currentParticipantsCount / this.event.targetParticipantsCount
      );
    }
  }

  get duration(): string {
    if (!this.event.beginTime || !this.event.endTime) {
      return '';
    }

    const beginTime = moment(this.event.beginTime);
    const beginTimeDayStart = beginTime.clone().startOf('day');

    const endTime = moment(this.event.endTime);
    const endTimeDayStart = endTime.clone().startOf('day');

    if (beginTimeDayStart.isSame(endTimeDayStart)) {
      return moment.duration(endTime.diff(beginTime)).humanize();
    } else {
      const dayCount = endTimeDayStart.diff(beginTimeDayStart, 'days') + 1;

      return `${dayCount} ${getNounDeclension(dayCount, [
        'день',
        'дня',
        'дней'
      ])}`;
    }
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.c-event-item {
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin: 10px;

  .date {
    &.desktop {
      @include media-breakpoint-down(md) {
        display: none;
      }
    }

    &.mobile {
      @include media-breakpoint-up(lg) {
        display: none;
      }
    }
  }

  .button-edit {
    .theme-light & {
      background-color: $warning;
      border-color: $warning;
      color: getcolor(black, dark);

      &:hover {
        background-color: darken($warning, 7.5%);
        border-color: darken($warning, 10%);
      }
    }
  }

  @include theme-specific() {
    background-color: getstyle(card-list-item-background-color);

    &.default {
      box-shadow: -4px 0 0 $primary;
    }

    &.waiting {
      box-shadow: -4px 0 0 $warning;
    }

    &.success {
      box-shadow: -4px 0 0 $success;
    }
  }
}
</style>
<!-- STYLE END -->