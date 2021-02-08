<template>
  <div class="toast">
    <span :class="['toast-style', `toast-${toastStyle}`]">
      <font-awesome-icon class="toast-icon" :icon="getIcon()" size="2x" />
    </span>
    <div class="toast-content">
      <app-button className="toast-close" size="xs" btnStyle="link" @click="$emit('remove', index)" icon="times" />
      <h6 v-if="title" class="toast-title">{{ title }}</h6>
      <p class="toast-body">{{ body }}</p>
      <app-button v-if="route" :route="route" btnStyle="link">{{ linkLabel }}</app-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AppButton } from '@/components';

@Component({
  components: { AppButton }
})
export default class Toast extends Vue {
  @Prop() toastStyle: string;
  @Prop() title: string;
  @Prop() body: string;
  @Prop() route: string;
  @Prop() linkLabel: string;
  @Prop() index: number;

  getIcon() {
    let icon: string;
    switch(this.toastStyle) {
      case 'success':
        icon = 'check-circle';
        break;
      case 'error':
        icon = 'exclamation-circle';
        break;
      case 'info':
        icon = 'info-circle';
        break;
    }
    return ['far', icon];
  }
}
</script>
