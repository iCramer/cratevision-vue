<template>
  <select-box name="supplier" :withSearch="true" label="Supplier" v-model="innerValue" :options="supplierOptions">
    <app-button v-if="showEditBtn()" class="sub-input-btn" size="xs" btnStyle="link" @click="$emit('edit-click')">Edit Suppliers</app-button>
  </select-box>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectBox from './select-box.vue';
import AppButton from './button.vue';
import { ISupplier } from '@/interfaces';
import api from '@/api';

@Component({
  components: { SelectBox, AppButton }
})
export default class SupplierSelect extends Vue {
  @Prop() value: ISupplier;
  innerValue: ISupplier = {};
  supplierOptions: ISupplier[] = [];
  errorList: string[] = [];

  created() {
    this.getSupplierOptions();
  }

  mounted() {
    this.innerValue = this.value;
  }

  showEditBtn() {
    return this.$listeners && this.$listeners['edit-click'];
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  getSupplierOptions() {
    api.get('supplier/all').then(resp => {
      this.supplierOptions = resp.data;
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
