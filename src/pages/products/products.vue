<template>
  <div>
    <title-bar title="Products" :links="tabLinks" />
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TitleBar, Panel, AppButton } from '@/components';
import api from '@/api';

@Component({
  components: {
    TitleBar,
    Panel,
    AppButton
  }
})
export default class Products extends Vue {
  tabLinks = [
    { label: 'Products', route: 'all-products' },
    { label: 'Product Items', route: 'product-items' }
  ];
}
</script>
