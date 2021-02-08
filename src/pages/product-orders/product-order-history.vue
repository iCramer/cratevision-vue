<template>
  <div>
    <title-bar title="Product Orders" />
    <div class="container-fluid">
      <div class="toolbar">
        <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" route="/product-orders/new-product-order">New Product Order</app-button>
      </div>
      <panel>
        <app-table :columns="columns" :records="filteredOrders">
          <app-button slot="id" slot-scope="{record}" btnStyle="info-link" size="xs" :route="'/product-orders/' + record.id">{{ record.internalId }}</app-button>
          <badge slot="status" slot-scope="{record}" v-if="record.status" badgeType="outline" badgeStyle="success">{{ record.status.name }}</badge>
          <span slot="total" slot-scope="{record}">{{ getProductCount(record.productQuantities) }}</span>
          <span slot="actions" slot-scope="{record}">
            <app-button btnStyle="info-link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
          </span>
        </app-table>
        <pagination :totalRecords="orders.length" @change="changePage" />
      </panel>
      <confirmation-modal v-if="deleteObj" @cancel="showConfirmModal = false" @confirm="deleteOrder" :open="showConfirmModal">
        Are you sure you want to delete {{ deleteObj.internalId }}?
      </confirmation-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, AppTable, AppButton, ErrorBanner, Badge, Pagination, TitleBar } from '@/components';
import { ConfirmationModal } from '@/patterns';
import api from '@/api';
import { IProductOrder, IProductQuantity } from '@/interfaces';
import deepCopy from '@/utils';

@Component({
  components: {
    Panel,
    AppTable,
    AppButton,
    ErrorBanner,
    ConfirmationModal,
    Badge,
    Pagination,
    TitleBar
  }
})
export default class ProductOrderHistory extends Vue {
  orders: IProductOrder[] = [];
  filteredOrders: IProductOrder[] = [];
  columns = [
    { label: 'Id', slotName: 'id' },
    { label: 'Delivery Date', selector: 'deliveredOn', filter: 'date' },
    { label: 'Status', slotName: 'status' },
    { label: 'Total Products', slotName: 'total' },
    { label: 'Last Updated', selector: 'updatedOn', filter: 'date' },
    { label: 'Actions', slotName: 'actions' }
  ];
  errorList: string[] = [];
  showConfirmModal = false;
  deleteObj: IProductOrder = {};

  created() {
    this.getOrders();
  }

  getOrders() {
    api.get('productorder/all').then(resp => {
      this.orders = resp.data;
      this.filteredOrders = resp.data;
    })
    .catch(error => {
      this.errorList.push(error);
    });
  }

  getProductCount(prodQty: IProductQuantity[]) {
    let total = 0;
    prodQty.forEach( item => total += item.count);
    return total;
  }

  changePage(range) {
    let orders = deepCopy(this.orders);
    this.filteredOrders = orders.splice(range.start, range.end);
  }

  showConfirm(obj) {
    this.deleteObj = obj;
    this.showConfirmModal = true;
  }

  deleteOrder() {
    api.delete('productorder/' + this.deleteObj.id).then(resp => {
      this.$toast.success('Product Order Deleted');
      this.getOrders();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });

    this.showConfirmModal = false;
  }
}
</script>
