<template>
  <transition name="fade">
    <div class="tab-item-content" v-if="active">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Tab extends Vue {
  @Prop() title: string;
  @Prop() tabKey: string;
  active: boolean = false;
}

</script>
