<template>
  <v-date-picker v-model="innerValue" color="green" :popover="{ visibility: 'click' }">
    <div class="form-group-wrapper">
      <div :class="['form-group with-icon', { 'form-group-filled': isFilled, 'form-group-focus': inFocus }]">
        <label v-if="label" :for="name" class="form-group-label">{{ label }}</label>
        <input :id="name" :name="name" class="form-group-control" placeholder="MM/DD/YYYY" :value="value" @input="onChange" @blur="onBlur" @focus="inFocus = true" />
        <font-awesome-icon :icon="['far', 'calendar-alt']" size="lg" class="input-icon" />
      </div>
    </div>
  </v-date-picker>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class DatePicker extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop({default: ''}) value: string;
  innerValue: string = '';
  isFilled = false;
  inFocus = false;

  mounted() {
    this.innerValue = this.value;
  }

  @Watch('innerValue')
  innerValueChange() {
    this.innerValue = this.innerValue ? moment(this.innerValue).format('MM/DD/YYYY') : '';
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value || '';
    this.isFilled = this.value && this.value.length > 0;
  }

  onChange(evt: any) {
    let value = evt.target.value;
    this.$emit('input', value, evt);
  }

  onBlur(evt: any) {
    let value = evt.target.value;
    this.$emit('blur', value);
    this.inFocus = false;
  }
}
</script>
