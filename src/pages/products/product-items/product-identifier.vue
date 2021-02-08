<template>
  <div>
    <error-banner v-model="errorList" />
    <no-results
      v-if="prodIds && !prodIds.length"
      header="No Product Identifiers Assigned"
      :icon="['far', 'id-card-alt']"
      @button-click="startNewId"
      btnLabel="Create One"
    />

    <list-group :showBtn="true" @util-click="openModal">
      <list-group-item v-for="item in prodIds" :icon="['fal', 'barcode-read']">
        {{ item.type }}<span>{{item.name}}</span>
      </list-group-item>
    </list-group>

    <app-button btnStyle="link" size="xs" icon="plus-circle" v-if="prodIds && prodIds.length > 0" @click="startNewId">Add Product Identifier</app-button>

    <modal title="Product Identifier" :open="showModal">
      <app-table v-if="!showForm" :records="prodIds" :columns="tableColumns">
        <app-button slot="actions" slot-scope="{record}" class="action-btn" icon="edit" btnStyle="link" size="xs" @click="startEdit(record)"></app-button>
      </app-table>
      <form v-else @submit.prevent="submitForm">
        <validation-observer ref="form">
          <product-identifier-form v-model="editItem" />
        </validation-observer>
        <button-group>
          <app-button :linkBtn="true" @click="showForm = false">Cancel</app-button>
          <app-button type="submit">Save</app-button>
        </button-group>
      </form>
      <button-group v-if="!showForm">
        <app-button push="left" size="xs" @click="startNewId" btnStyle="link" icon="plus-circle">New Identifier</app-button>
        <app-button @click="closeModal">Done</app-button>
      </button-group>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, AppButton, SectionTitle, NoResults, AppTable, ButtonGroup, ErrorBanner } from '@/components';
import ProductIdentifierForm from './product-identifier-form.vue';
import api from '@/api';
import { IProductIdentifier, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    Badge,
    InputField,
    Modal,
    AppButton,
    ProductIdentifierForm,
    SectionTitle,
    NoResults,
    AppTable,
    ButtonGroup,
    ValidationObserver,
    ErrorBanner
  }
})
export default class ProductIdentifier extends Vue {
  @Prop({default: () => []}) prodIds: IProductIdentifier[];
  @Prop() id: number;
  @Prop({default: 'productitem'}) objectType: 'product' | 'productitem';
  editItem: IProductIdentifier = {};
  showModal = false;
  showForm = false;
  tableColumns = [
    { label: 'Type', selector: 'type' },
    { label: 'Name', selector: 'name' },
    { label: 'Identifier', selector: 'identifier' },
    { label: 'Actions', slotName: 'actions' }
  ];
  errorList: string[] = [];

  @Watch('prodIds')
  onChange(){
    console.log(this.prodIds)
  }

  mounted() {
    console.log(this.prodIds)
  }

  closeModal() {
    this.showModal = false;
    this.editItem = {};
  }

  openModal() {
    this.showModal = true;
  }

  startNewId() {
    this.showForm = true;
    this.editItem = {};
    this.openModal();
  }

  startEdit(record) {
    this.showForm = true;
    this.editItem = record;
  }

  submitForm() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        let prodIds = this.prodIds;
        let id = this.editItem.id;
        const index = prodIds.findIndex( obj => obj.id === id );
        if(index > -1) {
          prodIds[index] = this.editItem;
        }
        else {
          prodIds.push(this.editItem);
        }
        const body = { productIdentifiers: prodIds };
        api.put(this.objectType + '/' + this.id, body).then( () => {
          this.$toast.success('Product identifiers updated');
        })
        .catch(error => {
          this.errorList.push(error.response.data.message);
        });

        this.showForm = false;
      }
    });
  }
}

</script>
