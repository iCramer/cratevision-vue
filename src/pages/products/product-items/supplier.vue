<template>
  <div>
    <error-banner v-model="errorList" />
    <img v-if="supplier.logo && supplier.logo.path" v-bind:src="supplier.logo.path" v-bind:alt="supplier.logo.name" />
    <list-group title="Supplier Info" :showBtn="true" @util-click="openModal">
      <list-group-item icon="address-card">
        Name<span>{{supplier.name}}</span>
      </list-group-item>
      <list-group-item v-if="address()" icon="map-marker-alt" :justifyContent="false">
        Address
        <p>{{address().addressLine1}}</p>
        <p>{{address().addressLine2}}</p>
        <p>{{address().city}}</p>
        <p>{{address().state}}</p>
        <p>{{address().zipCode}}</p>
        <p>{{address().country}}</p>
      </list-group-item>
    </list-group>
    <modal title="Edit Supplier" :open="showModal">
      <form v-if="!editSuppliers" @submit.prevent="submitForm">
        <supplier-select v-model="editItem" @edit-click="editSuppliers = true" />
        <div class="modal-buttons">
          <app-button :linkBtn="true" @click="closeModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </div>
      </form>
      <supplier-editor v-else @back-click="editSuppliers = false" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, AppButton, ErrorBanner, SupplierSelect } from '@/components';
import { SupplierEditor } from '@/patterns';
import { ISupplier, VForm } from '@/interfaces';
import api from '@/api';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    InputField,
    Modal,
    AppButton,
    ValidationObserver,
    ErrorBanner,
    SupplierEditor,
    SupplierSelect
  }
})
export default class Supplier extends Vue {
  @Prop({default: () => { address: {} }}) supplier: ISupplier;
  @Prop() id: number;
  editItem: Object = {};
  showModal = false;
  errorList: string[] = [];
  editSuppliers = false;

  address() {
    return this.supplier.address;
  }

  closeModal() {
    this.showModal = false;
    this.editItem = {};
  }

  openModal() {
    this.editItem = this.supplier;
    this.showModal = true;
  }

  submitForm() {
    const body = { supplier: this.editItem };
    api.put('productitem/' + this.id, body).then( () => {
      this.$toast.success('Supplier updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }
}

</script>
