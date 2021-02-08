import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router';
import './icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VeeValidate from 'vee-validate';
import Toast from './plugins/toast/';
import Tooltip from 'vue-directive-tooltip';
import '@/filters';
import VCalendar from 'v-calendar';

Vue.use(Tooltip, {
  delay: 0
});

Vue.config.productionTip = false;

Vue.use(VueRouter);

Vue.use(VCalendar);

Vue.use(Toast);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VeeValidate, {
  classes: true
});

export const EventBus = new Vue();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
