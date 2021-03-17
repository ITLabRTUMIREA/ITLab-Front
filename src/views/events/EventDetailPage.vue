<!-- TEMPALTE BEGIN -->
<template>
  <div class="event-detail-page">
    <vue-headful :title="event.title"></vue-headful>
    <page-content :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">Событие</template>
      <template slot="header-button">
        <b-button variant="warning" :to="'/events/edit/' + event.id" v-if="canEditEvent">Изменить</b-button>
      </template>

      <b-row>
        <b-col>
          <h3>
            {{ event.title }}
            <small>{{ event.eventType && event.eventType.title }}</small>
          </h3>
          <hr />

          <b-row>
            <b-col cols="12" md="8" class="order-2 order-md-1 markdown">
              <vue-markdown :breaks="true" :linkify="true" :source="event.description"></vue-markdown>
            </b-col>
            <b-col cols="12" md="4" class="order-1 order-md-1">
              <b-row>
                <b-col cols="3">
                  <b>Начало:</b>
                </b-col>
                <b-col
                  cols="9"
                >{{ eventRange.beginTime ? formatDate(eventRange.beginTime) : "Неизвестно" }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="3">
                  <b>Конец:</b>
                </b-col>
                <b-col
                  cols="9"
                >{{ eventRange.endTime ? formatDate(eventRange.endTime) : "Неизвестно" }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="3">
                  <b>Оплата:</b>
                </b-col>
                <b-col
                  cols="9"
                ><salary-item :salary="event.eventSalary" :editable="false"></salary-item></b-col>
              </b-row>

              <template v-if="showElapsed && elapsedTime">
                (До события {{ elapsedTime }})
                <br />
              </template>
              <br />
              <b>Адрес:</b>
              <br />
              <a
                :href="`https://maps.yandex.ru/?text=${ encodeURIComponent(event.address) }`"
                target="_blank"
              >{{ event.address }}</a>
              <hr class="d-block d-md-none" v-if="event.description" />
            </b-col>
          </b-row>
          <hr />
          <b-row>
            <b-col>
              <event-shifts-component
                v-model="event.shifts"
                :editable="false"
                :eventSalaryCount="event.eventSalary.count"
              ></event-shifts-component>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </page-content>
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import moment from 'moment-timezone';

import CPageContent from '@/components/layout/PageContent.vue';
import CSalaryItem from '@/components/SalaryItem.vue';
import EventShiftsComponent from '@/components/EventShiftsComponent.vue'; // TODO: refactor

import { IEvent, EventDefault, EVENTS_FETCH_ONE } from '@/modules/events';
import { PROFILE_HAS_ROLE } from '@/modules/profile';
import {
  IEventSalary,
  EventSalaryDefault,
  EVENT_SALARY_FETCH_ONE,
  ShiftSalaryDefault,
  PlaceSalaryDefault,
} from '../../modules/salary';

@Component({
  components: {
    'page-content': CPageContent,
    'event-shifts-component': EventShiftsComponent,
    'salary-item': CSalaryItem
  }
})
export default class EventDetailPage extends Vue {
  // Parameters //
  ///////////////

  public loadingInProcess: boolean = false;
  public notFound: boolean = false;
  public event: IEvent = new EventDefault();

  public canEditEvent: boolean | null = false;

  public eventSalary: IEventSalary | any = new EventSalaryDefault();

  // Component methods //
  //////////////////////

  public async mounted() {
    this.loadingInProcess = true;

    const eventId = this.$route.params.id;
    if (eventId) {
      await this.$store
        .dispatch(EVENTS_FETCH_ONE, eventId)
        .then((event) => {
          this.event = {...event, eventSalary: new EventSalaryDefault()};
        })
        .then(() => {
          this.$store
            .dispatch(EVENT_SALARY_FETCH_ONE, eventId)
            .then((eventSalary) => {
              this.setEventSalary(eventSalary);
              this.loadingInProcess = false;
            })
            .catch((error) => {
              this.loadingInProcess = false;
            });
        })
        .catch((error) => {
          this.notFound = true;
          this.loadingInProcess = false;
        });
    }
    this.canEditEvent = await this.$userManager.userHasRole('CanEditEvent');
  }

  // Methods //
  ////////////

  public formatDate(date: Date): string {
    return moment(date).format(this.$g.DATETIME_FORMAT);
  }

  public setEventSalary(eventSalary: IEventSalary) {
    if (eventSalary) {
      this.event.eventSalary = Object.assign({}, eventSalary);
      delete this.event.eventSalary.shiftSalaries;
      delete this.event.eventSalary.placeSalaries;
    } else {
      this.event.eventSalary = new EventSalaryDefault();
    }
    this.event.shifts.map((shift) => {
      if (eventSalary.shiftSalaries && this.event.eventSalary) {
        const shiftSalary = eventSalary.shiftSalaries.find((salary) => {
          return salary.shiftId === shift.id;
        });
        if (shiftSalary) {
          shift.shiftSalary = shiftSalary;
        } else {
          shift.shiftSalary = new ShiftSalaryDefault();
          shift.shiftSalary!.count = this.event.eventSalary.count;
        }
      }

      shift.places.map((place) => {
        if (eventSalary.placeSalaries && shift.shiftSalary) {
          const placeSalary = eventSalary.placeSalaries.find((salary) => {
            return salary.placeId === place.id;
          });
          if (placeSalary) {
            place.placeSalary = placeSalary;
          } else {
            place.placeSalary = new PlaceSalaryDefault();
            place.placeSalary!.count = shift.shiftSalary.count;
          }
        }
      });

    });
  }

  // Computed data //
  //////////////////

  get showElapsed(): boolean {
    if (!this.eventRange.beginTime) {
      return false;
    }

    return this.eventRange.beginTime && new Date() < this.eventRange.beginTime;
  }

  get elapsedTime(): string | null {
    if (!this.eventRange.beginTime) {
      return null;
    }

    const ms = moment(new Date()).diff(moment(this.eventRange.beginTime));
    return moment.duration(ms).humanize();
  }

  get eventRange(): { beginTime: Date | null; endTime: Date | null } {
    const shifts = this.event.shifts;
    if (!shifts || shifts.length === 0) {
      return { beginTime: null, endTime: null };
    }

    const result: { beginTime: Date; endTime: Date } = {
      beginTime: shifts[0].beginTime,
      endTime: shifts[0].endTime
    };

    if (shifts.length > 1) {
      shifts.map((shift) => {
        if (shift.beginTime < result.beginTime) {
          result.beginTime = shift.beginTime;
        }
        if (shift.endTime > result.endTime) {
          result.endTime = shift.endTime;
        }
      });
    }

    return result;
  }
}

export const eventDetailPageRoute = {
  path: '/events/:id',
  name: 'EventDetailPage',
  component: EventDetailPage
} as RouteConfig;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
