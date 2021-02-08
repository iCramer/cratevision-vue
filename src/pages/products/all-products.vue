<template>
  <div id="all-products">
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" route="/products/new-product">New Product</app-button>
    </div>
    <panel>
      <app-table :columns="columns" :records="filteredProducts">
        <div
          v-if="record.images && record.images.length"
          v-tooltip.right="{ ref: `productImage${record.id}` }"
          slot="image"
          slot-scope="{record}"
        >
          <div :ref="`productImage${record.id}`">
            <data-image :fileName="record.images[0].name" />
          </div>
          <data-image :fileName="record.images[0].name" />
        </div>
        <app-button
        slot="name"
        slot-scope="{record}"
        btnStyle="info-link"
        size="xs"
        :route="`/products/${record.id}/product-info`"
        >
        {{record.name}}
      </app-button>
      <span slot="inventory" slot-scope="{record}" v-tooltip.top="{ ref: `inventory${record.id}` }">
        <badge>{{ countInventory(record.inventory, 'available') }}</badge>
        <div :ref="`inventory${record.id}`" class="tooltip-content inventory-tooltip">
          <span>On Hand: <span>{{ countInventory(record.inventory, 'onhand') }}</span></span>
          <span>Reserved: <span>{{ countInventory(record.inventory, 'reserved') }}</span></span>
        </div>
      </span>
      <span slot="prodId" slot-scope="{record}">
        <span v-for="(item, index) in record.productIdentifiers">
          {{ item.name }}<span v-if="index !== record.productIdentifiers.length - 1">, </span>
        </span>
      </span>
      <badge v-if="record.status" slot="status" slot-scope="{record}" badgeStyle="success" badgeType="outline">{{ record.status.name }}</badge>
      <span slot="actions" slot-scope="{ record }">
        <app-button btnStyle="link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
      </span>
    </app-table>
    <pagination :totalRecords="products.length" @change="changePage" />
  </panel>
  <confirmation-modal v-if="deleteObj" @cancel="showConfirmModal = false" @confirm="deleteProduct" :open="showConfirmModal">
    Are you sure you want to delete {{ deleteObj.name }}?
  </confirmation-modal>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, AppTable, TitleBar, AppButton, ErrorBanner, DataImage, Pagination, Badge } from '@/components';
import { ConfirmationModal } from '@/patterns';
import api from '@/api';
import { IProduct } from '@/interfaces';
import deepCopy from '@/utils';

@Component({
  components: {
    Panel,
    AppTable,
    TitleBar,
    AppButton,
    ErrorBanner,
    DataImage,
    ConfirmationModal,
    Pagination,
    Badge
  }
})
export default class AllProducts extends Vue {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  columns = [
    { label: 'Picture', slotName: 'image', class: 'img-thumbnail' },
    { label: 'Name', slotName: 'name' },
    { label: 'MSRP', selector: 'msrp', filter: 'currency' },
    { label: 'Inventory', slotName: 'inventory' },
    { label: 'Product Identifiers', slotName: 'prodId' },
    { label: 'Status', slotName: 'status' },
    { label: 'Last Updated', selector: 'updatedOn', filter: 'date' },
    { label: 'Actions', slotName: 'actions' }
  ];
  errorList: string[] = [];
  showConfirmModal: boolean = false;
  deleteObj: IProduct = {};

  created() {
    this.getProducts();
  }

  getProducts() {
    api.get('product/all').then(resp => {
      this.products = resp.data;
      this.filteredProducts = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  countInventory(inventory, field) {
    let count = 0;
    inventory.forEach(item => {
      count += item[field];
    });

    return count;
  }

  changePage(range) {
    let products = deepCopy(this.products);
    if(products) {
      this.filteredProducts = products.splice(range.start, range.end);
    }
  }

  showConfirm(obj) {
    this.deleteObj = obj;
    this.showConfirmModal = true;
  }

  deleteProduct() {
    api.delete('product/' + this.deleteObj.id).then(resp => {
      this.$toast.success('Deleted ' + this.deleteObj.name);
      this.getProducts();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });

    this.showConfirmModal = false;
  }

}
</script>
