<template>
  <div>
    <title-bar title="Product Order Details" btnBackLabel="Product Order History" routeBack="/product-orders" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-5">
          <panel title="Order Summary">
            <app-button slot="utility" btnStyle="link" size="xs" icon="edit" @click="openEditModal"></app-button>
            <list-group>
              <list-group-item icon="address-card">
                Internal Id <span>{{ order.internalId }}</span>
              </list-group-item>
              <list-group-item :icon="['far', 'calendar']">
                Delivery Date <span>{{ order.deliveredOn }}</span>
              </list-group-item>
              <list-group-item icon="ellipsis-h">
                Status <badge badgeType="outline" badgeStyle="success" v-if="order.status">{{ order.status.name }}</badge>
              </list-group-item>
            </list-group>
            <section-title>Fees</section-title>
            <no-results v-if="!order.fees || !order.fees.length" header="No Fees Assigned" btnLabel="Add Fee"></no-results>
            <list-group :iconList="true" v-if="order.fees && order.fees.length">
              <list-group-item v-for="(fee, index) in order.fees" icon="receipt" color="yellow" :key="index">
                {{fee.name}} <span>{{fee.amount | fee(fee.type)}}</span>
              </list-group-item>
            </list-group>
          </panel>
          <panel title="Product Quantities">
            <app-button v-if="!editProdQty" slot="utility" btnStyle="link" size="xs" icon="edit" @click="editProdQty = true"></app-button>
            <div v-else slot="utility">
              <app-button v-if="editProdQty" :linkBtn="true" @click="cancelProdEdit">Cancel</app-button>
              <app-button v-if="editProdQty" @click="submitEdit">Save</app-button>
            </div>
            <app-table :columns="productColumns">
              <tr v-for="(record, index) in products" :key="`row-${index}`" v-if="getCount(record) > 0 || editProdQty">
                <td>
                  <counter v-if="editProdQty" :value="getCount(record)" @input="(val) => changeCount(val, record)"></counter>
                  <badge v-else badgeStyle="info">{{ getCount(record) }}</badge>
                </td>
                <td>
                  <app-button size="xs" btnStyle="link" @click="openDetails(record)">{{record.name}}</app-button>
                </td>
                <td>{{ record.msrp }}</td>
                <td>{{ record.status && record.status.name }}</td>
              </tr>
            </app-table>
          </panel>
        </div>
        <div class="col-md-7">
          <panel title="Order Summary">
            <no-results v-if="!order.productQuantities || !order.productQuantities.length" header="No Products Included" body="Select product quantities from the products table to begin order" :icon="['far', 'truck-loading']"></no-results>
            <div v-else>
              <product-order-summary :order="order" />
            </div>
          </panel>
        </div>
      </div>
    </div>

    <slider-panel title="Product Details" :withTabs="true" @close="closeDetails" :open="showProdDetails">
      <tab title="Product Info" tabKey="prod-info">
        <data-image v-if="selectedProduct.images && selectedProduct.images.length" :fileName="selectedProduct.images[0].name" />
        <list-group title="Basic Info">
          <list-group-item icon="address-card">
            Name<span>{{selectedProduct.name}}</span>
          </list-group-item>
          <list-group-item icon="tag">
            MSRP<badge>{{selectedProduct.msrp}}</badge>
          </list-group-item>
          <list-group-item icon="ellipsis-h">
            Status<badge badgeType="outline" v-if="selectedProduct.status">{{selectedProduct.status.name}}</badge>
          </list-group-item>
        </list-group>
        <list-group title="Fees">
          <list-group-item v-for="fee in selectedProduct.fees" color="yellow" icon="receipt" :key="`fee-${fee.id}`">
            {{fee.name}}<badge>{{fee.amount | fee(fee.type)}}</badge>
          </list-group-item>
        </list-group>
      </tab>
      <tab title="Product Items" tabKey="prod-items">
        <list-group>
          <list-group-item v-for="item in selectedProduct.productItemQuantities" :icon="['fal', 'barcode-read']" :key="`prodQty-${item.id}`">
            {{item.productItem.name}}<badge badgeStyle="info">{{item.count}}</badge>
          </list-group-item>
        </list-group>
      </tab>
    </slider-panel>

    <modal title="Fees" :open="showEditModal">
      <form v-if="!editFeeOptions" @submit.prevent="submitEdit">
        <div class="row">
          <div class="col-md-6">
            <input-validate name="orderId" label="Order ID" rules="required" v-model="editOrder.internalId" />
          </div>
          <div class="col-md-6">
            <date-picker label="Delivery Date" v-model="editOrder.deliveredOn" />
          </div>
          <div class="col-md-6">
            <status-select v-model="editOrder.status" />
          </div>
          <div class="col-md-12">
            <fee-input v-model="editOrder.fees" @edit-click="editFeeOptions = true"  />
          </div>
        </div>
        <button-group>
          <app-button :linkBtn="true" @click="closeEditModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </button-group>
      </form>
      <fee-editor v-else @back-click="editFeeOptions = false" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Panel,
  AppTable,
  AppButton,
  ErrorBanner,
  TitleBar,
  ListGroup,
  ListGroupItem,
  Modal,
  FeeInput,
  FeeEditor,
  SectionTitle,
  ButtonGroup,
  Badge,
  NoResults,
  Accordion,
  AccordionItem,
  Counter,
  SliderPanel,
  Tab,
  DataImage,
  InputField,
  InputValidate,
  StatusSelect,
  DatePicker
} from '@/components';
import { ConfirmationModal } from '@/patterns';
import api from '@/api';
import { IProductOrder, IFee, IProduct } from '@/interfaces';
import ProductOrderSummary from './product-order-summary.vue';

@Component({
  components: {
    Panel,
    AppTable,
    AppButton,
    ErrorBanner,
    ConfirmationModal,
    TitleBar,
    ListGroup,
    ListGroupItem,
    Modal,
    FeeInput,
    FeeEditor,
    SectionTitle,
    ButtonGroup,
    NoResults,
    Accordion,
    AccordionItem,
    Badge,
    Counter,
    SliderPanel,
    Tab,
    DataImage,
    InputField,
    InputValidate,
    StatusSelect,
    ProductOrderSummary,
    DatePicker
  }
})
export default class ProductOrderDetails extends Vue {
  order: IProductOrder = {};
  errorList: string[] = [];
  showConfirmModal = false;
  editOrder: IProductOrder = {};
  showEditModal = false;
  editFeeOptions = false;
  selectedProduct: IProduct = {};
  showProdDetails = false;
  productColumns = [
    { label: 'Quantity', slotName: 'count' },
    { label: 'Name', slotName: 'name' },
    { label: 'MSRP', selector: 'msrp' },
    { label: 'Status', slotName: 'status' }
  ];
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  editProdQty = false;

  created() {
    this.getOrder();
    this.getProducts();
  }

  getOrder() {
    const id = this.$route.params.id;
    api.get('productorder/' + id).then(resp => {
      this.order = resp.data;
    })
    .catch(error => {
        this.errorList.push(error);
    });
  }

  getProducts() {
    api.get('product/all').then(resp => {
      this.products = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  findCountObj(id) {
    let prodQty = this.order.productQuantities;
    return prodQty.find(item => item.product.id === id);
  }

  getCount(item) {
    let countItem = this.findCountObj(item.id);
    return countItem ? countItem.count : 0;
  }

  changeCount(val, item) {
    let countItem = this.findCountObj(item.id);
    let prodQty = this.order.productQuantities;
    let count = val !== '' ? parseInt(val) : 0;
    if (countItem) {
      if (count === 0) {
        let index = prodQty.findIndex(obj => obj.product.id === item.id);
        prodQty.splice(index, 1);
      }
      else {
        countItem.count = count;
      }
    }
    else {
      prodQty.push({ count: count, product: item });
    }
  }

  cancelProdEdit() {
    this.editProdQty = false;
    this.getOrder();
  }

  openDetails(product) {
    this.selectedProduct = product;
    this.showProdDetails = true;
  }

  closeDetails(product) {
    this.selectedProduct = {};
    this.showProdDetails = false;
  }

  openEditModal() {
    this.editOrder = this.order;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  submitEdit() {
    api.put('productorder/' + this.order.id, this.order).then(resp => {
      this.getOrder();
      this.$toast.success('Product Order updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeEditModal();
  }

  showConfirm() {
    this.showConfirmModal = true;
  }

  deleteOrder() {
    api.delete('productorder/' + this.order.id).then(resp => {
      this.$toast.success('Product Order Deleted');
      this.getOrder();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });

    this.showConfirmModal = false;
  }
}
</script>
