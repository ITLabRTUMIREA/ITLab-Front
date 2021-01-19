<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-summary-modal">
    <b-modal v-model="isModalVisible">
      <template slot="modal-title">
        Итоговый отчёт
      </template>
      
      <b-form-group label="Выберите период:">
        <b-row>
          <b-col cols="12" sm="6" md="12" lg="6" class="mt-3">
            <date-picker class="w-100" v-model="startDate" lang="ru" type="date" format="DD.MM.YYYY"></date-picker>
          </b-col>
          <b-col cols="12" sm="6" md="12" lg="6" class="mt-3">
            <date-picker class="w-100" v-model="endDate" lang="ru" type="date" format="DD.MM.YYYY"></date-picker>
          </b-col>
          <br />
        </b-row>
      </b-form-group>
      
      <b-form-group label="Выберите тип:">
        <h5 v-if="options.length === 0">Нет событий.</h5>
        <b-form-checkbox-group
          stacked
          v-model="selected"
          :options="options"
        >
        </b-form-checkbox-group>
      </b-form-group>
      
      <template slot="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          @click="isModalVisible = false"
        >Закрыть</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isModalInProcess"
          @click="onSubmitModal"
        >Скачать</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IEventType, EVENT_TYPES_FETCH_ALL } from '@/modules/events';
import DatePicker from 'vue2-datepicker';

@Component({
  components: {
    'date-picker': DatePicker
  }
})
export default class CSummaryModal extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: false
  })
  public value!: boolean;

  // Properties //
  ///////////////

  public isModalInProcess: boolean = false;

  public options: Array<{ text: string; value: string }> = [];
  public selected: string[] = [];

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  private visibilityStuff: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.endDate = new Date();
    this.startDate = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 1));

    this.$watch('value', (value: boolean) => {
      this.visibilityStuff = value;
    });

    this.$store
      .dispatch(EVENT_TYPES_FETCH_ALL)
      .then((eventTypes: IEventType[]) => {
        this.options = eventTypes.map((eventType) => ({
          text: eventType.title,
          value: eventType.id
        }));
      });
  }

  // Methods //
  ////////////

  public async onSubmitModal() {
    this.isModalInProcess = true;

    let data: any = null;

    return new Promise((resolve, reject) => {
      let types = '';
      for (const S of this.selected) {
        types += `&eventTypeId=${S}`;
      }

      axios
        .get(`docsgen/downloadxls?begin=${this.startDate.toISOString().slice(0, 10)}&end=${this.endDate.toISOString().slice(0, 10)}${types}`,
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          if (response && response.status === 200) {
          data = response.data;
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'svodka.xlsx');
          document.body.appendChild(link);
          link.click();
          this.isModalInProcess = false;
          this.isModalVisible = false;
          resolve();
          } else {
            this.$notify({
              title: 'Проблемы с сервером, попробуйте позже.',
              duration: 1500,
              type: 'error'
            });
            this.isModalInProcess = false;
            this.isModalVisible = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.isModalInProcess = false;
          reject(error);
        });
    });
  }

  set isModalVisible(value: boolean) {
    this.$emit('input', value);
  }

  // Computed data //
  //////////////////

  get isModalVisible(): boolean {
    return this.visibilityStuff;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.nav-tabs {
  .nav-item .nav-link {
    border: none;
  }
}
</style>
<!-- STYLE END -->