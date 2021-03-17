<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-page">
    <vue-headful title="Оборудование"></vue-headful>
    <page-content :loading="loadingInProcess">
      <template slot="header">Оборудование</template>
      <template slot="header-button">
        <b-button variant="success" to="equipment/new" v-if="canEditEquipment">Добавить</b-button>
      </template>

      <b-row>
        <b-col cols="auto" class=" ml-auto order-2 order-md-1 mb-3 mb-md-0">
          <b-input-group>
            <b-form-checkbox v-model="onlyFree" :value="true" :unchecked-value="false" class="noselect">
              Только свободное
            </b-form-checkbox>
          </b-input-group>
        </b-col>

        <b-col cols="12" md="6" class="order-1 order-md-2">
          <b-input-group class="mb-2 pr-3">
            <input class="form-control" v-model="equipmentFilterString" placeholder="Поиск" type="text">
            <b-input-group-append>
              <b-btn :disabled="!equipmentFilterString" @click="equipmentFilterString=''">
                <icon name="times"></icon>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table class="equipment-table" :hover="true" :fixed="true" :items="items" :sort-by="'type'" :fields="fields" :filter="filterProperty" :filter-function="onEquipmentTableFilter" :sort-compare="onEquipmentTableSort" @row-clicked="onEquipmentTableRowClicked">

            <template slot="type" slot-scope="data">
              {{ data.item.equipmentType.title }}
            </template>
            <template slot="number" slot-scope="data">
              <span style="font-family: monospace">{{ data.item.number }}</span>
            </template>
            <template slot="actions" slot-scope="data" style="overflow: auto">
              <span class="actions-cell">
                <b-button variant="warning" size="sm" :to="'equipment/' + data.item.id" class="mr-2" style="float: right" v-if="canEditEquipment">
                  Изменить
                </b-button>
                <b-button size="sm" @click.stop="data.toggleDetails" class="mr-2" style="float: right">
                  {{ data.detailsShowing ? "Свернуть" : "Подробнее" }}
                </b-button>
              </span>
            </template>

            <template slot="row-details" slot-scope="data">
              <b-row>
                <b-col cols="auto">
                  <b-row>
                    <b-col cols="12">
                      Владелец:
                    </b-col>
                    <b-col cols="12">
                      Серийный номер:
                    </b-col>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row>
                    <b-col cols="12">
                      <template v-if="data.item.owner">
                        <b>{{ data.item.owner.firstName }} {{ data.item.owner.lastName }}</b>,
                        <mail-link :email="data.item.owner.email" />
                      </template>
                      <template v-else>
                        Лаборатория
                      </template>
                    </b-col>
                    <b-col cols="12">
                      <span style="font-family: monospace">{{ data.item.serialNumber }}</span>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </template>
          </b-table>
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

import CMailLink from '@/components/stuff/MailLink.vue';
import CPageContent from '@/components/layout/PageContent.vue';

import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/times';
import 'vue-awesome/icons/plus';

import {
  IEquipment,
  EQUIPMENT_FETCH_ALL,
  EQUIPMENT_GET_ALL
} from '@/modules/equipment';

import { IUser, USERS_FETCH_ALL } from '@/modules/users';

@Component({
  components: {
    Icon,
    'mail-link': CMailLink,
    'page-content': CPageContent
  }
})
export default class EquipmentPage extends Vue {
  // Properties //
  ///////////////

  public loadingInProcess: boolean = true;
  public users: IUser[] = [];
  public equipmentFilterString: string = '';
  public onlyFree: boolean = false;

  public canEditEquipment: boolean | null = false;

  // Component methods //
  //////////////////////

  public beforeMount() {
    this.loadingInProcess = this.$store.getters[EQUIPMENT_GET_ALL].length === 0;

    this.$store
      .dispatch(USERS_FETCH_ALL)
      .then((users: IUser[]) => {
        this.users = users;
        return this.$store.dispatch(EQUIPMENT_FETCH_ALL);
      })
      .then((result) => {
        this.loadingInProcess = false;
      });
  }

  public async mounted() {
    this.canEditEquipment = await this.$userManager.userHasRole('CanEditEquipment');
  }

  // Methods //
  ////////////

  public onEquipmentTableFilter(v: any) {
    const lower = (s: string) => s.toLocaleLowerCase();

    const filterStrings = this.equipmentFilterString
      .toLocaleLowerCase()
      .split(' ');

    return (
      ((this.onlyFree && v.owner == null) || !this.onlyFree) &&
      (this.equipmentFilterString === '' ||
        filterStrings.every(
          (filter) =>
            lower(v.equipmentType.title).includes(filter) ||
            lower(v.serialNumber).includes(filter) ||
            (v.owner &&
              (lower(v.owner.email).includes(filter) ||
                lower(v.owner.firstName).includes(filter) ||
                lower(v.owner.lastName).includes(filter)))
        ))
    );
  }

  public onEquipmentTableSort(a: any, b: any, key: string) {
    if (key === 'type') {
      return a.equipmentType.title.localeCompare(
        b.equipmentType.title,
        undefined,
        {
          numeric: true
        }
      );
    } else {
      return 0;
    }
  }

  public onEquipmentTableRowClicked(data: IEquipment) {
    if (window.innerWidth < 1170) {
      this.$router.push('/equipment/' + data.id);
    }
  }

  // Computed data //
  //////////////////

  get fields() {
    return [
      {
        key: 'type',
        label: 'Тип',
        sortable: true
      },
      {
        key: 'number',
        label: 'Номер'
      },
      {
        key: 'actions',
        label: ''
      }
    ];
  }

  get items() {
    return this.$store.getters[EQUIPMENT_GET_ALL].map(
      (equipment: IEquipment) => {
        const owner = this.users.find((user) => user.id === equipment.ownerId);

        return {
          ...equipment,
          owner,
          _showDetails: false
        };
      }
    );
  }

  get filterProperty() {
    return this.equipmentFilterString + this.onlyFree ? 'free' : '';
  }
}

export const equipmentPageRoute: RouteConfig = {
  path: '/equipment',
  name: 'EquipmentPage',
  component: EquipmentPage
};
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.equipment-page {
  .equipment-table {
    @include theme-specific() {
      color: getstyle(page-font-color);

      tr:hover {
        color: getstyle(page-font-color);
      }
    }

    @include media-breakpoint-down(md) {
      .actions-head {
        display: none;
      }

      th[aria-colindex='3'],
      td[aria-colindex='3'] {
        display: none;
      }
    }

    tr td {
      line-height: 31px;
    }

    .b-table-has-details {
      background-color: rgba(0, 0, 0, 0.075);

      td {
        padding-bottom: 0px;
      }
    }

    .b-table-details {
      background-color: rgba(0, 0, 0, 0.075);

      td {
        padding: 12px;
        padding-top: 0px;
      }
    }

    .equipment-details {
      @include theme-specific() {
        background-color: getstyle(page-background-color);
      }
    }
  }
}
</style>
<!-- STYLE END -->