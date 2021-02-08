<template>
  <div>
    <title-bar title="Configuration" :links="tabLinks"></title-bar>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TitleBar } from '@/components';

@Component({
  components: {
    TitleBar
  }
})
export default class Configuration extends Vue {
  tabLinks = [
    { label: 'Warehouses', route: 'warehouses' },
    { label: 'Statuses', route: 'statuses' },
    { label: 'Fees', route: 'fees' },
    { label: 'Suppliers', route: 'suppliers' },
  ];
}
</script>
