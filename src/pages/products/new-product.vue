<template>
  <div>
    <title-bar title="New Product" btnBackLabel="All Products" routeBack="/products/all-products" />
    <div class="container-fluid">
      <error-banner v-model="errorList" />
      <div class="row">
        <div class="col-md-7">
          <panel title="Product Information">
            <validation-observer ref="newProduct">
              <div class="row">
                <div class="col-md-7">
                  <input-validate name="name" label="Name" rules="required" v-model.trim="newProduct.name" />
                </div>
                <div class="col-md-5">
                  <input-validate name="msrp" label="MSRP" inputType="number" step=".01" v-model.number="newProduct.msrp" rules="required" />
                </div>
                <div class="col-md-6">
                  <select-box name="status" label="Status" v-model="newProduct.status" :options="statusOptions"></select-box>
                </div>
              </div>
            </validation-observer>
          </panel>
          <transition name="expand">
            <panel title="Product Items">
              <app-button slot="utility" :linkBtn="true" icon="plus-circle" @click="openModal">New Product Item</app-button>
              <app-table :columns="columns" :records="filteredProdItems">
                <counter slot="count" slot-scope="{record}" :value="getCount(record)" @input="(val) => changeCount(val, record)"></counter>
                <app-button slot="name" slot-scope="{record}" size="xs" btnStyle="link" @click="openDetails(record)">{{record.name}}</app-button>
              </app-table>
              <pagination :totalRecords="productItems.length" @change="changePage" />
            </panel>
          </transition>
          <panel title="Product Identifiers">
            <div v-for="(item, index) in newProduct.productIdentifiers">
              <section-title :showBtn="index !== 0" btnIcon="trash-alt" sectionType="form" @util-click="removeProdId(index)" :class="{'mt-4': index !== 0}">Product Identifier  #{{index + 1}}</section-title>
              <product-identifier-form v-model="newProduct.productIdentifiers[index]" />
            </div>
            <app-button btnStyle="info-link" size="xs" icon="plus-circle" @click="addProdId">Add Identifier</app-button>
          </panel>
          <panel title="Fees">
            <fee-input v-model="newProduct.fees" @edit-click="showFeeModal = true" />
          </panel>
          <panel title="Images">
            <file-uploader v-model="newProduct.images" />
          </panel>
          <panel title="Inventory">
            <div v-for="(item, index) in newProduct.inventory">
              <section-title :showBtn="index !== 0" btnIcon="trash-alt" sectionType="form" :class="{'mt-4': index !== 0}" @util-click="removeInventory(index)">Inventory  #{{index + 1}}</section-title>
              <inventory-form v-model="newProduct.inventory[index]" @edit-click="showWarehouseModal = true" />
            </div>
            <app-button btnStyle="info-link" size="xs" icon="plus-circle" @click="addInventory">Add Inventory</app-button>
          </panel>
        </div>
        <div class="col-md-5">
          <panel title="Product Summary">
            <doughnut-chart v-if="chartData.datasets && chartData.datasets.length" :innerText="summaryData.msrp" :height="220" :chartData="chartData" :options="chartOptions" />
            <no-results v-else icon="chart-pie" />
            <div v-if="hasInfo()">
              <transition name="expand">
                <list-group v-if="summaryData" :iconList="false" title="Cost Breakdown">
                  <list-group-item>
                    MSRP <badge>{{summaryData.msrp | currency}}</badge>
                  </list-group-item>
                  <list-group-item>
                    Fees <badge>{{summaryData.fees | currency}}</badge>
                  </list-group-item>
                  <list-group-item v-show="summaryData.prodItemsCost">
                    Product Cost <badge>{{summaryData.prodItemsCost | currency}}</badge>
                  </list-group-item>
                  <list-group-item>
                    Profit <badge badgeStyle="success">{{summaryData.profit | currency}}</badge>
                  </list-group-item>
                </list-group>
              </transition>
              <transition name="expand">
                <list-group>
                  <list-group-item v-if="newProduct.name" icon="address-card"><span>Name</span> {{newProduct.name}}</list-group-item>
                  <list-group-item v-if="newProduct.status && newProduct.status.name" icon="ellipsis-h"><span>Status</span> <badge badgeType="outline">{{newProduct.status.name}}</badge></list-group-item>
                </list-group>
              </transition>
              <transition name="expand">
                <list-group title="Product Items" v-if="newProduct.productItemQuantities.length" :iconList="false">
                  <list-group-item v-for="(item, index) in newProduct.productItemQuantities" :key="'item-' + index">
                    {{item.productItem.name}} <badge badgeStyle="info">{{item.count}}</badge>
                  </list-group-item>
                </list-group>
              </transition>
              <transition name="expand">
                <list-group title="Fees" v-if="newProduct.fees.length" :iconList="false">
                  <list-group-item v-for="(fee, index) in newProduct.fees" :key="'fee-' + index">
                    {{fee.name}} <badge badgeStyle="info">{{ fee.amount | fee(fee.type) }}</badge>
                  </list-group-item>
                </list-group>
              </transition>
              <transition name="expand">
                <list-group title="Images" v-if="newProduct.images && newProduct.images.length" :iconList="false">
                  <list-group-item v-for="(image, index) in newProduct.images" :key="'image-' + index">
                    {{image.name}} <app-button size="xs" :linkBtn="true" @click="removeImage(image)" icon="trash-alt" />
                  </list-group-item>
                </list-group>
              </transition>
              <button-group align="center">
                <app-button :linkBtn="true" @click="clearForm">Cancel</app-button>
                <app-button btnType="submit" @click="submitForm">Submit</app-button>
              </button-group>
            </div>
          </panel>
        </div>
      </div>
      <product-item-panel @close="closeDetails" :open="showProdDetails" :item="selectedProdItem" />
    </div>
    <modal size="lg" title="New Product Item" :open="showModal">
      <new-product-item @cancel="closeModal" @submit="saveNewItem" />
    </modal>
    <modal title="Edit Fees" :open="showFeeModal">
      <fee-editor />
      <button-group>
        <app-button @click="showFeeModal = false">Done</app-button>
      </button-group>
    </modal>
    <modal title="Images" :open="showImageModal">
      <file-uploader v-model="newProduct.images" />
      <button-group>
        <app-button @click="showImageModal = false">Done</app-button>
      </button-group>
    </modal>
    <modal title="Warehouses" :open="showWarehouseModal">
      <warehouse-editor />
      <button-group>
        <app-button @click="showWarehouseModal = false">Done</app-button>
      </button-group>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  Panel,
  AppTable,
  AppButton,
  ButtonGroup,
  TitleBar,
  InputField,
  InputValidate,
  Radio,
  SelectBox,
  Counter,
  ListGroup,
  ListGroupItem,
  Badge,
  Tab,
  NoResults,
  FileUploader,
  Dropdown,
  FeeEditor,
  FeeInput,
  Modal,
  ErrorBanner,
  Toggle,
  Pagination,
  SectionTitle
} from '@/components';
import { ValidationObserver } from 'vee-validate';
import api from '@/api';
import { IProduct, IProductItem, IFee, VForm, IProductIdentifier } from '@/interfaces';
import { DoughnutChart } from '@/charts';
import ProductItemPanel from './product-item-panel.vue';
import NewProductItem from './product-items/new-product-item.vue';
import deepCopy from '@/utils';
import InventoryForm from '@/pages/products/product-items/inventory-form.vue';
import ProductIdentifierForm from '@/pages/products/product-items/product-identifier-form.vue';
import { WarehouseEditor } from '@/patterns';

@Component({
  components: {
    Panel,
    AppTable,
    AppButton,
    ButtonGroup,
    TitleBar,
    InputField,
    InputValidate,
    Radio,
    SelectBox,
    Counter,
    ListGroup,
    ListGroupItem,
    Badge,
    ProductItemPanel,
    Tab,
    NoResults,
    DoughnutChart,
    FileUploader,
    Dropdown,
    FeeEditor,
    FeeInput,
    NewProductItem,
    Modal,
    ValidationObserver,
    ErrorBanner,
    Toggle,
    Pagination,
    SectionTitle,
    InventoryForm,
    ProductIdentifierForm,
    WarehouseEditor
  }
})
export default class NewProduct extends Vue {
  productItems: IProductItem[] = [];
  filteredProdItems: IProductItem[] = [];
  newProduct: IProduct = {
    productItemQuantities: [],
    images: [],
    fees: [],
    inventory: [{}],
    productIdentifiers: [{}]
  };
  statusOptions = [];
  selectedProdItem: IProduct = {};
  showProdDetails = false;
  columns = [
    { label: 'Quantity', slotName: 'count' },
    { label: 'Name', slotName: 'name' },
    { label: 'Case Quantity', selector: 'caseQty' },
    { label: 'Case Cost', selector: 'caseCost' },
    { label: 'Item Cost', selector: 'itemCost' },
    { label: 'Supplier', selector: 'supplier.name' }
  ];
  chartData: any = {};
  summaryData: any = {};
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: { position: 'bottom', labels: { boxWidth: 15, fontSize: 14, fontColor: '#444'}}
  };
  showModal = false;
  showFeeModal = false;
  showImageModal = false;
  showWarehouseModal = false;
  errorList: string[] = [];

  created() {
    this.getProductItems();
    this.getStatuses();
  }

  @Watch('newProduct', {deep: true})
  updateCost() {
    this.calculateCost();
  }

  hasInfo() {
    const product = this.newProduct;
    return product.name || product.productItemQuantities.length || product.fees.length || product.images.length;
  }

  getProductItems() {
    api.get('productitem/all').then(resp => {
      this.productItems = resp.data;
      this.filteredProdItems = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  changePage(range) {
    let prodItems = deepCopy(this.productItems);
    if(prodItems) {
      this.filteredProdItems = prodItems.splice(range.start, range.end);
    }
  }

  getStatuses() {
    api.get('status/all').then(resp => {
      this.statusOptions = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  hasCost() {
    let product = this.newProduct;
    return product.msrp || product.fees.length || product.productItemQuantities.length;
  }

  calculateCost() {
    let product = this.newProduct;
    if(!this.hasCost()) {
      return;
    }

    let fees = 0;
    this.newProduct.fees.length && this.newProduct.fees.forEach( fee => {
      fees += fee.amount;
    });

    let cost: number;
    let prodItemsCost = undefined;
      prodItemsCost = 0;
      product.productItemQuantities.forEach( item => {
        prodItemsCost += item.productItem.itemCost * item.count;
      });
      prodItemsCost = parseInt(prodItemsCost.toFixed(2));
      cost = fees + prodItemsCost;

    let profit = parseInt((product.msrp - cost).toFixed(2));
    if(profit < 0) {
      profit = 0;
    }

    let labels = ['Fees', 'Product Cost', 'Profit'];
    let data = [fees, prodItemsCost, profit];

    this.chartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#ffcd56', '#36a2eb', '#00ad10']
      }]
    }

    this.summaryData = {
      msrp: product.msrp,
      fees: fees,
      prodItemsCost: prodItemsCost,
      profit: profit
    }

  }

  findCountObj(id) {
    let prodQty = this.newProduct.productItemQuantities;
    return prodQty.find(item => item.productItem.id === id);
  }

  getCount(item) {
    let countItem = this.findCountObj(item.id);
    return countItem ? countItem.count : 0;
  }

  changeCount(val, item) {
    let countItem = this.findCountObj(item.id);
    let prodQty = this.newProduct.productItemQuantities;
    let count = val !== '' ? parseInt(val) : 0;
    if (countItem) {
      if (count === 0) {
        let index = prodQty.findIndex(obj => obj.productItem.id === item.id);
        prodQty.splice(index, 1);
      }
      else {
        countItem.count = count;
      }
    }
    else {
      prodQty.push({ count: count, productItem: item });
    }
    this.calculateCost();
  }

  addInventory() {
    this.newProduct.inventory.push({});
  }

  removeInventory(index) {
    this.newProduct.inventory.splice(index, 1);
  }

  addProdId() {
    this.newProduct.productIdentifiers.push({});
  }

  removeProdId(index) {
    this.newProduct.productIdentifiers.splice(index, 1);
  }

  removeImage(image) {
    this.newProduct.images = this.newProduct.images.filter( item => item.id != image.id);
  }

  openDetails(prodItem) {
    this.selectedProdItem = prodItem;
    this.showProdDetails = true;
  }

  closeDetails(product) {
    this.selectedProdItem = {};
    this.showProdDetails = false;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveNewItem(value) {
    api.post('productitem/', value).then(resp => {
      this.$toast.success('New product item created');
      this.getProductItems();
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  clearForm() {
    this.newProduct = {
      productItemQuantities: [],
      images: [],
      fees: [],
      inventory: [{}],
      productIdentifiers: [{}]
    };
    this.chartData.datasets = {};
    (this.$refs.newProduct as VForm).reset();
  }

  submitForm() {
    (this.$refs.newProduct as VForm).validate().then( valid => {
      if(valid) {
        api.post('product/', this.newProduct).then( () => {
          this.$toast.success('New product created');
          this.clearForm();
        })
        .catch(error => {
          this.errorList.push(error.response.data.message);
        });
      }
    });
  }
}
</script>
