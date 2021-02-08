<template>
  <div>
    <error-banner v-model="errorList" />
    <app-table v-if="!showForm" :columns="columns" :records="warehouses">
      <div slot="location" slot-scope="{record}">
        {{ record.location && record.location.city + ',' }} {{ record.location && record.location.state }}
        <span v-if="!record.location">---</span>
      </div>
      <div slot="actions" slot-scope="{record}">
        <app-button size="xs" btnStyle="link" class="action-btn" @click="editWarehouse(record)" icon="edit" />
        <app-button size="xs" btnStyle="link" class="action-btn" @click="deleteWarehouse(record)" icon="trash-alt" />
      </div>
    </app-table>
    <validation-observer v-else ref="form">
      <transition name="expand">
        <form @submit.prevent="submitForm" v-if="showForm">
          <div v-if="editItem">
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
          </div>
          <button-group>
            <app-button @click="cancel" btnStyle="secondary-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </transition>
    </validation-observer>
    <button-group v-if="!showForm">
      <app-button push="left" size="xs" v-if="showBackBtn()" @click="$emit('back-click')" icon="chevron-left" btnStyle="link">Back</app-button>
      <app-button size="xs" @click="showForm = true" btnStyle="link" icon="plus-circle">New Warehouse</app-button>
    </button-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AppTable, AppButton, ButtonGroup, ErrorBanner, InputValidate, InputField, SelectBox } from '@/components';
import api from '@/api';
import { IWarehouse, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import deepCopy from '@/utils';
import { states } from '@/data/states';

@Component({
  components: { AppTable, AppButton, ButtonGroup, ErrorBanner, ValidationObserver, InputValidate, InputField, SelectBox }
})
export default class WarehouseEditor extends Vue {
  warehouses: IWarehouse[] = [];
  editItem: IWarehouse = { location: {} };
  errorList: string[] = [];
  showForm = false;
  isEdit = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Location', slotName: 'location' },
    { label: 'Type', selector: 'warehouseType' },
    { label: 'Actions', slotName: 'actions' }
  ];
  states = states;

  created() {
    this.getWarehouses();
  }

  getWarehouses() {
    api.get('warehouse/all').then(resp => {
      this.warehouses = resp.data;
    })
    .catch( error => {
      this.errorList.push(error.response.data.message);
    });
  }

  showBackBtn() {
    return this.$listeners && this.$listeners['back-click'];
  }

  cancel() {
    this.showForm = false;
    this.editItem = { location: {} };
  }

  editWarehouse(item) {
    this.isEdit = true;
    item.location = item.location || {};
    this.editItem = deepCopy(item);
    this.showForm = true;
  }

  deleteWarehouse(item) {
    api.delete('warehouse/' + item.id).then( resp => {
      this.getWarehouses();
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }

  submitForm() {
    if (this.isEdit) {
      this.submitEdit();
    }
    else {
      this.submitNew();
    }
  }

  submitNew() {
    api.post('warehouse/', this.editItem).then( resp => {
      this.getWarehouses();
      this.$toast.success('Warehouse Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.showForm = false;
  }

  submitEdit() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        api.put('warehouse/' + this.editItem.id, this.editItem).then( resp => {
          this.getWarehouses();
          this.$toast.success('Warehouse Updated');
        })
        .catch(error => {
          this.errorList.push(error.response.data.message);
        });
        this.isEdit = false;
        this.showForm = false;
      }
    });
  }
}

</script>
