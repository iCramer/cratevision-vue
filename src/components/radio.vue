<template>
  <label class="radio-label" :for="name">
    <input type="radio" :name="name" :value="radioValue" @input="onChange" :checked="checked" />
    <slot></slot>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Radio extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() radioValue: any;
  @Prop({default: false}) checked: boolean;

  onChange(evt: any) {
    this.$emit('input', this.radioValue, evt);
  }
}
</script>
