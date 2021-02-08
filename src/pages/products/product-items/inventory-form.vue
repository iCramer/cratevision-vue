<template>
  <div>
    <div class="row">
      <div class="col">
        <input-field name="available" inputType="number" label="Available" v-model.number="innerValue.available" />
      </div>
      <div class="col">
        <input-field label="On Hand" name="onhand" inputType="number" v-model.number="innerValue.onhand" />
      </div>
      <div class="col">
        <input-field label="Reserved" name="reserved" inputType="number" v-model.number="innerValue.reserved" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <warehouse-select v-model="innerValue.warehouse" :showEdit="showEdit" @edit-click="$emit('edit-click')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { InputField, AppButton, SelectBox, WarehouseSelect } from '@/components';
import api from '@/api';
import { IInventory, IWarehouse } from '@/interfaces';

@Component({
  components: {
    InputField,
    AppButton,
    SelectBox,
    WarehouseSelect
  }
})
export default class InventoryForm extends Vue {
  @Prop() value: IInventory;
  @Prop({default: true}) showEdit: boolean;
  innerValue: IInventory = {};

  @Watch('innerValue', {deep: true})
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value', {deep: true})
  valueChange() {
    this.innerValue = this.value;
  }

  mounted() {
    this.innerValue = this.value;
  }
}

</script>
