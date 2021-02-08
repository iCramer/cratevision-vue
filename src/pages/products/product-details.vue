<template>
  <div>
    <title-bar title="Product Details" btnBackLabel="All Products" routeBack="/products/all-products"></title-bar>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TitleBar, AppButton } from '@/components';
import { EventBus } from '@/main';

@Component({
  components: {
    TitleBar,
    AppButton
  }
})
export default class Products extends Vue {

}
</script>
