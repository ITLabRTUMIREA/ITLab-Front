<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-report-item default"> <!-- Maybe should add various states (EventItem) -->
		<div class="title-row">
      <b-row>
        <b-col cols="auto mr-auto" @mouseup="checkDateHover">
          <strong style="line-height: 31px">
            <span>
              <icon name="clock" style="cursor: pointer; position: relative; top: -2px"></icon>
            </span>
            &nbsp;
            <span class="date desktop">
              <span v-if="dateHovered">{{ date }}</span>
              <span v-else>{{ dateCalendar }}</span>
            </span>
            <span class="date mobile">
              <span>{{ date }}</span>
            </span>
          </strong>
        </b-col>
        <b style="padding: 0 15px;">
				  <div v-if="salary.approved === '' && checkImplementer()">Оплата не указана</div>
          <div v-else-if="checkImplementer()">{{ `${salary.count} р` }}</div>
        </b>
			</b-row>
			<hr />
			<b-row>
				<b-col md="8">
          <h3 style="margin-bottom: 0">{{ report.title || `Отчёт (${date})` }}</h3>

					<br />
          <p><b>{{ author }}</b></p>
        </b-col>
				<b-col md="4" v-if="checkImplementer()">
          <div v-if="salary.approved">
            <b>Коментарий</b>
            <p>{{ salary.description }}</p>
          </div>
        </b-col>
			</b-row>
			<b-row class="mt-2">
        <b-col cols="12 mr-auto" md="auto">
          <b-button :to="'reports/' + report.id" variant="primary" class="w-100">Подробнее</b-button>
        </b-col>
        <b-col md="4" style="display: flex;">
          <div v-if="salary.approved && checkImplementer()" style="margin: auto 0;">{{ salaryDate }}</div>
        </b-col>
      </b-row>
		</div>
	</div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import moment from 'moment-timezone';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import { IReportTypeDefault } from '../modules/reports';
import { IUser, USERS_GET_ONE } from '../modules/users';
import { IReportSalary, ReportSalary, REPORT_SALARY_GET_ONE } from '../modules/salary';

export enum ReportImplementer {
  Me,
  Others
}

@Component({
  components: {
    icon: Icon
  }
})
export default class CReportItem extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public report!: IReportTypeDefault;

  @Prop({
    default: ReportImplementer.Me
  })
  public implementer!: ReportImplementer;

  public dateHovered: boolean = false;

  // Methods //
  ////////////

  public checkDateHover() {
    if (
      window.getSelection() == null ||
      window.getSelection()!.toString().length === 0
    ) {
      this.dateHovered = !this.dateHovered;
    }
  }

  public checkImplementer() {
    return this.implementer === ReportImplementer.Me ? true : false;
  }

  get date(): string {
    if (!this.report.date) {
      return '';
    }

    return moment(this.report.date).format(this.$g.DATETIME_FORMAT);
  }

  get salaryDate(): string {
    return moment(this.report.date).format('DD.MM.YYYY');
  }

  get dateCalendar(): string {
    if (!this.report.date) {
      return '';
    }

    return moment(this.report.date).calendar();
  }

  get author(): string {
    const user = this.implementer === ReportImplementer.Me
      ? this.$store.getters[USERS_GET_ONE](this.report.assignees.reporter) as IUser
      : this.$store.getters[USERS_GET_ONE](this.report.assignees.implementer) as IUser;

    return `${user.lastName} ${user.firstName}`;
  }

  get salary(): IReportSalary {
    return this.$store.getters[REPORT_SALARY_GET_ONE](this.report.id);
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss" scope>
@import '@/styles/general.scss';

.c-report-item {
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
