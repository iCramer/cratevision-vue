<template>
  <form>
    <error-banner v-model="errorList" />
    <progress-tracker @submit="onSubmit" @cancel="onCancel">
      <progress-tracker-step title="Basic Info" stepKey="basicInfo" :validate="validateBasicInfo">
        <validation-observer ref="basicInfo" slim>
          <basic-info-form ref="basicInfo" v-model="basicInfo"></basic-info-form>
        </validation-observer>
        <div class="row">
          <div class="col-md-6">
            <supplier-select v-model="supplier" />
          </div>
        </div>
      </progress-tracker-step>
      <progress-tracker-step title="Inventory" stepKey="inventory">
        <div v-for="(item, index) in inventory">
          <section-title :showBtn="index !== 0" btnIcon="trash-alt" sectionType="form" @util-click="removeInventory(index)" :class="{'mt-4': index !== 0}">Inventory #{{index + 1}}</section-title>
          <inventory-form v-model="inventory[index]" :showEdit="false" />
        </div>
        <app-button btnStyle="info-link" size="xs" icon="plus-circle" @click="addInventory">Add Inventory</app-button>
      </progress-tracker-step>
      <progress-tracker-step title="Identifier" stepKey="productIdentifier">
        <div v-for="(item, index) in productIdentifiers">
          <section-title :showBtn="index !== 0" btnIcon="trash-alt" sectionType="form" @util-click="removeProdId(index)" :class="{'mt-4': index !== 0}">Product Identifier #{{index + 1}}</section-title>
          <product-identifier-form v-model="productIdentifiers[index]" />
        </div>
        <app-button btnStyle="info-link" size="xs" icon="plus-circle" @click="addProdId">Add Identifier</app-button>
      </progress-tracker-step>
      <progress-tracker-step title="Image" stepKey="images">
        <file-uploader :multiple="false" v-model="picture" />
      </progress-tracker-step>
    </progress-tracker>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, AppButton, ProgressTracker, ProgressTrackerStep, SupplierSelect, FileUploader, ErrorBanner, SectionTitle } from '@/components';
import BasicInfoForm from './basic-info-form.vue';
import InventoryForm from './inventory-form.vue';
import ProductIdentifierForm from './product-identifier-form.vue';
import api from '@/api';
import { ISupplier, IProductItem, IInventory, IProductIdentifier, IMedia, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    Badge,
    InputField,
    Modal,
    AppButton,
    ProgressTracker,
    ProgressTrackerStep,
    BasicInfoForm,
    InventoryForm,
    ProductIdentifierForm,
    SupplierSelect,
    FileUploader,
    ValidationObserver,
    ErrorBanner,
    SectionTitle
  }
})
export default class NewProductItem extends Vue {
  basicInfo: IProductItem = {};
  productIdentifiers: IProductIdentifier[] = [{}];
  inventory: IInventory[] = [{}];
  supplier: ISupplier = {};
  supplierOptions: ISupplier[] = [];
  picture: IMedia = {};
  validateBasicInfo: Function = () => {};
  errorList: string[] = [];

  mounted() {
    this.validateBasicInfo = (this.$refs.basicInfo as VForm).validate;
  }

  created() {
    this.getSuppliers();
  }

  getSuppliers() {
    api.get('supplier/all').then( resp => {
      this.supplierOptions = resp.data;
    }).catch( error => {
      this.errorList.push(error.response.data.message);
    });
  }

  addInventory() {
    this.inventory.push({});
  }

  removeInventory(index) {
    this.inventory.splice(index, 1);
  }

  addProdId() {
    this.productIdentifiers.push({});
  }

  removeProdId(index) {
    this.productIdentifiers.splice(index, 1);
  }

  onSubmit() {
    let body = {
      ...this.basicInfo,
      picture: this.picture[0],
      productIdentifiers: this.productIdentifiers,
      inventory: this.inventory,
      supplier: this.supplier
    }
    this.$emit('submit', body);
  }

  onCancel() {
    this.$emit('cancel');
    this.productIdentifiers = [{}];
    this.inventory = [{ warehouse: {} }];
    this.supplier = { address: {} };
  }
}

</script>
