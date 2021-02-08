<template>
  <select-box name="warehouse" :withSearch="true" label="Warehouse" v-model="innerValue" :options="warehouseOptions">
    <app-button v-if="showEditBtn()" size="xs" class="sub-input-btn" btnStyle="info-link" @click="$emit('edit-click')">Edit Warehouses</app-button>
  </select-box>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectBox from './select-box.vue';
import AppButton from './button.vue';
import { IWarehouse } from '@/interfaces';
import api from '@/api';

@Component({
  components: { SelectBox, AppButton }
})
export default class WarehouseSelect extends Vue {
  @Prop() value: IWarehouse;
  @Prop({default: true}) showEdit: boolean;
  innerValue: IWarehouse = {};
  warehouseOptions: IWarehouse[] = [];
  errorList: string[] = [];

  created() {
    this.getWarehouseOptions();
  }

  mounted() {
    this.innerValue = this.value;
  }

  showEditBtn() {
    return this.showEdit && (this.$listeners && this.$listeners['edit-click']);
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  getWarehouseOptions() {
    api.get('warehouse/all').then(resp => {
      this.warehouseOptions = resp.data;
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
