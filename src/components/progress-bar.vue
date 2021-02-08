<template>
  <div class="progress-bar">
    <progress :value="value" :class="progressStyle" max="100"></progress>
    <span class="progress-caption" v-if="label">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
  @Prop({default: 50}) value: number;
  @Prop({default: 'info'}) progressStyle: string;
  @Prop() label: string;
}

</script>
