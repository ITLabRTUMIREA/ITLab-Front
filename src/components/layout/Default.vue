
<template>
  <div class="layout with-sidebar">
    <template v-if="isAuthorized">
      <sidebar />
    </template>
    <template v-if="isAnotherFrontEnd">
      <div class="content-wrapper-another-front">
        <router-view />
      </div>
    </template>
    <template v-else>
      <div class="content-wrapper">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CSidebar from '@/components/layout/Sidebar.vue';

@Component({
  components: {
    sidebar: CSidebar
  }
})
export default class Default extends Vue {
  public isAuthorized: boolean = false;

  public async mounted() {
    this.$userManager.signedIn().then((response) => {
      if (response) {
        this.isAuthorized = true;
      } else {
        this.$userManager.signInSilent().then(async () => {
          this.isAuthorized = await this.$userManager.signedIn();
        });
      }
    });
    // await this.$userManager.signInSilent().then(async () => {
    //   this.isAuthorized = await this.$userManager.signedIn();
    //   console.log(await this.$userManager.signedIn());
    // });

    // if (await this.$userManager.signedIn()) {
    //   debugger;
    //   this.isAuthorized = true;
    // } else {
    //   await this.$userManager.signInSilent().then(async () => {
    //     this.isAuthorized = await this.$userManager.signedIn();
    //     console.log(await this.$userManager.signedIn());
    //   });
    // }
  }
  get isAnotherFrontEnd(): boolean {
    return this.$route.meta.isAnotherFrontEnd;
  }
}
</script>