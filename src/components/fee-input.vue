<template>
  <div class="fee-input">
    <multi-select label="Fees" :value="selectedFees" @input="onChange" :displayValue="true" :options="feeOptions" valueProp="amount" :withSearch="true">
      <app-button size="xs" btnStyle="link" class="sub-input-btn" @click="$emit('edit-click')">Edit Fee Options</app-button>
    </multi-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MultiSelect from './multi-select.vue';
import AppButton from './button.vue';
import api from '@/api';
import { IFee } from '@/interfaces';
import { EventBus } from '@/main';

@Component({
  components: { MultiSelect, AppButton }
})
export default class FeeInput extends Vue {
  @Prop() value: IFee[];
  feeOptions: IFee[] = [];
  selectedFees: IFee[] = [];

  created() {
    this.getFees();
    this.selectedFees = this.value;
    EventBus.$on('fees-updated', () => {
      this.getFees();
    });
  }

  @Watch('value')
  valueChange() {
    this.selectedFees = this.value;
  }

  onChange(evt) {
    this.$emit('input', evt);
  }

  getFees() {
    api.get('fee/all').then(resp => {
      this.feeOptions = resp.data;
    })
    .catch(error => {

    });
  }
}
</script>
