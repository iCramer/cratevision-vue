<template>
  <validation-provider :rules="rules" :vid="vid" :mode="mode" :name="label" slim>
    <input-field
      slot-scope="{ errors, classes }"
      :validateClasses="classes"
      :label="label"
      :name="name"
      :inputType="inputType"
      v-model="innerValue"
      :errorMessages="errors"
      :numberStep="numberStep"
      @blur="onBlur"
    />
  </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider } from 'vee-validate';
import InputField from './input-field.vue';

@Component({
  components: { ValidationProvider, InputField }
})
export default class InputValidate extends Vue {
  @Prop({default: 'text'}) inputType: string;
  @Prop() label: string;
  @Prop({default: ''}) value: string | number;
  @Prop() name: string;
  @Prop() numberStep: number;
  @Prop({default: () => []}) errorMessages: any;
  @Prop() rules: string;
  @Prop() vid: string;
  @Prop({default: 'lazy'}) mode: string;
  innerValue: string | number = '';

  mounted() {
    this.innerValue = this.value;
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  onBlur(evt) {
    this.$emit('blur', evt);
  }
}
</script>
