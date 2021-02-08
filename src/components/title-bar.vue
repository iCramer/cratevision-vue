<template>
  <div class="title-bar container-fluid" v-bind:class="{'title-bar-nav': links}">
    <div class="left-content">
      <app-button v-if="routeBack" class="title-back-btn" size="xs" btnStyle="info-link" icon="chevron-left" :route="routeBack">{{ btnBackLabel }}</app-button>
      <h1 class="title">{{title}}</h1>
      <tabs :tabs="links"></tabs>
    </div>
    <div class="right-content">
      <slot name="contentRight"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Tabs from './tabs.vue';
import AppButton from './button.vue';

@Component({
  components: {
    Tabs,
    AppButton
  }
})
export default class TitleBar extends Vue {
  @Prop() title: string;
  @Prop() links: Object[];
  @Prop() routeBack: string;
  @Prop() btnBackLabel: string;
}

</script>
