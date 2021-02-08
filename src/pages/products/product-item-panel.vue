<template>
  <slider-panel :open="open" :withTabs="true" title="Product Item Details" @close="closePanel()" :item="item">
    <tab title="Item Info" tabKey="basic-info">
      <basic-info :item="item"></basic-info>
      <section-title>Product Identifiers</section-title>
      <product-identifier :prodIds="item.productIdentifiers" :id="item.id"></product-identifier>
    </tab>

    <tab title="Inventory" tabKey="inventory">
      <inventory :inventory="item.inventory" :id="item.id"></inventory>
    </tab>

    <tab title="Supplier" tabKey="supplier">
      <supplier :supplier="item.supplier" :id="item.id"></supplier>
    </tab>
  </slider-panel>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SliderPanel, Tab, SectionTitle } from '../../components';
import BasicInfo from './product-items/basic-info.vue';
import ProductIdentifier from './product-items/product-identifier.vue';
import Inventory from './product-items/inventory.vue';
import Supplier from './product-items/supplier.vue';

@Component({
  components: {
    SliderPanel,
    Tab,
    BasicInfo,
    Inventory,
    Supplier,
    ProductIdentifier,
    SectionTitle
  }
})
export default class ProductItemPanel extends Vue {
  @Prop() item: Object;
  @Prop({default: false}) open: boolean;

  closePanel() {
    this.$emit('close');
  }
}
</script>
