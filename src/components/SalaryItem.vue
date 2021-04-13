<template>
  <div>
    <template>
      <template v-if="!salaryToggler">
        <template v-if="salaryForm.count !== null">
          <span
            :id="`tooltip-${id}`"
            :class="[salaryForm.isNew ? 'salary__count_new': '', [salaryForm.description ? 'salary__count__description' : '', 'salary__count']]"
          >{{ salaryForm.count }} &#8381;</span>

          <b-tooltip
            v-if="salaryForm.description"
            :target="`tooltip-${id}`"
            custom-class="my-tooltip-class"
          >
            {{salaryForm.description}}
          </b-tooltip>
        </template>
        <template v-else>
          <span>Оплата не указана</span>
        </template>
      </template>

      <template v-else>
        <span :id="`input-tooltip-${id}`"><input  type="number" v-model.number="salaryForm.count" class="salary__input" /></span>
        <b-popover
            :target="`input-tooltip-${id}`"
            placement="top"
            show
          >
          <template v-slot:title>Описание</template>
          <input type="text" v-model="salaryForm.description" />
          </b-popover>

        &nbsp;
        <div @click="salaryUpdate()" class="salary__edit_toggler salary__check" v-b-tooltip.hover title="Подтвердить">
          <icon name="check"></icon>
        </div>
      </template>
      <template v-if="canEditEvent && editable">
        &nbsp;
        <div v-if="!salaryToggler" @click="salaryToggle()" class="salary__edit_toggler" v-b-tooltip.hover title="Редактировать">
          <icon name="edit"></icon>
        </div>
        <div v-else class="salary__cancel" @click="salaryCancel()" v-b-tooltip.hover title="Отменить">
          <icon name="undo"></icon>
        </div>
        <div @click="salaryReset()" v-if="!salaryForm.isNew && !salaryToggler" class="salary__reset" v-b-tooltip.hover title="Сбросить">
          <icon name="times"></icon>
        </div>

      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Icon from 'vue-awesome/components/Icon';

import 'vue-awesome/icons/check';
import 'vue-awesome/icons/edit';
import 'vue-awesome/icons/info-circle';
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/undo';

import { IEvent } from '@/modules/events';

import { IEventSalary, EVENT_SALARY_COMMIT, salary } from '@/modules/salary';

@Component({
  components: {
    icon: Icon
  }
})
export default class CSalaryItem extends Vue {
  // Properties //
  ///////////////
  @Prop()
  public salary!: IEventSalary | any;

  @Prop()
  public id!: string;

  @Prop()
  public editable?: boolean;

  public canEditEvent: boolean | null = false;

  public salaryForm: any = {
    count: null,
    description: '',
    isNew: true
  };

  public salaryToggler: boolean = false;

  // Methods //
  ////////////

  public async mounted() {
    this.salaryForm = { ...this.salary };
    this.canEditEvent = await this.$userManager.userHasRole('CanEditEvent');
  }

  public salaryToggle() {
    this.salaryToggler = !this.salaryToggler;
    this.$emit('salaryInProcess', this.salaryToggler);
  }

  public salaryUpdate() {
    if (this.salaryForm.count === this.salary.count && this.salaryForm.description === this.salary.description) {
      this.salaryToggle();
      return;
    }
    if (this.salaryForm.hasOwnProperty('isNew')) {
      delete this.salaryForm.isNew;
    }
    this.salaryToggle();
    this.$emit('salaryCommit', this.salaryForm);
  }

  public salaryCancel() {
    this.salaryForm = {...this.salary};
    this.salaryToggle();
  }

  public salaryReset() {
    this.$emit('salaryReset');
  }

  @Watch('salary', {deep: true})
  public onSalaryCountChanged() {
    this.salaryForm = {...this.salary};
  }
}
</script>

<style lang="scss">
@import '@/styles/general.scss';
.salary__info {
  display: inline;
  button {
    border: none;
    background: transparent;
  }
}
.salary__info__icon {
  color: #4dabf7;
}
.salary__count {
  font-weight: bolder;
}
.salary__edit_toggler {
  display: inline !important;
  cursor: pointer;
}
.salary__check {
  color: #28a745;
}
.salary__input {
  width: 100px;
}
.salary__count_new {
  font-weight: bolder;
  color: rgba($color: #000000, $alpha: 0.5);
}
.salary__reset,
.salary__cancel {
  display: inline !important;
  cursor: pointer;
  color: #dc3545;
}

.salary__reset {
  margin-left: 8px;
}

.salary__count__description {
  color: #007bff;
}

.theme-dark {
  & .salary__count_new {
    color: #D6D6D6;
  }
}
</style>
