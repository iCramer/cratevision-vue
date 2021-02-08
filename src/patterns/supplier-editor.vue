<template>
  <div>
    <error-banner v-model="errorList" />
    <app-table v-if="!showForm" :columns="columns" :records="suppliers">
      <div slot="location" slot-scope="{record}">
        {{ record.address.city }}, {{ record.address.state }}
      </div>
      <div slot="actions" slot-scope="{record}">
        <app-button size="xs" btnStyle="link" class="action-btn" @click="editSupplier(record)" icon="edit" />
        <app-button size="xs" btnStyle="link" class="action-btn" @click="deleteSupplier(record)" icon="trash-alt" />
      </div>
    </app-table>
    <validation-observer v-else ref="form">
      <transition name="expand">
        <form @submit.prevent="submitForm" v-if="showForm">
          <supplier-form v-model="editItem" />
          <button-group>
            <app-button @click="cancel" btnStyle="secondary-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </transition>
    </validation-observer>
    <button-group v-if="!showForm">
      <app-button push="left" size="xs" v-if="showBackBtn()" @click="$emit('back-click')" icon="chevron-left" btnStyle="link">Back</app-button>
      <app-button size="xs" @click="showForm = true" btnStyle="link" icon="plus-circle">New Supplier</app-button>
    </button-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AppTable, AppButton, ButtonGroup, ErrorBanner } from '@/components';
import api from '@/api';
import { ISupplier, VForm } from '@/interfaces';
import SupplierForm from '@/pages/products/product-items/supplier-form.vue';
import { ValidationObserver } from 'vee-validate';
import deepCopy from '@/utils';

@Component({
  components: { AppTable, AppButton, ButtonGroup, ErrorBanner, SupplierForm, ValidationObserver }
})
export default class SupplierEditor extends Vue {
  suppliers: ISupplier[] = [];
  editItem: ISupplier = { address: {} };
  errorList: string[] = [];
  showForm = false;
  isEdit = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Location', slotName: 'location' },
    { label: 'Actions', slotName: 'actions' }
  ];

  created() {
    this.getSuppliers();
  }

  getSuppliers() {
    api.get('supplier/all').then(resp => {
      this.suppliers = resp.data;
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
    this.editItem = { address: {} };
  }

  editSupplier(item) {
    this.isEdit = true;
    this.editItem = deepCopy(item);
    this.showForm = true;
  }

  deleteSupplier(item) {
    api.delete('supplier/' + item.id).then( resp => {
      this.getSuppliers();
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
    api.post('supplier/', this.editItem).then( resp => {
      this.getSuppliers();
      this.$toast.success('Supplier Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.showForm = false;
  }

  submitEdit() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        api.put('supplier/' + this.editItem.id, this.editItem).then( resp => {
          this.getSuppliers();
          this.$toast.success('Supplier Updated');
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
