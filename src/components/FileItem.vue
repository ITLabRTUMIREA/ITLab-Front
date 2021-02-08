<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-file-item default">
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
			</b-row>
      <hr />
			<b-row>
				<b-col md="8">
          <h3 style="margin-bottom: 0; text-overflow: ellipsis; overflow: hidden">{{ file.filename }}</h3>

					<br />
          <b>Markdown для использования:</b>
          <p style="word-break: break-all;">{{ link }}</p>
        </b-col>
				<b-col md="4">
          <div>
            <img
              v-if="isImg"
              :src="`${origin}mfs/download/${file.id}`"
              :alt="file.filename"
              loading="lazy"
            />
          </div>
        </b-col>
			</b-row>
			<b-row class="mt-2">
        <b-col cols="12 mr-auto" md="auto">
          <b-button
            v-if="copyText(true)"
            variant="primary"
            class="w-100"
            style="margin-bottom: 8px;"
            @click="() => copyText(false)"
          >Скопирывать ссылку</b-button>
        </b-col>
        <b-col cols="12" md="auto">
          <b-button class="w-100" @click="deleteFile" variant="danger">Удалить</b-button>
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
import Icon from 'vue-awesome/components/Icon';

import { Prop } from 'vue-property-decorator';
import { IReportFile, REPORT_FILE_DELETE } from '../modules/reports';

@Component({
  components: {
    icon: Icon
  }
})
export default class CFileItem extends Vue {
  // Properties //
  ///////////////

  @Prop()
  public file!: IReportFile;

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

  public copyText(check: boolean): boolean {
    if (navigator.clipboard) {
      if (check) {
        navigator.clipboard.writeText(this.link);
      }

      return true;
    }
    return false;
  }

  public deleteFile() {
    this.$store.dispatch(REPORT_FILE_DELETE, this.file.id);
  }

  get date(): string {
    if (!this.file.uploadDate) {
      return '';
    }

    return moment(this.file.uploadDate).format(this.$g.DATETIME_FORMAT);
  }

  get dateCalendar(): string {
    if (!this.file.uploadDate) {
      return '';
    }

    return moment(this.file.uploadDate).calendar();
  }

  get origin(): string {
    if (location.origin.indexOf(':') > -1) {
      return localStorage.getItem('api-url') || '';
    } else {
      return location.origin + '/api/';
    }
  }

  get isImg(): boolean {
    return /[w]*.(jpg|png|gif)$/.test(this.file.filename.toLowerCase());
  }

  get link(): string {
    return `${this.isImg ? '!' : ''}[${this.file.filename}](${this.origin}mfs/download/${this.file.id})`;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss" scope>
@import '@/styles/general.scss';

.c-file-item {
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

img {
  width: 100%;
}
</style>
<!-- STYLE END -->
