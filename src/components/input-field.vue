<template>
  <div class="form-group-wrapper">
    <div :class="['form-group', validateClasses, { 'form-group-filled': isFilled, 'form-group-focus': inFocus, 'with-icon': icon }]">
      <label v-if="label" :for="name" class="form-group-label">{{ label }}<font-awesome-icon class="asterisk" icon="asterisk" /></label>
      <textarea v-if="inputType === 'textarea'" class="form-group-control" :placeholder="placeholder" :id="name" :name="name" :value="value" @input="onChange" @blur="onBlur" @focus="inFocus = true"></textarea>
      <input v-else :id="name" :name="name" class="form-group-control" :placeholder="placeholder" :type="inputType" :value="value" @input="onChange" :step="numberStep" @blur="onBlur" @focus="inFocus = true" />
      <font-awesome-icon v-if="icon" :icon="icon" size="lg" class="input-icon" />
    </div>
    <span class="validation-error">{{ errorMessages[0] }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class InputField extends Vue {
  @Prop({default: 'text'}) inputType: string;
  @Prop() label: string;
  @Prop() name: string;
  @Prop() value: any;
  @Prop() numberStep: number;
  @Prop({default: () => []}) errorMessages: any;
  @Prop() validateClasses: any;
  @Prop() placeholder: string;
  @Prop() icon: string;
  isFilled = false;
  inFocus = false;

  @Watch('value')
  onValueChange() {
    this.isFilled = this.value && (this.value || this.value.length > 0);
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
