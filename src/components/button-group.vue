<template>
  <div :class="getClassSet()">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ButtonGroup extends Vue {
  @Prop({default: 'right'}) align: string;

  getClassSet() {
    return [
      'button-group',
      {
        'align-right': this.align === 'right',
        'align-center': this.align === 'center',
        'align-justified': this.align === 'justify'
      }
    ];
  }
}
</script>
