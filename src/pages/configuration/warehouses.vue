<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" @click="openModal()">New Warehouse</app-button>
    </div>
    <panel title="Warehouses">
      <app-table :columns="columns" :records="warehouses">
        <div slot="location" slot-scope="{record}">
          <span v-if="record.location">
            {{ record.location.addressLine1 }} {{ record.location.addressLine2 }} {{ record.location.city }}, {{ record.location.state }} {{ record.location.zipCode }} {{ record.location.country }}
          </span>
        </div>
        <span slot="actions" slot-scope="{record}">
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="openModal(record)" icon="edit" />
        </span>
      </app-table>
      <pagination :totalRecords="warehouses.length" />
    </panel>
    <modal title="Warehouse" :open="showModal">
      <validation-observer ref="form">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6">
              <input-validate name="name" label="Name" rules="required" v-model="editItem.name" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <input-field name="addressLine1" label="Address Line 1" v-model="editItem.location.addressLine1" />
            </div>
            <div class="col-md-6">
              <input-field name="addressLine2" label="Address Line 2" v-model="editItem.location.addressLine2" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <input-field name="city" label="City" v-model="editItem.location.city" />
            </div>
            <div class="col-md-6">
              <select-box name="state" :options="states" label="State" v-model="editItem.location.state" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <input-field name="zipCode" label="Zip Code" v-model="editItem.location.zipCode" />
            </div>
            <div class="col-md-6">
              <input-field name="country" label="Country" v-model="editItem.location.country" />
            </div>
          </div>
          <button-group>
            <app-button @click="closeModal" btnStyle="info-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
    <confirmation-modal v-if="deleteItem" @cancel="showConfirmModal = false" @confirm="deleteWarehouse" :open="showConfirmModal">
      Are you sure you want to delete {{ deleteItem.name }}?
    </confirmation-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, NoResults, ErrorBanner, AppButton, ButtonGroup, InputValidate, Modal, AppTable, Pagination, SelectBox, InputField } from '@/components';
import { IWarehouse, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import api from '@/api';
import deepCopy from '@/utils';
import { ConfirmationModal } from '@/patterns';
import { states } from '@/data/states';

@Component({
  components: {
    Panel,
    NoResults,
    ErrorBanner,
    AppButton,
    ButtonGroup,
    InputValidate,
    ValidationObserver,
    Modal,
    AppTable,
    Pagination,
    SelectBox,
    ConfirmationModal,
    InputField
  }
})
export default class Warehouses extends Vue {
  warehouses: IWarehouse[] = [];
  editItem: IWarehouse = {};
  showModal = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Type', selector: 'warehouseType' },
    { label: 'Location', slotName: 'location' },
    { label: 'Actions', slotName: 'actions' },
  ];
  errorList: string[] = [];
  states = states;
  isEdit = false;
  showConfirmModal = false;
  deleteItem: IWarehouse = {};

  created() {
    this.getWarehouses();
    this.resetEditItem();
  }

  getWarehouses() {
    api.get('warehouse/all').then( resp => {
      this.warehouses = resp.data;
    })
  }

  openModal(obj) {
    if(obj) {
      if(!obj.location) {
        obj.location = {};
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
    this.editItem = { location: {} };
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
    api.post('warehouse/', this.editItem).then( resp => {
      this.getWarehouses();
      this.$toast.success('Warehouse Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  submitEdit() {
    api.put('warehouse/' + this.editItem.id, this.editItem).then( resp => {
      this.getWarehouses();
      this.$toast.success('Warehouse Updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.isEdit = false;
    this.closeModal();
  }

  deleteWarehouse() {
    api.delete('warehouse/' + this.deleteItem.id).then( resp => {
      this.getWarehouses();
      this.$toast.success('Warehouse Deleted');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
