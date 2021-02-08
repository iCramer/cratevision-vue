<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" @click="openModal">New Product Item</app-button>
      <!-- <app-button class="btn-push-right" btnStyle="link" icon="cloud-upload" @click="openModal">Import CSV</app-button> -->
      <file-import></file-import>
    </div>
    <panel>
      <app-table :records="filteredProductItems" :columns="columns">
        <div
          v-if="record.picture"
          v-tooltip.right="{ ref: `productImage${record.id}` }"
          slot="image"
          slot-scope="{record}"
        >
          <div :ref="`productImage${record.id}`">
            <data-image :fileName="record.picture.name" />
          </div>
          <data-image :fileName="record.picture.name" />
        </div>
        <app-button slot="name" slot-scope="{record}" size="xs" :linkBtn="true" @click="openDetails(record)">{{record.name}}</app-button>
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
        <span slot="actions" slot-scope="{ record }">
          <app-button btnStyle="link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
        </span>
      </app-table>
      <pagination :totalRecords="productItems.length" @change="changePage" />
    </panel>
    <confirmation-modal v-if="deleteObj" @cancel="showConfirmModal = false" @confirm="deleteProductItem" :open="showConfirmModal">
      Are you sure you want to delete {{ deleteObj.name }}?
    </confirmation-modal>
    <product-item-panel :open="showDetails" @close="closeDetails()" :item="selectedItem" />
    <modal size="lg" title="New Product Item" :open="showModal">
      <new-product-item @cancel="closeModal" @submit="saveNewItem" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, ListGroup, ListGroupItem, AppTable, Badge, AppButton, Modal, ErrorBanner, DataImage, Pagination, FileImport } from '@/components';
import ProductItemPanel from './product-item-panel.vue';
import NewProductItem from './product-items/new-product-item.vue';
import api from '@/api';
import deepCopy from '@/utils';
import { IProduct, IProductItem, IProductItemQuantity } from '@/interfaces';
import { ConfirmationModal } from '@/patterns';

@Component({
  components: {
    Panel,
    ListGroup,
    ListGroupItem,
    AppTable,
    AppButton,
    Badge,
    ProductItemPanel,
    Modal,
    NewProductItem,
    ErrorBanner,
    DataImage,
    Pagination,
    ConfirmationModal,
    FileImport
  }
})
export default class ProductItems extends Vue {
  productItems: IProductItem[] = [];
  filteredProductItems: IProductItem[] = [];
  selectedItem = {};
  showDetails = false;
  showModal = false;
  columns = [
    { label: 'Picture', slotName: 'image', class: 'img-thumbnail' },
    { label: 'Name', slotName: 'name' },
    { label: 'Case Quantity', selector: 'caseQty' },
    { label: 'Case Cost', selector: 'caseCost', filter: 'currency' },
    { label: 'Item Cost', selector: 'itemCost', filter: 'currency' },
    { label: 'Supplier', selector: 'supplier.name' },
    { label: 'Inventory', slotName: 'inventory' },
    { label: 'Product Identifiers', slotName: 'prodId' },
    { label: 'Last Updated', selector: 'updatedOn', filter: 'date' },
    { label: 'Actions', slotName: 'actions' }
  ];
  errorList: string[] = [];
  showConfirmModal: boolean = false;
  deleteObj: IProduct = {};

  created() {
    this.getProductItems();
  }

  getProductItems() {
    api.get('productitem/all').then(resp => {
      this.productItems = resp.data;
      this.filteredProductItems = resp.data;
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  openDetails(obj) {
    this.showDetails = true;
    this.selectedItem = obj;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedItem = {};
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveNewItem(value) {
    api.post('productitem/', value).then(resp => {
      this.getProductItems();
      this.$toast.success('Product Item Created');
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  countInventory(inventory, field) {
    let count = 0;
    inventory.forEach(item => {
      let test = "this";
      count += item[field];
    });

    return count;
  }

  changePage(range) {
    let productItems = deepCopy(this.productItems);
    if(productItems) {
      this.filteredProductItems = productItems.splice(range.start, range.end);
    }
  }

  showConfirm(obj) {
    this.deleteObj = obj;
    this.showConfirmModal = true;
  }

  deleteProductItem() {
    api.delete('productitem/' + this.deleteObj.id).then(resp => {
      this.$toast.success('Deleted ' + this.deleteObj.name);
      this.getProductItems();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });

    this.showConfirmModal = false;
  }
}
</script>
