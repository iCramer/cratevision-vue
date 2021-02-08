<template>
  <modal :title="title" :open="open">
    <slot></slot>
    <button-group>
      <app-button :linkBtn="true" @click="$emit('cancel')">Cancel</app-button>
      <app-button @click="$emit('confirm')">Do it</app-button>
    </button-group>
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Modal, AppButton, ButtonGroup } from '@/components';

@Component({
  components: { Modal, AppButton, ButtonGroup }
})
export default class ConfirmationModal extends Vue {
  @Prop({default: 'Confirm'}) title: string;
  @Prop({default: false}) open: boolean;
}

</script>
