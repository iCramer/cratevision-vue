<template>
  <div>
    <error-banner v-model="errorList" />
    <div class="toolbar">
      <app-button class="btn-push-right" btnStyle="success" icon="plus-circle" @click="openModal()">New Status</app-button>
    </div>
    <panel title="Statuses">
      <app-table :columns="columns" :records="statuses">
        <span slot="actions" slot-scope="{record}">
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="showConfirm(record)" icon="trash-alt" />
          <app-button btnStyle="info-link" class="action-btn" size="xs" @click="openModal(record)" icon="edit" />
        </span>
      </app-table>
      <pagination :totalRecords="statuses.length" />
    </panel>
    <modal title="Status" :open="showModal">
      <validation-observer ref="form">
        <form @submit.prevent="submitForm">
          <div v-if="editItem">
            <div class="row">
              <div class="col-md-6">
                <input-validate name="name" label="Name" rules="required" v-model="editItem.name" />
              </div>
              <div class="col-md-6">
                <select-box name="type" :options="types" label="Type" v-model="editItem.type" />
              </div>
            </div>
          </div>
          <button-group>
            <app-button @click="closeModal" btnStyle="info-link">Cancel</app-button>
            <app-button btnType="submit">Submit</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
    <confirmation-modal v-if="deleteItem" @cancel="showConfirmModal = false" @confirm="deleteStatus" :open="showConfirmModal">
      Are you sure you want to delete {{ deleteItem.name }}?
    </confirmation-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Panel, NoResults, ErrorBanner, AppButton, ButtonGroup, InputValidate, Modal, AppTable, Pagination, SelectBox, InputField } from '@/components';
import { IStatus, VForm } from '@/interfaces';
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
    SelectBox,
    ConfirmationModal,
    InputField
  }
})
export default class Statuses extends Vue {
  statuses: IStatus[] = [];
  editItem: IStatus = {};
  showModal = false;
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Type', selector: 'type' },
    { label: 'Actions', slotName: 'actions' },
  ];
  types = ['Product', 'Order', 'Active', 'Inactive', 'Prototype'];
  errorList: string[] = [];
  isEdit = false;
  showConfirmModal = false;
  deleteItem: IStatus = {};

  created() {
    this.getStatuses();
    this.resetEditItem();
  }

  getStatuses() {
    api.get('status/all').then( resp => {
      this.statuses = resp.data;
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
    api.post('status/', this.editItem).then( resp => {
      this.getStatuses();
      this.$toast.success('Status Added');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.closeModal();
  }

  submitEdit() {
    api.put('status/' + this.editItem.id, this.editItem).then( resp => {
      this.getStatuses();
      this.$toast.success('Status Updated');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
    this.isEdit = false;
    this.closeModal();
  }

  deleteStatus() {
    api.delete('status/' + this.deleteItem.id).then( resp => {
      this.getStatuses();
      this.$toast.success('Status Deleted');
    })
    .catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
