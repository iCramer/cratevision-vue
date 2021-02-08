<template>
    <validation-provider :rules="rules" :mode="mode" :name="label" slim>
      <select-box
        :name="name"
        :label="label"
        slot-scope="{ errors, classes }"
        :validateClasses="classes"
        :isRequired="isRequired"
        v-model="innerValue"
        :options="options"
        :errorMessages="errors"
        @blur="onBlur"
      />
    </validation-provider>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider } from 'vee-validate';
import SelectBox from './select-box.vue';

@Component({
  components: { ValidationProvider, SelectBox }
})
export default class SelectValidate extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() value: string | number;
  @Prop() options: Object[];
  @Prop({default: () => []}) errorMessages: any;
  @Prop() rules: string;
  @Prop({default: 'lazy'}) mode: string;
  innerValue: string | number = '';

  mounted() {
    this.innerValue = this.value;
  }

  isRequired() {
    return this.rules && this.rules.includes('required');
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  onBlur() {
    this.$emit('blur', this.innerValue);
  }
}
</script>
