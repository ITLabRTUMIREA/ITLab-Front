<!-- TEMPLATE BEGIN -->
<template>
  <div class="equipment-edit-page">
    <vue-headful :title="isNewEquipment ? 'Новое оборудование' : 'Редактирование'"></vue-headful>
    <page-content :loading="loadingInProcess" :not-found="notFound">
      <template slot="header">
        Оборудование
      </template>

      <b-row>
        <b-col>
          <b-form>
            <b-form-row v-if="!isNewEquipment">
              <b-col>
                Номер: {{ equipment.number }}
                <hr>
              </b-col>
            </b-form-row>

            <b-form-group id="equipment-type-group" label="Тип оборудования">
              <equipment-type-selection v-model="equipment.equipmentType" :state="!$v.equipment.equipmentType.$invalid"></equipment-type-selection>
            </b-form-group>

            <b-form-group id="serial-number-title-group" label="Серийный номер" label-for="title-input">
              <b-form-input id="serial-number-input" type="text" v-model.trim="equipment.serialNumber" :state="!$v.equipment.serialNumber.$invalid">
              </b-form-input>
            </b-form-group>

            <b-form-group id="description-group" label="Описание" label-for="description-input">
              <b-form-textarea id="description-input" :rows="3" :max-rows="6" v-model="equipment.description">
              </b-form-textarea>
            </b-form-group>

            <b-form-group id="owner-label-group" label="Владелец" label-for="owner-label" v-if="equipmentOwner && !isNewEquipment">
              <b>{{ equipmentOwner.firstName }} {{ equipmentOwner.lastName }}</b>,
              <mail-link :email="equipmentOwner.email" />
            </b-form-group>

            <br>

            <b-form-row class="buttons">
              <b-col cols="12" md="auto">
                <b-button class="w-100 submit-button" variant="primary" :disabled="$v.equipment.$invalid || isPageInProcess" @click="onSubmit" v-if="canEditEquipment">Подтвердить</b-button>
              </b-col>
              <b-col cols="12" md="auto" v-if="!isNewEquipment">
                <b-button class="w-100" variant="warning" :disabled="isPageInProcess" @click="showEquipmentOwnerModal" v-if="canEditEquipmentOwner">Изменить владельца</b-button>
              </b-col>
              <b-col cols="12" md="auto" v-if="!isNewEquipment">
                <b-button variant="outline-danger" class="w-100" @click="onDelete()" :disabled="isPageInProcess">Удалить</b-button>
              </b-col>
            </b-form-row>
          </b-form>
        </b-col>
      </b-row>
    </page-content>

    <b-modal v-model="equipmentOwnerModalShow" v-if="!isNewEquipment && canEditEquipmentOwner" @keydown.native.enter="onSubmitEquipmentOwner">
      <template slot="modal-title">
        Назначение владельца
      </template>

      <b-form-group id="owner-group" label="Владелец" label-for="owner-input">
        <user-selection v-model="equipmentOwnerModalData"></user-selection>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="equipmentOwnerModalShow = false">Отменить</button>
        <button type="button" class="btn btn-primary" :disabled="isModalInProcess" @click="onSubmitEquipmentOwner">Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import axios from 'axios';

import CMailLink from '@/components/stuff/MailLink.vue';
import CPageContent from '@/components/layout/PageContent.vue';
import CUserSelection from '@/components/selectors/UserSelection.vue';
import CEquipmentTypeSelection from '@/components/selectors/EquipmentTypeSelection.vue';

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import {
  IEquipment,
  EquipmentDefault,
  IEquipmentType,
  EQUIPMENT_FETCH_ONE,
  EQUIPMENT_COMMIT,
  EQUIPMENT_DELETE
} from '@/modules/equipment';

import {
  IUser,
  USER_ASSIGN_EQUIPMENT,
  USER_REMOVE_EQUIPMENT
} from '@/modules/users';
import { IPageMeta } from '@/modules/layout';

enum State {
  Default,
  InProcess,
  Error
}

@Component({
  components: {
    'mail-link': CMailLink,
    'page-content': CPageContent,
    'user-selection': CUserSelection,
    'equipment-type-selection': CEquipmentTypeSelection
  },
  mixins: [validationMixin],
  validations() {
    return {
      equipment: {
        equipmentType: {
          required,
          selected: (equipmentType?: IEquipmentType) =>
            equipmentType && equipmentType.id !== ''
        },
        serialNumber: {
          required,
          minLength: minLength(1)
        }
      }
    };
  }
})
export default class EquipmentEditPage extends Vue {
  // Page properties //
  ////////////////////

  public loadingInProcess: boolean = false;
  public notFound: boolean = false;
  public pageState: State = State.Default;
  public isNewEquipment: boolean = false;

  // Equipment properties //
  /////////////////////////

  public equipment: IEquipment = new EquipmentDefault();
  public equipmentOwner: IUser | null = null;

  public equipmentOwnerModalShow: boolean = false;
  public equipmentOwnerModalData: IUser | null = null;
  public equipmentOwnerModalState: State = State.Default;

  public canEditEquipment: boolean | null = false;
  public canEditEquipmentOwner: boolean | null = false;

  public async mounted() {
    this.loadingInProcess = true;

    const equipmentId = this.$route.params.id;
    if (equipmentId && equipmentId !== 'new') {
      this.$store
        .dispatch(EQUIPMENT_FETCH_ONE, equipmentId)
        .then((equipment) => {
          this.setEquipment(equipment);
          this.loadingInProcess = false;
        })
        .catch((error) => {
          this.notFound = true;
          this.loadingInProcess = false;
        });
    } else {
      this.isNewEquipment = true;
      this.loadingInProcess = false;
    }
    this.canEditEquipment = await this.$userManager.userHasRole('CanEditEquipment');
    this.canEditEquipmentOwner = await this.$userManager.userHasRole('CanEditEquipmentOwner');
  }

  // Equipment methods //
  //////////////////////

  public onSubmit() {
    if (this.$v.equipment && this.$v.equipment.$invalid) {
      return;
    }

    this.pageState = State.InProcess;
    this.equipment.equipmentType = this.equipment.equipmentType || undefined;
    this.equipment.equipmentTypeId =
      (this.equipment.equipmentType && this.equipment.equipmentType.id) || '';

    this.$store
      .dispatch(EQUIPMENT_COMMIT, this.equipment)
      .then((equipment) => {
        this.setEquipment(equipment);

        this.pageState = State.Default;
        if (this.isNewEquipment) {
          this.isNewEquipment = false;
          this.$router.push({ path: '/equipment/' + equipment.id });
        } else {
          this.$notify({
            title: 'Изменения успешно сохранены',
            duration: 500
          });
        }
      })
      .catch((error) => {
        this.pageState = State.Error;
      });
  }

  public onDelete() {
    if (confirm('Вы действительно хотите удалить это оборудование?')) {
      this.$store
        .dispatch(EQUIPMENT_DELETE, this.equipment.id)
        .then(() => {
          this.$notify({
            title: 'Оборудование удалено',
            duration: 500
          });
          this.$router.replace({ name: 'EquipmentPage' });
        })
        .catch();
    }
  }

  public setEquipment(equipment: IEquipment) {
    this.equipment = equipment;

    if (equipment.ownerId) {
      axios.get('user/' + equipment.ownerId).then((result) => {
        const body = result && result.data;
        this.equipmentOwner = body;
        this.equipmentOwnerModalData = body.data;
      });
    }
  }

  get isPageInProcess(): boolean {
    return this.pageState === State.InProcess;
  }

  // Modal window methods //
  /////////////////////////

  public onSubmitEquipmentOwner() {
    if (this.isModalInProcess) {
      return;
    }

    this.equipmentOwnerModalState = State.InProcess;

    const onSuccess = () => {
      this.equipment.ownerId = this.equipmentOwnerModalData
        ? this.equipmentOwnerModalData.id
        : undefined;
      this.equipmentOwner = this.equipmentOwnerModalData;

      this.equipmentOwnerModalState = State.Default;
      this.equipmentOwnerModalShow = false;

      this.$notify({
        title: 'Владелец успешно изменён',
        duration: 500
      });
    };

    const assignEquipment = () => {
      return this.$store
        .dispatch(USER_ASSIGN_EQUIPMENT, {
          equipment: this.equipment,
          user: this.equipmentOwnerModalData
        })
        .then((equipment: IEquipment) => {
          onSuccess();
        })
        .catch((err) => {
          console.log(err);
          this.equipmentOwnerModalState = State.Error;
        });
    };

    if (this.equipment.ownerId) {
      this.$store
        .dispatch(USER_REMOVE_EQUIPMENT, {
          equipment: this.equipment,
          owner: this.equipment.ownerId
        })
        .then((equipment: IEquipment) => {
          if (this.equipmentOwnerModalData) {
            assignEquipment();
          } else {
            onSuccess();
          }
        })
        .catch((err) => {
          console.log(err);
          this.equipmentOwnerModalState = State.Error;
        });
    } else if (this.equipmentOwnerModalData) {
      assignEquipment();
    } else {
      onSuccess();
    }
  }

  public showEquipmentOwnerModal() {
    this.equipmentOwnerModalShow = true;
  }

  get isModalInProcess(): boolean {
    return this.equipmentOwnerModalState === State.InProcess;
  }
}

export const equipmentEditPageRoute: RouteConfig = {
  path: '/equipment/:id',
  name: 'EquipmentEditPage',
  component: EquipmentEditPage,
  meta: {
    allow: ['CanEditEquipment', 'CanEditEquipment']
  } as IPageMeta
};
</script>
<!-- SCRIPT END -->


<!-- STYLES BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.equipment-edit-page {
  @include media-breakpoint-down(sm) {
    .buttons > div {
      margin-bottom: 0.5rem;
    }

    .buttons > div:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<!-- STYLES END -->