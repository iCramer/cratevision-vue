<template>
  <span :class="['badge', 'badge-' + badgeStyle, 'badge-' + badgeType]">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Badge extends Vue {
  @Prop({default: 'secondary'}) badgeStyle: string;
  @Prop({default: 'pill'}) badgeType: string;
}
</script>
