<template>
  <div class="panel">
    <header v-if="title" class="panel-header">
      <h5 class="panel-title">{{title}}</h5>
      <slot name="utility"></slot>
    </header>
    <div class="panel-body">
      <div v-if="!title" class="panel-utility">
        <slot name="utility"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Panel extends Vue {
  @Prop() utility: any;
  @Prop() title: string;
}

</script>
