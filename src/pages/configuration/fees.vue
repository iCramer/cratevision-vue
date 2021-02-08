<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" @click="openModal()">New Fee</app-button>
    </div>
    <panel title="Fees">
      <app-table :columns="columns" :records="fees">
        <span slot="amount" slot-scope="{record}">
          <span v-if="record.type === 'AMOUNT'">{{ record.amount | currency }}</span>
          <span v-if="record.type === 'PERCENTAGE'">{{ record.amount }}%</span>
        </span>
        <span slot="actions" slot-scope="{record}">
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="openModal(record)" icon="edit" />
        </span>
      </app-table>
      <pagination :totalRecords="fees.length" />
    </panel>
    <modal title="Fee" :open="showModal">
      <validation-observer ref="form">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-5">
              <input-validate label="Name" name="name" rules="required" v-model="editItem.name" />
            </div>
            <div class="col-md-4">
              <select-validate label="Type" name="type" :options="['AMOUNT', 'PERCENTAGE']" rules="required" v-model="editItem.type" />
            </div>
            <div class="col-md-3">
              <input-validate label="Amount" name="amount" rules="required" inputType="number" :numberStep=".01" v-model="editItem.amount" />
            </div>
          </div>
          <button-group>
            <app-button @click="closeModal" btnStyle="info-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
    <confirmation-modal v-if="deleteItem" @cancel="showConfirmModal = false" @confirm="deleteFee" :open="showConfirmModal">
      Are you sure you want to delete {{ deleteItem.name }}?
    </confirmation-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, NoResults, ErrorBanner, AppButton, ButtonGroup, InputValidate, Modal, AppTable, Pagination, SelectValidate, InputField } from '@/components';
import { IFee, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import api from '@/api';
import deepCopy from '@/utils';
import { ConfirmationModal } from '@/patterns';

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
    SelectValidate,
    ConfirmationModal,
    InputField
  }
})
export default class Fees extends Vue {
  fees: IFee[] = [];
  editItem: IFee = {};
  showModal = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Amount', slotName: 'amount' },
    { label: 'Type', selector: 'type' },
    { label: 'Actions', slotName: 'actions' },
  ];
  errorList: string[] = [];
  isEdit = false;
  showConfirmModal = false;
  deleteItem: IFee = {};

  created() {
    this.getFees();
    this.resetEditItem();
  }

  getFees() {
    api.get('fee/all').then( resp => {
      this.fees = resp.data;
    })
  }

  openModal(obj) {
    if(obj) {
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
    this.editItem = {};
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
    api.post('fee/', this.editItem).then( resp => {
      this.getFees();
      this.$toast.success('Fee Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  submitEdit() {
    api.put('fee/' + this.editItem.id, this.editItem).then( resp => {
      this.getFees();
      this.$toast.success('Fee Updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.isEdit = false;
    this.closeModal();
  }

  deleteFee() {
    api.delete('fee/' + this.deleteItem.id).then( resp => {
      this.getFees();
      this.$toast.success('Fee Deleted');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
