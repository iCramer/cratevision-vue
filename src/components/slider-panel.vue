<template>
  <section v-bind:class="['slider-panel', { 'open': open, 'slider-panel-nav': tabs && tabs.length }]">
    <header class="slider-panel-header">
      <h5 class="slider-panel-title">{{title}}</h5>
      <app-button class="slider-panel-close" size="sm" :linkBtn="true" @click="closePanel()" icon="times"></app-button>
      <tabs v-if="tabs && tabs.length" :tabs="tabs" :activeTab="activeKey" v-on:tab-click="tabClick"></tabs>
    </header>
    <div class="slider-panel-body">
      <slot></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AppButton, Tabs } from '../components';

@Component({
  components: { AppButton, Tabs }
})
export default class SliderPanel extends Vue {
  @Prop() title: string;
  @Prop({default: false}) open: boolean;
  @Prop({default: false}) withTabs: boolean;
  tabs: Object[] = [];
  activeTab: Object;
  activeKey: string = '';

  tabClick(tabKey) {
    let tab = this.$children.find(child => child['tabKey'] === tabKey);
    this.setActiveTab(tab);
  }

  renderTabs() {
    let tabs = [];
    let activeTab;
    let children = this.$children;

    children.forEach( child => {
      if (child['tabKey']) {
        tabs.push({label: child['title'], tabKey: child['tabKey']});
        if (child['active']) {
          activeTab = child;
        }
      }
    });
    if (!activeTab) {
      const tabKey = tabs[0].tabKey;
      activeTab = children.find(child => child['tabKey'] === tabKey);
    }
    this.setActiveTab(activeTab);
    this.tabs = tabs;
  }

  setActiveTab(tab) {
    if(this.activeTab){
      this.activeTab['active'] = false;
    }
    tab.active = true;
    this.activeTab = tab;
    this.activeKey = tab['tabKey'];
  }

  mounted() {
    if (this.withTabs) {
      this.renderTabs();
    }
  }

  closePanel() {
    this.$emit('close');
  }
}
</script>
