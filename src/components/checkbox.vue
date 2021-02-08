<template>
  <label class="checkbox-label" :for="name">
    <font-awesome-icon v-if="checked" class="checkbox-icon checkbox-checked" icon="check-circle" size="lg" />
    <font-awesome-icon v-if="!checked" class="checkbox-icon" :icon="['far', 'circle']" size="lg" />
    <input type="checkbox" :name="name" :checked="checked" @change="onChange" />
    <slot></slot>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Checkbox extends Vue {
  @Prop() name: string;
  @Prop() value: any;
  @Prop({default: false}) checked: boolean;

  onChange(evt: any) {
    this.$parent.$emit('change', evt.target.checked, this.value);
  }
}
</script>
