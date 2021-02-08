<!-- TEMPLATE BEGIN -->
<template>
  <div class="c-markdown-editor">
    <b-row>
      <b-col class="title">
        <slot name="title"></slot>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="auto" cols="mr-auto">
        <div :class="`tab ${activeTab === 'write' ? 'active' : ''}`" @click="() => activeTab = 'write'">Писать</div>
        <div :class="`tab ${activeTab === 'preview' ? 'active' : ''}`" @click="() => activeTab = 'preview'">Превью</div>
      </b-col>
      <b-col class="big-buttons"></b-col>
      <b-col md="auto" class="big-buttons" v-if="activeTab === 'write'">
        <img class="img-btn" :src="url('svg/editor/header.svg')" @click="() => press('h')" />
        <img class="img-btn" :src="url('svg/editor/bold.svg')" @click="() => press('b')" />
        <img class="img-btn" :src="url('svg/editor/italic.svg')" @click="() => press('i')" />
      </b-col>
      <b-col md="auto" class="big-buttons" v-if="activeTab === 'write'">
        <img class="img-btn" :src="url('svg/editor/quote.svg')" @click="() => press('q')" />
        <img class="img-btn" :src="url('svg/editor/code.svg')" @click="() => press('k')" />
        <img class="img-btn" :src="url('svg/editor/link.svg')" @click="() => press('l')" />
      </b-col>
      <b-col md="auto" class="big-buttons" v-if="activeTab === 'write'">
        <img class="img-btn" :src="url('svg/editor/bulleted-list.svg')" @click="() => press('u')" />
        <img class="img-btn" :src="url('svg/editor/numbered-list.svg')" @click="() => press('o')" />
        <img class="img-btn" :src="url('svg/editor/task.svg')" @click="() => press('j')" />
      </b-col>
      <b-col md="auto" class="big-buttons" v-if="activeTab === 'write'">
        <label for="attach1"><img class="img-btn" :src="url('svg/editor/attach.svg')" /></label>
        <input id="attach1" type="file" style="display: none;" @change="attach" multiple />
      </b-col>
    </b-row>
    <div class="line" />
    <b-row class="small-buttons" v-if="activeTab === 'write'">
      <b-col sm="auto" cols="auto">
        <img class="img-btn" :src="url('svg/editor/header.svg')" @click="() => press('h')" />
        <img class="img-btn" :src="url('svg/editor/bold.svg')" @click="() => press('b')" />
        <img class="img-btn" :src="url('svg/editor/italic.svg')" @click="() => press('i')" />
      </b-col>
      <b-col sm="auto" cols="auto">
        <img class="img-btn" :src="url('svg/editor/quote.svg')" @click="() => press('q')" />
        <img class="img-btn" :src="url('svg/editor/code.svg')" @click="() => press('k')" />
        <img class="img-btn" :src="url('svg/editor/link.svg')" @click="() => press('l')" />
      </b-col>
      <b-col sm="auto" cols="auto" class="hidden-col">
        <img class="img-btn" :src="url('svg/editor/bulleted-list.svg')" @click="() => press('u')" />
        <img class="img-btn" :src="url('svg/editor/numbered-list.svg')" @click="() => press('o')" />
        <img class="img-btn" :src="url('svg/editor/task.svg')" @click="() => press('j')" />
      </b-col>
      <b-col sm="auto" cols="auto">
        <label for="attach2"><img class="img-btn" :src="url('svg/editor/attach.svg')" /></label>
        <input id="attach2" type="file" style="display: none;" @change="attach" multiple />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-textarea
          v-if="activeTab === 'write'"
          id="report"
          rows="10"
          v-model="report"
          @drop="handleFile"
          @dragenter="() => changeBorder(true)"
          @dragleave="() => changeBorder(false)"
          @dragover="(e) => e.preventDefault()"
          @keydown="onKeyDown"
          @click="updateTextArea"
          :class="textareaBorder"
        >
        </b-form-textarea>
        <div
          v-if="activeTab === 'write'"
          class="drag-and-drop"
          :class="textareaBorder"
        >
          <span v-if="!filesLoading">Прикрепляйте файлы, перетаскивая их в поле.</span>
          <span v-else>Загрузка файлов</span>
        </div>
        <div v-else id="preview">
          <markdown-it-vue class="md-body" :content="report" />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="auto" class="ml-auto">
        <slot name="actionButton"></slot>
      </b-col>
    </b-row>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { REPORT_FILE_COMMIT } from '../modules/reports';

import MarkdownItVue from 'markdown-it-vue';
import 'markdown-it-vue/dist/markdown-it-vue.css';

Vue.component(MarkdownItVue.name, MarkdownItVue);

@Component
export default class CMarkdownEditor extends Vue {
  // v-modal //
  ////////////

  @Prop({
    default: ''
  })
  public value!: string;

  // Properties //
  ///////////////

  public report: string = '';

  public activeTab: string = 'write';
  public textArea!: HTMLTextAreaElement;
  public border: string = '';

  public filesLoading: boolean = false;

  // Component methods //
  //////////////////////

  public mounted() {
    this.report = this.value;
    this.$watch('value', (value: string) => {
      this.report = value;
    });
    
    this.$watch('report', (value: string) => {
      this.$emit('input', value);
    });

    this.textArea = document.getElementById('report')! as HTMLTextAreaElement;

    if (localStorage.getItem('reportText') !== null) {
      this.report = localStorage.getItem('reportText') || '';
    }

    setInterval(() => localStorage.setItem('reportText', this.report), 1000);
  }

  // Methods //
  ////////////

  public onKeyDown(e: KeyboardEvent) {
    this.textArea = e.target as HTMLTextAreaElement;
    let start = this.textArea.selectionStart;
    let end = this.textArea.selectionEnd;

    let changed = false;
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      changed = true;

      let place = 0;
      for (let i = start - 1; i >= 0 && place === 0; i--) {
        if (this.report.charAt(i) === `\n`) {
          place = i + 1;
        }
      }
      this.report = this.report.substring(0, place) + `### `
        + this.report.substring(place, this.report.length);
      start = start + 4;
      end = end + 4;

      for (let i = start; i < end; i++) {
        if (this.report.charAt(i) === `\n`) {
          this.report = this.report.substring(0, i + 1) + `### `
            + this.report.substring(i + 1, this.report.length);
          end = end + 4;
        }
      }
    } else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      changed = true;

      this.report = this.report.substring(0, start) + `*`
        + this.report.substring(start, this.report.length);
      start = start + 1;
      end = end + 1;
      this.report = this.report.substring(0, end) + `*`
        + this.report.substring(end, this.report.length);
    } else if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      changed = true;

      this.report = this.report.substring(0, start) + `**`
        + this.report.substring(start, this.report.length);
      start = start + 2;
      end = end + 2;
      this.report = this.report.substring(0, end) + `**`
        + this.report.substring(end, this.report.length);
    } else if (e.ctrlKey && e.key === 'q') {
      e.preventDefault();
      changed = true;

      let place = 0;
      for (let i = start - 1; i >= 0 && place === 0; i--) {
        if (this.report.charAt(i) === `\n`) {
          place = i + 1;
        }
      }
      this.report = this.report.substring(0, place) + `> `
        + this.report.substring(place, this.report.length);
      start = start + 2;
      end = end + 2;

      for (let i = start; i < end; i++) {
        if (this.report.charAt(i) === `\n`) {
          this.report = this.report.substring(0, i + 1) + `> `
            + this.report.substring(i + 1, this.report.length);
          end = end + 2;
        }
      }
    } else if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      changed = true;

      this.report = this.report.substring(0, start) + `\``
        + this.report.substring(start, this.report.length);
      start = start + 1;
      end = end + 1;
      this.report = this.report.substring(0, end) + `\``
        + this.report.substring(end, this.report.length);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      changed = true;

      this.report = this.report.substring(0, start) + `[`
        + this.report.substring(start, this.report.length);
      start = start + 1;
      end = end + 1;
      this.report = this.report.substring(0, end) + `](url)`
        + this.report.substring(end, this.report.length);
    } else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      changed = true;

      let place = 0;
      for (let i = start - 1; i >= 0 && place === 0; i--) {
        if (this.report.charAt(i) === `\n`) {
          place = i + 1;
        }
      }
      this.report = this.report.substring(0, place) + `- `
        + this.report.substring(place, this.report.length);
      start = start + 2;
      end = end + 2;

      for (let i = start; i < end; i++) {
        if (this.report.charAt(i) === `\n`) {
          this.report = this.report.substring(0, i + 1) + `- `
            + this.report.substring(i + 1, this.report.length);
          end = end + 2;
        }
      }
    } else if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      changed = true;

      let place = 0;
      let order = 1;
      for (let i = start - 1; i >= 0 && place === 0; i--) {
        if (this.report.charAt(i) === `\n`) {
          place = i + 1;
        }
      }
      this.report = this.report.substring(0, place) + `${order}. `
        + this.report.substring(place, this.report.length);
      start = start + 2 + order.toString().length;
      end = end + 2 + order.toString().length;
      order = order + 1;

      for (let i = start; i < end; i++) {
        if (this.report.charAt(i) === `\n`) {
          this.report = this.report.substring(0, i + 1) + `${order}. `
            + this.report.substring(i + 1, this.report.length);
          end = end + 2 + order.toString().length;
          order = order + 1;
        }
      }
    } else if (e.ctrlKey && e.key === 'j') {
      e.preventDefault();
      changed = true;

      let place = 0;
      for (let i = start - 1; i >= 0 && place === 0; i--) {
        if (this.report.charAt(i) === `\n`) {
          place = i + 1;
        }
      }
      this.report = this.report.substring(0, place) + `- [ ] `
        + this.report.substring(place, this.report.length);
      start = start + 6;
      end = end + 6;

      for (let i = start; i < end; i++) {
        if (this.report.charAt(i) === `\n`) {
          this.report = this.report.substring(0, i + 1) + `- [ ] `
            + this.report.substring(i + 1, this.report.length);
          end = end + 6;
        }
      }
    }

    if (changed) {
      setTimeout(() => {
        this.textArea.selectionStart = start;
        this.textArea.selectionEnd = end;
      }, 100);
    }
  }

  public async handleFile(e: DragEvent, inputFiles?: File[]) {
    e.preventDefault();
    this.changeBorder(false);

    const files: File[] = [];
    this.filesLoading = true;

    if (!inputFiles) {
      // @ts-ignore
      if (e.dataTransfer.items) {
        // @ts-ignore
        for (const item of e.dataTransfer.items) {
          if (item.kind === 'file') {
            files.push(item.getAsFile());
          }
        }
      } else {
        // @ts-ignore
        for (const file of e.dataTransfer.files) {
          if (file) {
            files.push(file);
          }
        }
      }
    } else {
      files.push(...inputFiles);
      console.log(files);
    }

    if (this.textArea.selectionStart || this.textArea.selectionEnd === 0 && files.length > 0) {

      const end = this.textArea.selectionEnd;
      for (const file of files) {

        this.report = this.report.substring(0, end) + `\n[Uploading ${file.name}...]()\n`
          + this.report.substring(end, this.report.length);

        try {
          const fileData = (await this.$store.dispatch(REPORT_FILE_COMMIT, file));

          const isImg = /[w]*.(jpg|png|gif)$/.test(fileData.filename.toLowerCase());

          this.report = this.report.replace(
            `[Uploading ${file.name}...]()`,
            `${isImg ? '!' : ''}[${fileData.filename}](${this.origin}mfs/download/${fileData.id})`
          );
        } catch {
          this.$notify({
            title: `Не удалось загрузить файл ${file.name}`,
            duration: 500
          });
        }
      }
    }

    this.filesLoading = false;
  }

  public attach(e: Event) {
    const files: File[] = [];
    // @ts-ignore
    const targrtFiles: FileList = (e.target as HTMLInputElement).files;

    for (let i = 0; i < targrtFiles.length; i++) {
      if (targrtFiles.item(i)) {
        // @ts-ignore
        files.push(targrtFiles.item(i));
      }
    }

    this.handleFile(new Event('drag') as DragEvent, files);

    // @ts-ignore
    (e.target as HTMLInputElement).value = null;
  }

  public changeBorder(status: boolean) {
    if (status) {
      this.border = 'drop-border';
    } else {
      this.border = '';
    }
  }

  public press(key: string) {
    const e = new KeyboardEvent('keydown', { key: key, ctrlKey: true});
    this.textArea.dispatchEvent(e);
  }

  public url(name: string) {
    if (location.origin.indexOf(':') > -1) {
      return location.origin.split(':9')[0] + ':9001/' + name;
    } else {
      return this.$g.FRONT_POSTFIX + name;
    }
  }

  public setActiveTab(name: string) {
    this.activeTab = name;
  }

  public updateTextArea(e: Event) {
    this.textArea = e.target as HTMLTextAreaElement;
  }

  get origin(): string {
    if (location.origin.indexOf(':') > -1) {
      return localStorage.getItem('api-url') || '';
    } else {
      return location.origin + '/api/';
    }
  }

  get textareaBorder() {
    return this.border;
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss" scope>
@import '@/styles/general.scss';

.theme-dark .c-markdown-editor {
  background-color: #333333;
  border-color: #555555;

  input, #report, #preview, .drag-and-drop {
    background-color: #1e1e1e;
    border-color: #555555;
    color: #d6d6d6;
  }

  .tab {
    background-color: #333333;

    &.active {
      border-color: #555555;
      background-color: #333333;
      box-shadow: 0 1px 0 0 #333333;
    }
  }

  .line {
    border-color: #555555;
  }

  .img-btn {
    filter: brightness(5.75) sepia(1) hue-rotate(97deg) saturate(0);
  }

  #report:focus {
    border-color: #555555;
  }

  .markdown-body {
    color: #d6d6d6;

    code {
      background-color: rgba(162, 148, 255 , 0.1);
    }
  }
}

.c-markdown-editor {
  padding: 8px;
  background-color: #fff;
  border: 1px solid #dedede;
  border-radius: 0.25rem;

  .title {
    margin-bottom: 16px;
  }

  .tab {
    display: inline-block;
    padding: 6px 12px;
    border: none;
    background: #fff;
    text-align: center;
    user-select: none;
    cursor: pointer;

    &.active {
      border: 1px solid #ced4da;
      border-bottom: none;
      border-radius: 0.25rem 0.25rem 0 0;
      background: #fff;
      box-shadow: 0 1px 0 0 #fff;
    }
  }

  .big-buttons {
    display: block;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .small-buttons {
    display: none;

    @media (max-width: 768px) {
      display: flex;
    }
  }

  .hidden-col {
    @media (max-width: 455px) {
      display: none;
    }
  }

  label {
    margin: 0;
  }

  .img-btn {
    height: 30px;
    width: 30px;
    margin: 3px 0;
    padding: 7px;
    cursor: pointer;

    &:hover {
      filter: brightness(3.8) sepia(1) hue-rotate(192deg) saturate(20);
    }
  }

  .line {
    width: calc(100% + 16px);
    margin-left: -8px;
    margin-bottom: 8px;
    border-top: 1px solid #ced4da;
  }

  #report {
    border-radius: 0.25rem 0.25rem 0 0;
    background-color: #fafbfc;
    border-bottom: 1px dashed #ced4da;

    &:focus {
      border: 1px solid #ced4da;
      box-shadow: none;
    }
  }

  .drag-and-drop {
    padding: 1px 5px;
    border: 1px solid #ced4da;
    border-top: none;
    border-radius: 0 0 0.25rem 0.25rem;
    background: #fafbfc;
    font-size: 13px;
    color: #586069;

    transition-property: border-color, box-shadow, -webkit-box-shadow;
    transition-duration: 0.15s, 0.15s, 0.15s;
    transition-timing-function: ease-in-out, ease-in-out, ease-in-out;
    transition-delay: 0s, 0s, 0s;
  }
  
  #preview {
    padding: 6px 12px;
    border-radius: 0.25rem;
    background-color: #fafbfc;
    border: 1px solid #ced4da;
  }
}

.drop-border {
  box-shadow: -1px 1px 0 #007bff, 1px -1px 0 #007bff, -1px -1px 0 #007bff, 1px 1px 0 #007bff;
}
</style>
<!-- STYLE END -->