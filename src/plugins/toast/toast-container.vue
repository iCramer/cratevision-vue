<template>
  <div class="toast-container">
    <transition-group name="fade">
      <toast
        v-for="(toast, index) in toasts"
        :title="toast.title"
        :body="toast.body"
        :toastStyle="toast.style"
        :route="toast.route"
        :linkLabel="toast.linkLabel"
        @remove="remove"
        :index="index"
        :key="`toast-${index}`"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { events } from './events';
import Toast from './toast.vue';

@Component({
  components: { Toast }
})
export default class ToastContainer extends Vue {
  toasts = [];

  mounted() {
    events.$on('add', this.add)
  }

  add(toast) {
    this.toasts.unshift(toast);
    setTimeout( () => {
      let index = this.toasts.indexOf(toast);
      this.remove(index)
    }, 8000);
  }

  remove(index) {
    this.toasts.splice(index, 1);
  }
}
</script>
