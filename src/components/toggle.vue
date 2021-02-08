<template>
  <div class="toggle-group">
    <label><slot></slot></label>
    <label :class="['toggle', {'active': value}]" :id="name">
      <input type="checkbox" :name="name" :checked="value" @change="onChange" />
      <span class="toggle-switch"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Toggle extends Vue {
  @Prop() name: string;
  @Prop({default: false}) value: boolean;

  onChange(evt: any) {
    this.$emit('input', evt.target.checked);
  }
}
</script>
