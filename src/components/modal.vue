<template>
  <transition name="modal">
    <div class="modal" v-if="open" tabIndex="-1" role="dialog">
      <div :class="['modal-dialog', `modal-${size}`]" role="document">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
  @Prop({default: false}) open: boolean;
  @Prop() title: string;
  @Prop({default: 'md'}) size: string;

  @Watch('open')
  updateBody() {
    if (this.open) {
      document.body.classList.add('modal-open');
    }
    else {
      document.body.classList.remove('modal-open');
    }
  }
}

</script>
