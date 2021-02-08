<template>
  <select-box name="status" :withSearch="true" label="Status" v-model="innerValue" :options="statusOptions"></select-box>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectBox from './select-box.vue';
import { IStatus } from '@/interfaces';
import api from '@/api';

@Component({
  components: { SelectBox }
})
export default class StatusSelect extends Vue {
  @Prop() value: IStatus;
  innerValue: IStatus = {};
  statusOptions: IStatus[] = [];
  errorList: string[] = [];

  created() {
    this.getStatusOptions();
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  getStatusOptions() {
    api.get('status/all').then(resp => {
      this.statusOptions = resp.data;
    }).catch(error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
