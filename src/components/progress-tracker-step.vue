<template>
  <div v-show="active">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressTrackerStep extends Vue {
  @Prop() title: string;
  @Prop() stepKey: string;
  @Prop() validate: Function;
  complete = false;
  active: boolean = false;
}

</script>
