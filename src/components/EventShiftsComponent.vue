<!-- TEMPLATE BEGIN -->
<template>
  <div class="event-shifts-component">
    <div class="shift" v-for="(shift, shiftIndex) in eventShifts" :key="`shift-${shiftIndex}`" v-if="!shift.delete">
      <b-row>
        <b-col cols="12" md="auto" class="ml-md-1 text-center text-md-left mb-2 mb-md-0">
          <b-row>
            <b-col>
              <b>{{ shift.beginTime | moment($g.DATETIME_FORMAT) }}</b> &mdash;
              <b>{{ getShiftEndTime(shift) }}</b> ({{ getShiftDuration(shift) }})
            </b-col>
          </b-row>
          <b-row v-if="shift.description">
            <b-col>
              {{ shift.description }}
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" md="auto" class="ml-md-auto d-flex align-content-between align-items-start" v-if="editable">
          <b-button variant="outline-secondary" class="btn-sm w-100 mr-1 order-2 order-md-1" @click="showShiftModal(shiftIndex, true)">Клонировать</b-button>
          <b-button variant="warning" class="btn-sm w-100 mr-md-1 order-3 order-md-2" @click="showShiftModal(shiftIndex)">Изменить</b-button>
          <b-button variant="outline-danger" class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-3" @click="onRemoveShift(shiftIndex)" v-bind:disabled="!canDeleteShift">
            <icon name="times" class="d-none d-md-inline" style="position: relative; top: -2px;"></icon>
            <span class="d-inline d-md-none">Удалить</span>
          </b-button>
        </b-col>
      </b-row>
      <hr>
      <b-row>
        <b-col>
          <div v-for="(place, placeIndex) in shift.places" :key="`place-${placeIndex}`" class="place" v-if="!place.delete">
            <div class="place-title drag-handle">
              <b-row>
                <b-col cols="12" md="auto" class="ml-md-1 text-center text-md-left mb-2 mb-md-0">
                  <b-row>
                    <b-col>
                      Место #{{ placeIndex + 1}} | {{ getPlaceTargetParticipantsCount(place) }}
                    </b-col>
                    <b-col>
                      {{ getPlaceTargetavAilableParticipantsCount(place) }}
                    </b-col>
                  </b-row>
                  <b-row v-if="place.description">
                    <b-col>
                      {{ place.description }}
                    </b-col>
                  </b-row>
                </b-col>
                <b-col cols="12" md="auto" class="ml-md-auto d-flex align-content-between align-items-start">
                  <template v-if="editable">
                    <b-button variant="outline-secondary" class="btn-sm w-100 mr-md-1 order-2 order-md-1" @click="showPlaceModal(shift, placeIndex)">Изменить</b-button>
                    <b-button variant="outline-secondary" class="btn-sm w-100 mr-1 mr-md-0 order-1 order-md-2" @click="removePlace(shift, placeIndex)" v-if="canDeletePlace(shift)">
                      <icon name="times" class="d-none d-md-inline" style="position: relative; top: -2px;"></icon>
                      <span class="d-inline d-md-none">Удалить</span>
                    </b-button>
                  </template>
                  <template v-else>
                    <b-button variant="outline-secondary" class="btn-sm w-100 theme-light-only" @click="showApplicationModal(shift, placeIndex)">Подать заявку</b-button>
                    <b-button variant="secondary" class="btn-sm w-100 theme-dark-only" @click="showApplicationModal(shift, placeIndex)">Подать заявку</b-button>
                  </template>
                </b-col>
              </b-row>
            </div>
            <div class="place-data">
              <b-row>
                <b-col cols="12" md="6">
                  <div class="list-group">
                    <!-- Accepted participants -->
                    <li class="list-group-item" v-for="(participant, participantIndex) in place.participants" :key="`place-${placeIndex}-participant-${participantIndex}`" v-if="!participant.delete">
                      <b-row>
                        <b-col cols="auto mr-auto">
                          <b>{{participant.user.firstName}} {{participant.user.lastName}}</b>
                          <span class="badge badge-success badge-pill noselect" v-b-tooltip.hover title="Подтверждённый">{{ participant.eventRole.title }}</span><br>
                          <mail-link :email="participant.user.email" />
                        </b-col>
                        <b-col cols="auto" v-if="editable">
                          <div class="remove-button" @click="removePlaceParticipant(place.participants, participantIndex)">
                            <icon name="times"></icon>
                          </div>
                        </b-col>
                      </b-row>
                    </li>

                    <!-- Invited participants -->
                    <li class="list-group-item" v-for="(participant, participantIndex) in place.invited" :key="`place-${placeIndex}-invited-${participantIndex}`" v-if="!participant.delete">
                      <b-row>
                        <b-col cols="auto mr-auto">
                          <b>{{participant.user.firstName}} {{participant.user.lastName}}</b>
                          <span class="badge badge-warning badge-pill noselect" v-b-tooltip.hover title="Не подтверждённый">{{ participant.eventRole.title }}</span><br>
                          <mail-link :email="participant.user.email" />
                        </b-col>
                        <b-col cols="auto" v-if="editable">
                          <div class="remove-button" @click="removePlaceParticipant(place.invited, participantIndex)">
                            <icon name="times"></icon>
                          </div>
                        </b-col>
                      </b-row>
                    </li>

                    <li class="list-group-item list-group-item-action group-button" v-if="editable" @click="showPlaceInvitedParticipantModal(place)">
                      Пригласить участника
                    </li>
                  </div>
                </b-col>
                <b-col cols="12" md="6" class="mt-2 mt-md-0">
                  <div class="list-group">
                    <li class="list-group-item" v-for="(equipment, equipmentIndex) in place.equipment" :key="`place-${placeIndex}-equipment-${equipmentIndex}`" v-if="!equipment.delete">
                      <b-row>
                        <b-col cols="auto mr-auto">
                          <b>{{ equipment.equipmentType.title }}</b><br>{{ equipment.serialNumber }}
                        </b-col>
                        <b-col cols="auto" v-if="editable">
                          <div class="remove-button" @click="removePlaceEquipment(place, equipmentIndex)">
                            <icon name="times"></icon>
                          </div>
                        </b-col>
                      </b-row>
                    </li>
                    <li class="list-group-item list-group-item-action group-button" v-if="editable" @click="showPlaceEquipmentModal(shift, place)">
                      Добавить оборудование
                    </li>
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-button variant="outline-success" class="w-100 mt-2 theme-light-only" @click="showPlaceModal(shift)" v-if="editable">Добавить место</b-button>
      <b-button variant="success" class="w-100 mt-2 theme-dark-only" @click="showPlaceModal(shift)" v-if="editable">Добавить место</b-button>
    </div>

    <b-row>
      <b-col>
        <b-button variant="success" class="w-100" @click="showShiftModal()" v-if="editable">Добавить смену</b-button>
      </b-col>
    </b-row>

    <!-- MODAL BEGIN -->
    <b-modal v-model="modalShow">
      <template slot="modal-title">
        {{ modalTitle }}
      </template>

      <template v-if="fieldsVisivility.shift">
        <b-form-group label="Начало">
          <date-picker class="w-100" :first-day-of-week="1" v-model="shiftModalData.beginTime" v-bind:input-class="getShiftModalCalendarClasses()" :format="$g.DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1">
          </date-picker>
        </b-form-group>

        <b-form-group label="Конец">
          <date-picker class="w-100" :first-day-of-week="1" v-model="shiftModalData.endTime" v-bind:input-class="getShiftModalCalendarClasses()" :format="$g.DATETIME_FORMAT" lang="ru" type="datetime" :minute-step="1"></date-picker>
        </b-form-group>

        <b-form-group label="Описание">
          <b-form-input type="text" v-model="shiftModalData.description">
          </b-form-input>
        </b-form-group>

        <b-row v-if="shiftModalData.new === true && !shiftAdditionalModalData.clone">
          <b-col cols="12" sm="6">
            <b-form-group label="Кол-во мест">
              <b-form-input type="number" v-model.number="shiftAdditionalModalData.placeCount" :state="!$v.shiftAdditionalModalData.placeCount.$invalid">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="12" sm="6">
            <b-form-group label="Кол-во человек на место">
              <b-form-input type="number" v-model.number="shiftAdditionalModalData.placeParticipantCount" :state="!$v.shiftAdditionalModalData.placeCount.$invalid">
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row v-if="shiftAdditionalModalData.clone">
          <b-col>
            <b-form-checkbox class="noselect" v-model="shiftAdditionalModalData.cloneParticipants" :value="true" :unchecked-value="false">
              С участниками
            </b-form-checkbox>
          </b-col>
          <b-col>
            <b-form-checkbox class="noselect" v-model="shiftAdditionalModalData.cloneEquipment" :value="true" :unchecked-value="false">
              С оборудованием
            </b-form-checkbox>
          </b-col>
        </b-row>
      </template>

      <template v-if="fieldsVisivility.place">
        <b-form-group label="Необходимое кол-во участников">
          <b-form-input type="number" v-model.number="placeModalData.targetParticipantsCount" :state="!$v.placeModalData.targetParticipantsCount.$invalid">
          </b-form-input>
        </b-form-group>

        <b-form-group label="Описание">
          <b-form-input type="text" v-model="placeModalData.description">
          </b-form-input>
        </b-form-group>
      </template>

      <template v-if="fieldsVisivility.participant">
        <b-form-group label="Участник">
          <user-selection-component v-model="placeParticipantData.user" :state="!$v.placeParticipantData.user.$invalid"></user-selection-component>
        </b-form-group>

        <b-form-group label="Роль">
          <b-form-select v-model="placeParticipantData.eventRole" :state="!$v.placeParticipantData.eventRole.$invalid" :options="eventRoleOptions"></b-form-select>
        </b-form-group>
      </template>

      <template v-if="fieldsVisivility.equipment">
        <b-form-group label="Оборудование">
          <equipment-selection-component v-model="placeEquipmentModalData" :filter="equipmentSelectionFilter" :state="!$v.placeEquipmentModalData.$invalid"></equipment-selection-component>
        </b-form-group>
      </template>

      <template v-if="fieldsVisivility.application">
        <b-form-group label="Роль">
          <b-form-select v-model="applicationModalData" :options="eventRoleOptions" :state="!$v.applicationModalData.$invalid"></b-form-select>
        </b-form-group>
      </template>

      <template slot="modal-footer">
        <b-button variant="secondary" @click="modalShow = false">Отменить</b-button>
        <b-button variant="primary" :disabled="!isModalDataInvalid" @click="submitModal(); modalShow = false">Подтвердить</b-button>
      </template>
    </b-modal>
    <!-- MODAL END -->
  </div>
</template>
<!-- TEMPLATE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment-timezone';
import axios from 'axios';

import Draggable from 'vuedraggable';
import DatePicker from 'vue2-datepicker';
import Icon from 'vue-awesome/components/Icon';
import MailLinkComponent from '@/components/MailLinkComponent.vue';
import UserSelectionComponent from '@/components/UserSelectionComponent.vue';
import EquipmentSelectionComponent from '@/components/EquipmentSelectionComponent.vue';

import 'vue-awesome/icons/times';

import { validationMixin } from 'vuelidate';
import { required, minLength, helpers } from 'vuelidate/lib/validators';

import {
  IEventShift,
  EventShiftDefault,
  IEventPlace,
  EventPlaceDefault,
  IEventEquipment,
  IEventParticipant,
  EventParticipantDefault,
  IEventRole,
  EventRoleDefault,
  EVENT_ROLES_FETCH_ALL
} from '@/modules/events';

import {
  IEquipment,
  EquipmentDefault,
  IEquipmentType
} from '@/modules/equipment';
import { UserDefault, IUser } from '@/modules/users';
import { PROFILE_WISH } from '@/modules/profile';
import { getNounDeclension } from '@/stuff';

enum ModalState {
  Hidden,
  ShiftEdit,
  ShiftCreation,
  PlaceEdit,
  PlaceCreation,
  ParticipantInvitation,
  EquipmentAdding,
  ApplicationCreation
}

const shiftRangeModalValidator = (component: EventShiftsComponent) => {
  return () => {
    const shiftModalData = component.shiftModalData;
    return (
      shiftModalData &&
      moment(shiftModalData.beginTime) <= moment(shiftModalData.endTime)
    );
  };
};

@Component({
  components: {
    icon: Icon,
    draggable: Draggable,
    'date-picker': DatePicker,
    'mail-link': MailLinkComponent,
    'user-selection-component': UserSelectionComponent,
    'equipment-selection-component': EquipmentSelectionComponent
  },
  mixins: [validationMixin],
  validations() {
    return {
      shiftModalData: {
        beginTime: {
          required,
          validRange: shiftRangeModalValidator(this as EventShiftsComponent)
        },
        endTime: {
          required,
          validRange: shiftRangeModalValidator(this as EventShiftsComponent)
        }
      },
      shiftAdditionalModalData: {
        placeCount: {
          valid: (count: number | null) => count == null || count > 0
        },
        placeParticipantCount: {
          valid: (count: number | null) => count == null || count >= 0
        }
      },
      placeModalData: {
        targetParticipantsCount: {
          required,
          valid: (count: number) => count >= 0
        }
      },
      placeParticipantData: {
        user: {
          required,
          selected: (user?: IUser) => user && user.id !== ''
        },
        eventRole: {
          required,
          selected: (eventRole?: IEventRole) => eventRole && eventRole.id !== ''
        }
      },
      placeEquipmentModalData: {
        required,
        selected: (equipment?: IEquipment) => equipment && equipment.id !== ''
      },
      applicationModalData: {
        required,
        selected: (eventRole?: IEventRole) => eventRole && eventRole.id !== ''
      }
    };
  }
})
export default class EventShiftsComponent extends Vue {
  // v-model //
  ////////////

  @Prop() public value?: IEventShift[];

  // Properties //
  ///////////////

  @Prop() public editable?: boolean;

  public modalTitles: Map<ModalState, string> = new Map<ModalState, string>([
    [ModalState.Hidden, ''],
    [ModalState.ShiftEdit, 'Изменение смены'],
    [ModalState.ShiftCreation, 'Новая смена'],
    [ModalState.PlaceEdit, 'Изменение места'],
    [ModalState.PlaceCreation, 'Новое место'],
    [ModalState.ParticipantInvitation, 'Приглашение участника'],
    [ModalState.EquipmentAdding, 'Добавление оборудования'],
    [ModalState.ApplicationCreation, 'Заявка на участие']
  ]);

  public modalState: ModalState = ModalState.Hidden;

  public eventRoleOptions: Array<{
    value: IEventRole;
    text: string;
  }> = [];

  public equipmentSelectionFilter?: (equipment: IEquipment) => boolean;

  // Modal data //
  ///////////////

  public shiftModalData: IEventShift = new EventShiftDefault();
  public shiftAdditionalModalData: {
    clone: boolean;
    cloneParticipants: boolean;
    cloneEquipment: boolean;
    placeCount: number | null;
    placeParticipantCount: number | null;
  } = {
    clone: false,
    cloneParticipants: false,
    cloneEquipment: true,
    placeCount: null,
    placeParticipantCount: null
  };
  public placeModalData: IEventPlace = new EventPlaceDefault();
  public placeParticipantData: IEventParticipant | null = null;
  public placeEquipmentModalData: IEquipment | null = null;
  public applicationModalData: IEventRole | null = null;

  // Component methods //
  //////////////////////

  public mounted() {
    this.$watch('value', (shifts?: IEventShift[]) => {
      this.value = shifts ? shifts : [];
    });

    this.$store.dispatch(EVENT_ROLES_FETCH_ALL).then((result: IEventRole[]) => {
      const eventRoles: IEventRole[] = result;
      this.eventRoleOptions = eventRoles.map((v) => {
        return {
          value: v,
          text: v.title
        };
      });
    });

    if (!this.value) {
      this.value = [];
    }
  }

  public onInput() {
    if (!this.editable) {
      return;
    }
    this.$emit('input', this.value);
  }

  // Modal //
  //////////

  public submitModal: () => void = () => undefined;

  get modalShow(): boolean {
    return this.modalState !== ModalState.Hidden;
  }
  set modalShow(show: boolean) {
    if (!show) {
      this.modalState = ModalState.Hidden;
    }
  }

  get fieldsVisivility(): {
    shift: boolean;
    place: boolean;
    participant: boolean;
    equipment: boolean;
    application: boolean;
  } {
    return {
      shift: [ModalState.ShiftEdit, ModalState.ShiftCreation].includes(
        this.modalState
      ),
      place: [ModalState.PlaceEdit, ModalState.PlaceCreation].includes(
        this.modalState
      ),
      participant: this.modalState === ModalState.ParticipantInvitation,
      equipment: this.modalState === ModalState.EquipmentAdding,
      application: this.modalState === ModalState.ApplicationCreation
    };
  }

  get modalTitle(): string {
    const title = this.modalTitles.get(this.modalState);
    return title ? title : '';
  }

  get isModalDataInvalid(): boolean {
    switch (this.modalState) {
      case ModalState.ShiftEdit:
      case ModalState.ShiftCreation:
        return (
          (this.$v.shiftModalData &&
            !this.$v.shiftModalData.$invalid &&
            this.$v.shiftAdditionalModalData &&
            !this.$v.shiftAdditionalModalData.$invalid) ||
          false
        );

      case ModalState.PlaceEdit:
      case ModalState.PlaceCreation:
        return (
          (this.$v.placeModalData && !this.$v.placeModalData.$invalid) || false
        );

      case ModalState.ParticipantInvitation:
        return (
          (this.$v.placeParticipantData &&
            !this.$v.placeParticipantData.$invalid) ||
          false
        );

      case ModalState.EquipmentAdding:
        return (
          (this.$v.placeEquipmentModalData &&
            !this.$v.placeEquipmentModalData.$invalid) ||
          false
        );

      case ModalState.ApplicationCreation:
        return (
          (this.$v.applicationModalData &&
            !this.$v.applicationModalData.$invalid) ||
          false
        );

      default:
        return false;
    }
  }

  // Shift handlers //
  ///////////////////

  public getShiftEndTime(shift: IEventShift): string {
    const shiftBeginDay = moment(shift.beginTime).startOf('day');
    const shiftEndDay = moment(shift.endTime).startOf('day');

    if (shiftBeginDay.isSame(shiftEndDay)) {
      return moment(shift.endTime).format(this.$g.TIME_FORMAT);
    } else {
      return moment(shift.endTime).format(this.$g.DATETIME_FORMAT);
    }
  }

  public getShiftDuration(shift: IEventShift): string {
    return moment
      .duration(moment(shift.endTime).diff(moment(shift.beginTime)))
      .humanize();
  }

  public onEditShift(shiftIndex?: number) {
    if (
      (shiftIndex && !this.value) ||
      this.shiftModalData == null ||
      ((this.$v.shiftModalData && this.$v.shiftModalData.$invalid) ||
        (this.$v.shiftAdditionalModalData &&
          this.$v.shiftAdditionalModalData.$invalid))
    ) {
      return;
    }

    if (!this.value) {
      this.value = [];
    }

    const shift =
      shiftIndex != null ? this.value[shiftIndex] : new EventShiftDefault();

    shift.beginTime = this.shiftModalData.beginTime;
    shift.endTime = this.shiftModalData.endTime;
    shift.description = this.shiftModalData.description;

    if (shiftIndex != null) {
      Vue.set(this.value, shiftIndex, shift);
    } else {
      if (this.shiftAdditionalModalData.clone) {
        shift.places = this.shiftModalData.places.reduce(
          (places, currentPlace) => {
            if (currentPlace.delete === true) {
              return places;
            } else {
              const newPlace: IEventPlace = new EventPlaceDefault();
              newPlace.new = true;
              newPlace.targetParticipantsCount =
                currentPlace.targetParticipantsCount;
              newPlace.description = currentPlace.description;

              if (this.shiftAdditionalModalData.cloneParticipants) {
                const participantsReducer = (
                  participants: IEventParticipant[],
                  currentParticipant: IEventParticipant
                ) => {
                  if (currentParticipant.delete === true) {
                    return participants;
                  } else {
                    const newParticipant: IEventParticipant = Object.assign(
                      {},
                      currentParticipant
                    );
                    newParticipant.new = true;

                    return participants.concat(newParticipant);
                  }
                };

                newPlace.invited = currentPlace.participants
                  .reduce(participantsReducer, new Array<IEventParticipant>())
                  .concat(
                    currentPlace.invited.reduce(
                      participantsReducer,
                      new Array<IEventParticipant>()
                    )
                  );
              }

              if (this.shiftAdditionalModalData.cloneEquipment) {
                newPlace.equipment = currentPlace.equipment.reduce(
                  (equipment, currentEquipment) => {
                    if (currentEquipment.delete === true) {
                      return equipment;
                    } else {
                      const newEquipment: IEventEquipment = Object.assign(
                        {},
                        currentEquipment
                      );
                      newEquipment.new = true;

                      return equipment.concat(newEquipment);
                    }
                  },
                  new Array<IEquipment>()
                );
              }

              return places.concat(newPlace);
            }
          },
          new Array<IEventPlace>()
        );
      } else if (
        this.shiftAdditionalModalData.placeCount &&
        this.shiftAdditionalModalData.placeCount > 0
      ) {
        const newPlace = () => {
          const place: IEventPlace = new EventPlaceDefault();
          place.targetParticipantsCount =
            this.shiftAdditionalModalData.placeParticipantCount || 0;
          return place;
        };

        shift.places = [];
        for (let i = 0; i < this.shiftAdditionalModalData.placeCount; ++i) {
          shift.places.push({
            ...newPlace(),
            new: true
          });
        }
      }

      this.value.push({ ...shift, new: true });
    }
    this.onInput();
  }

  public onRemoveShift(shiftIndex: number) {
    if (!this.value) {
      return;
    }

    const shift = this.value[shiftIndex];
    if (shift.new === true) {
      Vue.delete(this.value, shiftIndex);
    } else {
      shift.delete = true;
      Vue.set(this.value, shiftIndex, shift);
    }
    this.onInput();
  }

  public canDeleteShift(): boolean {
    return this.value != null && this.value.filter((v) => !v.delete).length > 1;
  }

  public showShiftModal(
    shiftIndex: number | undefined,
    clone: boolean = false
  ) {
    let newState: ModalState = ModalState.Hidden;
    this.shiftAdditionalModalData.clone = clone;

    if (shiftIndex != null) {
      if (!this.value) {
        return;
      }

      const shift = this.value[shiftIndex];

      this.shiftModalData.beginTime = shift.beginTime;
      this.shiftModalData.endTime = shift.endTime;
      this.shiftModalData.description = shift.description;

      if (clone) {
        this.shiftModalData.places = shift.places;
      } else {
        this.shiftModalData.new = false;
        newState = ModalState.ShiftEdit;
        this.submitModal = () => this.onEditShift(shiftIndex);
      }
    }

    if (shiftIndex == null || clone) {
      this.shiftModalData.new = true;
      newState = ModalState.ShiftCreation;
      this.submitModal = () => this.onEditShift();
    }

    this.modalState = newState;
  }

  public getShiftModalCalendarClasses() {
    const baseClasses = 'form-control';

    const validationData = this.$v.shiftModalData;
    if (validationData == null) {
      return baseClasses;
    } else {
      return `${baseClasses} ${
        validationData.$invalid ? 'is-invalid' : 'is-valid'
      }`;
    }
  }

  // Place handlers //
  ///////////////////

  public getPlaceTargetParticipantsCount(place: IEventPlace): string {
    if (place.targetParticipantsCount === 0) {
      return 'Участники не требуются';
    }

    const nounNeed = getNounDeclension(place.targetParticipantsCount, [
      'Нужен',
      'Нужно',
      'Нужно'
    ]);
    const nounParticipant = getNounDeclension(place.targetParticipantsCount, [
      'участник',
      'участника',
      'участников'
    ]);
    return `${nounNeed} ${place.targetParticipantsCount} ${nounParticipant}`;
  }

  public getPlaceTargetavAilableParticipantsCount(place: IEventPlace): string {

    if (place.targetParticipantsCount === 0) {
      return '';
    }

    let availableCountParticipaint = place.targetParticipantsCount - place.wishers.length - place.invited.length
     - place.participants.length;

    if (availableCountParticipaint === 0) {
      return 'Участников досаточно';
    }
    let nounNeed: string;
    let nounParticipant: string;
    if (availableCountParticipaint > 0) {
    nounNeed = getNounDeclension(availableCountParticipaint, [
      'Необходим',
      'Необходимо',
      'Необходимо'
    ]);
    nounParticipant = getNounDeclension(availableCountParticipaint, [
    'участник',
    'участника',
    'участников'
    ]);
    } else {
    nounNeed = 'Перебор:';
    nounParticipant = getNounDeclension(availableCountParticipaint, [
    'участник',
    'участника',
    'участников'
    ]);
    availableCountParticipaint *= -1;
    }

    return `${nounNeed} ${availableCountParticipaint} ${nounParticipant}`;
  }

  public onEditPlace(shift: IEventShift, placeIndex?: number) {
    if (
      this.placeModalData == null ||
      (this.$v.placeModalData && this.$v.placeModalData.$invalid)
    ) {
      return;
    }

    const place =
      placeIndex != null ? shift.places[placeIndex] : new EventPlaceDefault();

    place.targetParticipantsCount = this.placeModalData.targetParticipantsCount;
    place.description = this.placeModalData.description;

    if (placeIndex != null) {
      Vue.set(shift.places, placeIndex, place);
    } else {
      shift.places.push({ ...place, new: true });
    }
    this.onInput();
  }

  public removePlace(shift: IEventShift, placeIndex: number) {
    const place = shift.places[placeIndex];
    if (place.new === true) {
      Vue.delete(shift.places, placeIndex);
    } else {
      place.delete = true;
      Vue.set(shift.places, placeIndex, place);
    }
    this.onInput();
  }

  public canDeletePlace(shift: IEventShift): boolean {
    return shift.places.filter((v) => !v.delete).length > 1;
  }

  public showPlaceModal(shift: IEventShift, placeIndex: number | undefined) {
    let newState: ModalState;

    if (placeIndex != null) {
      if (!this.value) {
        return;
      }

      const place = shift.places[placeIndex];
      this.placeModalData.new = true;
      this.placeModalData.targetParticipantsCount =
        place.targetParticipantsCount;
      this.placeModalData.description = place.description;

      newState = ModalState.PlaceEdit;
      this.submitModal = () => this.onEditPlace(shift, placeIndex);
    } else {
      this.placeModalData.new = true;

      newState = ModalState.PlaceCreation;
      this.submitModal = () => this.onEditPlace(shift);
    }

    this.modalState = newState;
  }

  // Place participant handlers //
  ///////////////////////////////

  public onAddPlaceParticipant(place: IEventPlace) {
    if (
      this.placeParticipantData == null ||
      (this.$v.placeParticipantData && this.$v.placeParticipantData.$invalid)
    ) {
      return;
    }

    const participant = new EventParticipantDefault();
    participant.user = this.placeParticipantData.user;
    participant.eventRole = this.placeParticipantData.eventRole;

    const existingParticipantIndex = place.invited.findIndex(
      (p) =>
        p.user.id === participant.user.id &&
        (p.eventRole === participant.eventRole ||
          (p.eventRole != null &&
            participant.eventRole != null &&
            p.eventRole.id === participant.eventRole.id))
    );

    if (existingParticipantIndex === -1) {
      place.invited.push({ ...participant, new: true });
    } else {
      Vue.set(place.invited, existingParticipantIndex, participant);
    }

    this.onInput();
  }

  public removePlaceParticipant(
    participantsGroup: IEventParticipant[],
    participantIndex: number
  ) {
    const participant = participantsGroup[participantIndex];
    if (participant.new === true) {
      Vue.delete(participantsGroup, participantIndex);
    } else {
      participant.delete = true;
      Vue.set(participantsGroup, participantIndex, participant);
    }
    this.onInput();
  }

  public showPlaceInvitedParticipantModal(place: IEventPlace) {
    this.placeParticipantData = new EventParticipantDefault();
    this.submitModal = () => this.onAddPlaceParticipant(place);
    this.modalState = ModalState.ParticipantInvitation;
  }

  // Place equipment handlers //
  /////////////////////////////

  public onAddPlaceEquipment(shift: IEventShift, place: IEventPlace) {
    if (
      !this.placeEquipmentModalData ||
      (this.$v.placeEquipmentModalData &&
        this.$v.placeEquipmentModalData.$invalid) ||
      !this.canAddEquipment(shift, place, this.placeEquipmentModalData)
    ) {
      return;
    }

    const equipment = this.placeEquipmentModalData;

    const existingEquipmentIndex = place.equipment.findIndex(
      (e) => e.id === equipment.id
    );

    if (existingEquipmentIndex === -1) {
      place.equipment.push({ ...equipment, new: true });
    } else {
      Vue.set(place.equipment, existingEquipmentIndex, equipment);
    }

    this.onInput();
  }

  public removePlaceEquipment(place: IEventPlace, equipmentIndex: number) {
    const equipment = place.equipment[equipmentIndex];
    if (equipment.new === true) {
      Vue.delete(place.equipment, equipmentIndex);
    } else {
      equipment.delete = true;
      Vue.set(place.equipment, equipmentIndex, equipment);
    }
    this.onInput();
  }

  public showPlaceEquipmentModal(shift: IEventShift, place: IEventPlace) {
    this.equipmentSelectionFilter = (equipment: IEquipment) =>
      this.canAddEquipment(shift, place, equipment);

    this.placeEquipmentModalData = null;
    this.submitModal = () => this.onAddPlaceEquipment(shift, place);
    this.modalState = ModalState.EquipmentAdding;
  }

  public canAddEquipment(
    shift: IEventShift,
    place: IEventPlace,
    equipment: IEquipment
  ) {
    return !shift.places.some((p) =>
      p.equipment.some((e) => e.delete !== true && e.id === equipment.id)
    );
  }

  // Application handlers

  public onCreateApplication(place: IEventPlace) {
    if (this.$v.applicationModalData && this.$v.applicationModalData.$invalid) {
      return;
    }

    this.$store
      .dispatch(PROFILE_WISH, { place, eventRole: this.applicationModalData })
      .then((response) => {
        this.$notify({
          title: 'Заявка отправлена',
          duration: 500
        });
      })
      .catch((error) => {
        this.$notify({
          title: 'Невозможно отправить заявку',
          text: 'Возможно вы уже участвуете/подали заявку',
          type: 'error',
          duration: 1500
        });
      });
  }

  public showApplicationModal(shift: IEventShift, placeIndex: number) {
    if (placeIndex < 0 || placeIndex >= shift.places.length) {
      return;
    }

    this.submitModal = () => {
      this.onCreateApplication(shift.places[placeIndex]);
    };
    this.modalState = ModalState.ApplicationCreation;
  }

  // Computed data //
  //////////////////

  get eventShifts(): IEventShift[] {
    return this.value
      ? this.value.sort((a, b) => {
          if (a.beginTime < b.beginTime) {
            return -1;
          } else if (a.beginTime > b.beginTime) {
            return 1;
          } else {
            return 0;
          }
        })
      : [];
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.event-shifts-component {
  .shift {
    display: block;
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;

    @include theme-specific() {
      background-color: getstyle(form-control-background-color);
      border-color: darken(getstyle(form-control-background-color), 10%);
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    .place {
      margin-top: 5px;
      border: 1px solid darken(getcolor(white, base), 10%);
      border-radius: 0.25rem;

      .badge {
        margin-left: 5px;
      }

      .remove-button {
        @extend .noselect;
        cursor: pointer;

        transition: color 0.15s ease-in-out;

        svg {
          position: relative;
          top: -2px;
        }

        &:hover {
          color: var(--danger);
        }
      }

      .place-title {
        background-color: getcolor(white, base);
        padding: 0.375rem 0.75rem;

        .text {
          @extend .noselect;
          line-height: 31px;
        }

        @include theme-specific() {
          background-color: getstyle(event-shifts-card-title-background);
        }
      }

      .place-data {
        padding: 0.375rem 0.75rem;

        .list-group-item {
          @include theme-specific() {
            background-color: getstyle(event-shifts-card-items-background);
          }
        }

        .list-group-item:hover,
        .list-group-item:focus {
          z-index: 0;
        }

        .list-group .group-button {
          @extend .noselect;

          cursor: pointer;
          color: var(--primary);
          text-align: center;

          padding: 0.375rem 0.75rem;
          border-color: var(--primary);

          transition: color 0.15s ease-in-out,
            background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;

          &:hover {
            color: #fff;
            background-color: var(--primary);
          }
        }
      }
    }
  }
}
</style>
<!-- STYLE END -->