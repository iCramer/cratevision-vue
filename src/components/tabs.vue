<template>
  <ul class="tabs">
    <li v-for="(tab, index) in tabs" :key="index" class="tab-item">
      <app-button
        :className="getActiveClass(tab.tabKey)"
        btnStyle="nav-link"
        v-on:click="handleClick(tab.tabKey)"
        :route="tab.route"
      >
      {{tab.label}}
    </app-button>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class Tabs extends Vue {
  @Prop() tabs: Object[];
  @Prop() activeTab: string;

  getActiveClass(tabKey) {
    if (tabKey !== undefined && this.activeTab === tabKey) {
      return 'router-link-active';
    }
    else {
      return null;
    }
  }

  handleClick(tab) {
    this.$emit('tab-click', tab);
  }
}
</script>
