<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="row">
      <div class="col-md-5">
        <panel title="Summary">
          <list-group :iconList="true" v-if="product" title="Basic Info" :showBtn="true" @util-click="openBasicModal">
            <list-group-item icon="address-card">
              Name <span>{{product.name}}</span>
            </list-group-item>
            <list-group-item icon="tag">
              MSRP <span>{{product.msrp | currency}}</span>
            </list-group-item>
            <list-group-item icon="ellipsis-h" v-if="product.status">
              Status <badge badgeType="outline" badgeStyle="success">{{product.status.name}}</badge>
            </list-group-item>
          </list-group>
          <section-title :showBtn="true" @util-click="openFeeModal">Fees</section-title>
          <no-results v-if="!product.fees || !product.fees.length" @button-click="openFeeModal" header="No Fees Assigned" btnLabel="Add Fee"></no-results>
          <list-group :iconList="true" v-if="product.fees && product.fees.length">
            <list-group-item v-for="(fee, index) in product.fees" icon="receipt" color="yellow" :key="index">
              {{fee.name}} <span>{{fee.amount | fee(fee.type)}}</span>
            </list-group-item>
          </list-group>
        </panel>
        <panel title="Inventory">
          <inventory :inventory="product.inventory" :id="product.id" objectType="product"></inventory>
        </panel>
        <panel title="Product Identifiers">
          <product-identifier :prodIds="product.productIdentifiers" :id="product.id" objectType="product"></product-identifier>
        </panel>
        <panel title="Images">
          <app-button slot="utility" btnStyle="link" size="xs" icon="edit" @click="openImageModal"></app-button>
          <no-results v-if="!product.images || !product.images.length" header="No Images to Show" @button-click="openImageModal" btnLabel="Add Image" :icon="['far', 'images']"></no-results>
          <image-gallery v-else :images="product.images" />
        </panel>
      </div>
      <div class="col-md-7">
        <panel title="Cost Breakdown">
          <doughnut-chart :options="chartOptions" :innerText="summaryData.msrp" :height="140" :chart-data="chartData"></doughnut-chart>
          <!-- <list-group v-if="summaryData" title="Summary">
            <list-group-item icon="tag">
              MSRP <badge>{{summaryData.msrp | currency}}</badge>
            </list-group-item>
            <list-group-item icon="receipt">
              Fees <badge>{{summaryData.fees | currency}}</badge>
            </list-group-item>
            <list-group-item icon="hand-holding-usd">
              Product Cost <badge>{{summaryData.prodItemsCost | currency}}</badge>
            </list-group-item>
            <list-group-item icon="dollar-sign">
              Profit <badge badgeStyle="success">{{summaryData.profit | currency}}</badge>
            </list-group-item>
          </list-group> -->
        </panel>
        <transition name="expand">
          <panel v-if="productItemQty.length" title="Product Item Quantities">
            <app-button v-if="!editProdItems" slot="utility" btnStyle="link" size="xs" icon="edit" @click="prodItemEditStart"></app-button>
            <div v-else slot="utility">
              <app-button v-if="editProdItems" :linkBtn="true" @click="cancelItemEdit">Cancel</app-button>
              <app-button v-if="editProdItems" @click="submitProdItems">Save</app-button>
            </div>
            <app-button v-if="editProdItems" :linkBtn="true" size="xs" icon="plus-circle" @click="openNewItemModal">New Product Item</app-button>
            <app-table :columns="itemCols">
              <tr v-for="(record, index) in filteredProdItems" :key="`row-${index}`">
                <td>
                  <counter v-if="editProdItems" :value="getCount(record)" @input="(val) => changeCount(val, record)"></counter>
                  <badge v-else badgeStyle="info">{{ getCount(record) }}</badge>
                </td>
                <td>
                  <app-button size="xs" btnStyle="link" @click="openDetails(record)">{{record.name}}</app-button>
                </td>
                <td>{{ record.caseQty }}</td>
                <td>{{ record.itemCost }}</td>
                <td>{{ record.supplier && record.supplier.name }}</td>
              </tr>
            </app-table>
            <pagination :totalRecords="productItems.length" @change="changePage" />
          </panel>
        </transition>
      </div>
    </div>
    <product-item-panel :open="showDetails" @close="closeDetails()" :item="selectedItem" />
    <modal size="lg" title="New Product Item" :open="showNewItemModal">
      <new-product-item @cancel="closeNewItemModal" @submit="saveNewItem" />
    </modal>
    <modal title="Edit Basic Info" :open="showBasicModal">
      <validation-observer ref="basicInfo">
        <form @submit.prevent="submitBasic" novalidate>
          <div class="row">
            <div class="col-md-7">
              <input-validate name="name" label="Name" rules="required" v-model="basicInfoEditObj.name" />
            </div>
            <div class="col-md-5">
              <input-validate name="msrp" label="MSRP" rules="required" inputType="number" :numberStep="0.1" v-model="basicInfoEditObj.msrp" />
            </div>
            <div class="col-md-6">
              <status-select v-model="basicInfoEditObj.status" />
            </div>
          </div>
          <button-group>
            <app-button :linkBtn="true" @click="closeBasicModal">Cancel</app-button>
            <app-button btnType="submit">Save</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
    <modal title="Fees" :open="showFeeModal">
      <form v-if="!editFeeOptions" @submit.prevent="submitFees">
        <fee-input v-model="feeEditArr" @edit-click="editFeeOptions = true"  />
        <button-group>
          <app-button :linkBtn="true" @click="closeFeeModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </button-group>
      </form>
      <fee-editor v-else @back-click="editFeeOptions = false" />
    </modal>
    <modal title="Images" :open="showImageModal">
      <form @submit.prevent="submitImages">
        <image-editor v-model="product.images" />
        <button-group>
          <app-button :linkBtn="true" @click="closeImageModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </button-group>
      </form>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Panel,
  ListGroup,
  ListGroupItem,
  NoResults,
  Badge,
  DataImage,
  AppTable,
  Modal,
  AppButton,
  Counter,
  SectionTitle,
  ImageGallery,
  InputField,
  InputValidate,
  MultiSelect,
  StatusSelect,
  Radio,
  FeeInput,
  FeeEditor,
  ImageEditor,
  ButtonGroup,
  ErrorBanner,
  Toggle,
  Pagination
} from '@/components';
import { DoughnutChart } from '@/charts';
import api from '@/api';
import { IProduct, IProductItem, IProductItemQuantity, IFee, IMedia, VForm } from '@/interfaces';
import ProductItemPanel from './product-item-panel.vue';
import NewProductItem from './product-items/new-product-item.vue';
import deepCopy from '@/utils';
import { ValidationObserver } from 'vee-validate';
import ProductIdentifier from './product-items/product-identifier.vue';
import Inventory from './product-items/inventory.vue';

@Component({
  components: {
    Panel,
    ListGroup,
    ListGroupItem,
    Badge,
    DoughnutChart,
    NoResults,
    DataImage,
    AppTable,
    Modal,
    ProductItemPanel,
    AppButton,
    Counter,
    NewProductItem,
    SectionTitle,
    ImageGallery,
    InputField,
    InputValidate,
    MultiSelect,
    StatusSelect,
    Radio,
    FeeInput,
    FeeEditor,
    ImageEditor,
    ButtonGroup,
    ValidationObserver,
    ErrorBanner,
    Toggle,
    ProductIdentifier,
    Inventory,
    Pagination
  }
})
export default class ProductInfo extends Vue {
  product: IProduct = {};
  chartData: any = {};
  summaryData: any = {};
  productImages = [];
  productItems: IProductItem[] = [];
  filteredProdItems: IProductItem[] = [];
  productItemQty: IProductItemQuantity[] = [];
  selectedItem = {};
  showDetails = false;
  saveDisabled = true;
  showNewItemModal = false;
  editProdItems = false;
  showBasicModal = false;
  basicInfoEditObj: IProduct = {};
  showFeeModal = false;
  editFeeOptions = false;
  feeEditArr: IFee[] = [];
  showImageModal = false;
  images: IMedia[] = [];
  selectedImages: IMedia[];
  itemCols = [
    { label: 'Quantity', slotName: 'count' },
    { label: 'Name', slotName: 'name' },
    { label: 'Case Cost', selector: 'caseCost' },
    { label: 'Item Cost', selector: 'itemCost' },
    { label: 'Supplier', selector: 'supplier.name' }
  ];
  statusOptions = [];
  errorList: string[] = [];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: { position: 'bottom', labels: { boxWidth: 15, fontSize: 14, fontColor: '#444'}}
  };

  created() {
    this.getProduct();
    this.getStatuses();
  }

  getProduct() {
    const id = this.$route.params.id;
    api.get('product/' + id).then(resp => {
      this.product = resp.data;
      this.productItemQty = this.product.productItemQuantities || [];
      if(this.productItemQty.length) {
        this.getProductItems();
      }
      this.calculateCost();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  getProductItems() {
    api.get('productitem/all').then(resp => {
      this.productItems = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  getStatuses() {
    api.get('status/all').then(resp => {
      this.statusOptions = resp.data;
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  calculateCost() {
    let product = this.product;
    let fees = 0;
    product.fees.forEach( fee => {
      fees += fee.amount;
    });

    let prodItemsCost = 0;
    product.productItemQuantities.forEach( item => {
      prodItemsCost += item.productItem.itemCost * item.count;
    });
    prodItemsCost = parseInt(prodItemsCost.toFixed(2));
    const cost = fees + prodItemsCost;
    let profit = parseInt((product.msrp - cost).toFixed(2));
    if(profit < 0) {
      profit = 0;
    }

    this.chartData = {
      labels: ['Fees', 'Product Cost', 'Profit'],
      datasets: [{
        data: [fees, prodItemsCost, profit],
        backgroundColor: ['#ff6384', '#ffcd56', '#00ad10']
      }]
    }

    this.summaryData = {
      msrp: product.msrp,
      fees: fees,
      prodItemsCost: prodItemsCost,
      profit: profit
    }
  }

  changePage(range) {
    let prodItems = deepCopy(this.productItems);
    this.filteredProdItems = prodItems.splice(range.start, range.end);
  }

  prodItemEditStart() {
    this.filteredProdItems = this.productItems;
    this.editProdItems = true;
  }

  prodItemEditEnd() {
    this.filteredProdItems = this.productItems.filter(item => this.getCount(item) > 0);
    this.editProdItems = false;
  }

  findCountObj(id) {
    return this.productItemQty.find(item => item.productItem.id === id);
  }

  getCount(item) {
    let countItem = this.findCountObj(item.id);
    return countItem ? countItem.count : 0;
  }

  changeCount(val, item) {
    let countItem = this.findCountObj(item.id);
    let prodItemQty = this.productItemQty;
    let count = val !== '' ? parseInt(val) : 0;
    if (countItem) {
      if (count === 0) {
        let index = prodItemQty.findIndex(obj => obj.productItem.id === item.id);
        prodItemQty.splice(index, 1);
      }
      else {
        countItem.count = count;
      }
    }
    else {
      prodItemQty.push({ count: count, productItem: item });
    }
    this.calculateCost();
    this.saveDisabled = false;
  }

  openDetails(obj) {
    this.showDetails = true;
    this.selectedItem = obj;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedItem = {};
  }

  openNewItemModal() {
    this.showNewItemModal = true;
  }

  closeNewItemModal() {
    this.showNewItemModal = false;
  }

  openBasicModal() {
    let prod = this.product;
    this.basicInfoEditObj = {
      name: prod.name,
      msrp: prod.msrp,
      fees: prod.fees,
      status: prod.status
    };
    this.showBasicModal = true;
  }

  closeBasicModal() {
    this.showBasicModal = false;
  }

  openFeeModal() {
    this.feeEditArr = this.product.fees;
    this.showFeeModal = true;
  }

  closeFeeModal() {
    this.showFeeModal = false;
  }

  openImageModal() {
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  cancelItemEdit() {
    this.prodItemEditEnd();
    this.getProduct();
  }

  saveNewItem(value) {
    api.post('productitem/', value).then(resp => {
      this.getProductItems();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeNewItemModal();
  }

  submitBasic() {
    (this.$refs.basicInfo as VForm).validate().then( valid => {
      if(valid) {
        let body = this.basicInfoEditObj;
        this.submitEdit(body);
      }
    });
  }

  submitFees() {
    let body = { fees: this.feeEditArr };
    this.submitEdit(body);
  }

  submitImages() {
    let body = { images: this.product.images };
    this.submitEdit(body);
  }

  submitProdItems() {
    let body = { productItemQuantities: this.productItemQty };
    this.submitEdit(body);
  }

  submitEdit(body) {
    api.put('product/' + this.product.id, body).then(resp => {
      this.getProduct();
      this.$toast.success('Product updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeBasicModal();
    this.closeFeeModal();
    this.closeImageModal();
    this.editProdItems = false;
  }
}
</script>
