<template>
  <div>
    <title-bar title="Product Orders" btnBackLabel="Product Order History" routeBack="/product-orders"></title-bar>
    <div class="container-fluid">
      <div class="row">
        <error-banner v-model="errorList" />
        <div class="col-md-5">
          <panel title="Order Information">
            <form>
              <validation-observer ref="newOrder">
                <div class="row">
                  <div class="col">
                    <input-validate name="orderId" label="Order ID" rules="required" v-model.trim="newProductOrder.internalId" />
                  </div>
                  <div class="col">
                    <date-picker label="Delivery Date" v-model="newProductOrder.deliveredOn" />
                  </div>
                </div>
              </validation-observer>
              <div class="row">
                <div class="col-md-12">
                  <fee-input v-model="newProductOrder.fees" @edit-click="showFeeModal = true" />
                </div>
                <div class="col-md-6">
                  <status-select v-model="newProductOrder.status" />
                </div>
              </div>
              <h5>Product Quantities</h5>
              <app-table :columns="productColumns" :records="products">
                <counter slot="count" slot-scope="{record}" :value="getCount(record)" @input="(val) => changeCount(val, record)"></counter>
                <app-button slot="name" slot-scope="{record}" size="xs" :linkBtn="true" @click="openDetails(record)">{{record.name}}</app-button>
                <badge v-if="record.status" slot="status" slot-scope="{record}" badgeType="outline">{{record.status.name}}</badge>
              </app-table>
            </form>
            <pagination :totalRecords="products.length" @change="changePage" />
          </panel>
        </div>
        <div class="col-md-7">
          <panel title="Order Summary">
            <no-results v-if="!newProductOrder.productQuantities || !newProductOrder.productQuantities.length" header="No Products Included" body="Select product quantities from the products table to begin order" :icon="['far', 'truck-loading']"></no-results>
            <div v-else>
              <product-order-summary :order="newProductOrder" />
              <button-group align="center">
                <app-button :linkBtn="true" @click="clearForm">Cancel</app-button>
                <app-button btnType="submit" @click="submitForm">Submit</app-button>
              </button-group>
            </div>
          </panel>
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
              <list-group-item v-for="fee in selectedProduct.fees" color="yellow" icon="receipt">
                {{fee.name}}<badge>{{fee.amount | fee(fee.type)}}</badge>
              </list-group-item>
            </list-group>
          </tab>
          <tab title="Product Items" tabKey="prod-items">
            <list-group>
              <list-group-item v-for="item in selectedProduct.productItemQuantities" :icon="['fal', 'barcode-read']">
                {{item.productItem.name}}<badge badgeStyle="info">{{item.count}}</badge>
              </list-group-item>
            </list-group>
          </tab>
        </slider-panel>
        <modal title="Edit Fees" :open="showFeeModal">
          <fee-editor />
          <button-group>
            <app-button @click="showFeeModal = false">Done</app-button>
          </button-group>
        </modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Panel,
  AppTable,
  AppButton,
  ButtonGroup,
  InputField,
  InputValidate,
  SelectBox,
  Counter,
  ListGroup,
  ListGroupItem,
  Badge,
  SliderPanel,
  Tab,
  Accordion,
  AccordionItem,
  NoResults,
  ErrorBanner,
  FeeInput,
  FeeEditor,
  Modal,
  DataImage,
  StatusSelect,
  SectionTitle,
  Pagination,
  TitleBar,
  DatePicker
} from '@/components';
import api from '@/api';
import { IProduct, IProductOrder, IFee, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import ProductOrderSummary from './product-order-summary.vue';
import deepCopy from '@/utils';

@Component({
  components: {
    Panel,
    AppTable,
    AppButton,
    ButtonGroup,
    InputField,
    InputValidate,
    SelectBox,
    Counter,
    ListGroup,
    ListGroupItem,
    Badge,
    SliderPanel,
    Tab,
    Accordion,
    AccordionItem,
    NoResults,
    ErrorBanner,
    FeeInput,
    FeeEditor,
    Modal,
    ValidationObserver,
    DataImage,
    StatusSelect,
    SectionTitle,
    ProductOrderSummary,
    Pagination,
    TitleBar,
    DatePicker
  }
})
export default class NewProductOrder extends Vue {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  newProductOrder: IProductOrder = { fees: [], productQuantities: [] };
  showFeeModal = false;
  selectedProduct: IProduct = {};
  showProdDetails = false;
  productColumns = [
    { label: 'Quantity', slotName: 'count' },
    { label: 'Name', slotName: 'name' },
    { label: 'MSRP', selector: 'msrp' },
    { label: 'Status', slotName: 'status' }
  ];
  errorList: string[] = [];

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

  findCountObj(id) {
    let prodQty = this.newProductOrder.productQuantities;
    return prodQty.find(item => item.product.id === id);
  }

  getCount(item) {
    let countItem = this.findCountObj(item.id);
    return countItem ? countItem.count : 0;
  }

  changeCount(val, item) {
    let countItem = this.findCountObj(item.id);
    let prodQty = this.newProductOrder.productQuantities;
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

  changePage(range) {
    let products = deepCopy(this.products);
    this.filteredProducts = products.splice(range.start, range.end);
  }

  openDetails(product) {
    this.selectedProduct = product;
    this.showProdDetails = true;
  }

  closeDetails(product) {
    this.selectedProduct = {};
    this.showProdDetails = false;
  }

  clearForm() {
    this.newProductOrder = { productQuantities: [] };
  }

  submitForm() {
    (this.$refs.newOrder as VForm).validate().then( valid => {
      if(valid) {
        api.post('productorder/', this.newProductOrder).then(resp => {
          this.$toast.success('New product order created');
          this.clearForm();
        }).catch(error => {
          this.errorList.push(error.response.data.message);
        });
      }
      (this.$refs.newOrder as VForm).reset();
    });
  }
}
</script>
