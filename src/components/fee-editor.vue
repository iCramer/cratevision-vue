<template>
  <div class="fee-editor">
    <app-table v-if="!showForm" :columns="columns" :records="fees">
      <span slot="amount" slot-scope="{record}">
        <span v-if="record.type === 'AMOUNT'">{{ record.amount | currency }}</span>
        <span v-if="record.type === 'PERCENTAGE'">{{ record.amount }}%</span>
      </span>
      <div slot="actions" slot-scope="{record}">
        <app-button size="xs" btnStyle="link" class="action-btn" @click="editFee(record)" icon="edit" />
        <app-button size="xs" btnStyle="link" class="action-btn" @click="deleteFee(record)" icon="trash-alt" />
      </div>
    </app-table>
    <validation-observer v-else ref="form">
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-5">
            <input-validate label="Name" name="name" rules="required" v-model="editObj.name" />
          </div>
          <div class="col-md-4">
            <select-validate label="Type" name="type" :options="['AMOUNT', 'PERCENTAGE']" rules="required" v-model="editObj.type" />
          </div>
          <div class="col-md-3">
            <input-validate label="Amount" name="amount" rules="required" inputType="number" :numberStep=".01" v-model="editObj.amount" />
          </div>
        </div>
        <button-group>
          <app-button @click="cancel" btnStyle="secondary-link">Cancel</app-button>
          <app-button btnType="submit">Submit</app-button>
        </button-group>
      </form>
    </validation-observer>
    <button-group v-if="!showForm">
      <app-button push="left" size="xs" v-if="showBackBtn()" @click="$emit('back-click')" icon="chevron-left" btnStyle="link">Back</app-button>
      <app-button size="xs" @click="showForm = true" btnStyle="link" icon="plus-circle">New Fee</app-button>
    </button-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';
import ButtonGroup from './button-group.vue';
import AppTable from './table.vue';
import InputValidate from './input-validate.vue';
import SelectValidate from './select-validate.vue';
import api from '@/api';
import { IFee, VForm } from '@/interfaces';
import deepCopy from '@/utils';
import { ValidationObserver } from 'vee-validate';
import { EventBus } from '@/main';

@Component({
  components: { AppButton, AppTable, InputValidate, ButtonGroup, ValidationObserver, SelectValidate }
})
export default class FeeInput extends Vue {
  editObj: IFee = {};
  fees: IFee[] = [];
  columns = [
    { label: 'Name', selector: 'name' },
    { label: 'Amount', slotName: 'amount' },
    { label: 'Actions', slotName: 'actions' }
  ];
  showForm = false;
  isEdit = false;

  created() {
    this.getFees();
  }

  showBackBtn() {
    return this.$listeners && this.$listeners['back-click'];
  }

  getFees() {
    api.get('fee/all').then(resp => {
      this.fees = resp.data;
    })
    .catch(error => {

    });
  }

  editFee(item) {
    this.isEdit = true;
    this.editObj = deepCopy(item);
    this.showForm = true;
  }

  deleteFee(item) {
    api.delete('fee/' + item.id).then( resp => {
      this.getFees();
      EventBus.$emit('fees-updated');
    })
    .catch(error => {

    });
  }

  cancel() {
    this.showForm = false;
    this.editObj = {};
  }

  submitForm() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        this.editObj.org = { id: 1 };
        if (this.isEdit) {
          this.submitEdit();
        }
        else {
          this.submitNew();
        }
      }
    });
  }

  submitNew() {
    api.post('fee/', this.editObj).then( resp => {
      this.getFees();
      EventBus.$emit('fees-updated');
    })
    .catch(error => {

    });
    this.showForm = false;
  }

  submitEdit() {
    api.put('fee/' + this.editObj.id, this.editObj).then( resp => {
      this.getFees();
      EventBus.$emit('fees-updated');
    })
    .catch(error => {

    });
    this.isEdit = false;
    this.showForm = false;
  }
}
</script>
