<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" @click="openModal()">New Supplier</app-button>
    </div>
    <panel title="Suppliers">
      <app-table :columns="columns" :records="suppliers">
        <div slot="location" slot-scope="{record}">
          <span v-if="record.address">
            {{ record.address.addressLine1 }} {{ record.address.addressLine2 }} {{ record.address.city }}, {{ record.address.state }} {{ record.address.zipCode }} {{ record.address.country }}
          </span>
        </div>
        <span slot="actions" slot-scope="{record}">
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="openModal(record)" icon="edit" />
        </span>
      </app-table>
      <pagination :totalRecords="suppliers.length" />
    </panel>
    <modal title="Supplier" :open="showModal">
      <validation-observer ref="form">
        <form @submit.prevent="submitForm">
          <supplier-form v-model="editItem" />
          <button-group>
            <app-button @click="closeModal" btnStyle="info-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
    <confirmation-modal v-if="deleteItem" @cancel="showConfirmModal = false" @confirm="deleteSupplier" :open="showConfirmModal">
      Are you sure you want to delete {{ deleteItem.name }}?
    </confirmation-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, ErrorBanner, AppButton, ButtonGroup, Modal, AppTable, Pagination } from '@/components';
import { ISupplier, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import api from '@/api';
import deepCopy from '@/utils';
import { ConfirmationModal } from '@/patterns';
import SupplierForm from '@/pages/products/product-items/supplier-form.vue';

@Component({
  components: {
    Panel,
    ErrorBanner,
    AppButton,
    ButtonGroup,
    ValidationObserver,
    Modal,
    AppTable,
    Pagination,
    ConfirmationModal,
    SupplierForm
  }
})
export default class Suppliers extends Vue {
  suppliers: ISupplier[] = [];
  editItem: ISupplier = {};
  showModal = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Location', slotName: 'location' },
    { label: 'Actions', slotName: 'actions' }
  ];
  errorList: string[] = [];
  isEdit = false;
  showConfirmModal = false;
  deleteItem: ISupplier = {};

  created() {
    this.getSuppliers();
    this.resetEditItem();
  }

  getSuppliers() {
    api.get('supplier/all').then( resp => {
      this.suppliers = resp.data;
    })
  }

  openModal(obj) {
    if(obj) {
      if(!obj.address) {
        obj.address = {};
      }
      this.editItem = deepCopy(obj);
      this.isEdit = true;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetEditItem();
    this.isEdit = false;
  }

  showConfirm(obj) {
    this.deleteItem = obj;
    this.showConfirmModal = true;
  }

  hideConfirm() {
    this.showConfirmModal = false;
    this.deleteItem = {};
  }

  resetEditItem() {
    this.editItem = { address: {} };
  }

  submitForm() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        if(this.isEdit) {
          this.submitEdit();
        }
        else {
          this.submitNew();
        }
      }
    });
  }

  submitNew() {
    api.post('supplier/', this.editItem).then( resp => {
      this.getSuppliers();
      this.$toast.success('Supplier Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  submitEdit() {
    api.put('supplier/' + this.editItem.id, this.editItem).then( resp => {
      this.getSuppliers();
      this.$toast.success('Supplier Updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.isEdit = false;
    this.closeModal();
  }

  deleteSupplier() {
    api.delete('supplier/' + this.deleteItem.id).then( resp => {
      this.getSuppliers();
      this.$toast.success('Supplier Deleted');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
