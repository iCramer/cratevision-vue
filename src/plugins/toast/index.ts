import ToastContainer from './toast-container.vue';
import { events } from './events';

export default {
  install(Vue) {
    Vue.component('toast-container', ToastContainer);

    let getMessage = (toast) => {
      if (typeof toast === 'string') {
        return { body: toast };
      }
      else {
        return toast;
      }
    }

    Vue.prototype.$toast = {
      success: (toast) => {
        events.$emit('add', { ...getMessage(toast), title: "Success!", style: 'success' });
      },
      error: (toast) => {
        events.$emit('add', { ...getMessage(toast), title: "Uh oh...", style: 'error' });
      },
      info: (toast) => {
        events.$emit('add', { ...getMessage(toast), title: 'FYI', style: 'info' });
      }
    }
  }
}
