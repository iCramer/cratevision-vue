<template>
  <div id="app" class="d-flex flex-row">
    <side-nav v-if="isLogin()" />
    <div class="flex-grow-2">
      <top-bar v-if="isLogin()" />
      <main :class="{'logged-in': isLogin()}">
        <router-view />
      </main>
    </div>
    <toast-container />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SideNav, TopBar } from './components';
import ToastContainer from './plugins/toast/toast-container.vue';

@Component({
  components: {
    SideNav,
    TopBar,
    ToastContainer
  }
})
export default class App extends Vue {
  isLogin() {
    const path = this.$route.path;
    return path !== '/login' && path !== '/register';
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';
</style>
