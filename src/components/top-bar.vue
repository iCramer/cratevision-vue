<template>
  <header id="top-bar">
    <h4 id="top-bar-logo">{{userInfo.org.name}}</h4>
    <error-banner v-model="errorList" />
    <div class="right-content">
      <button type="button" class="top-bar-btn"><font-awesome-icon :icon="['far', 'bell']" /></button>
      <div class="avatar" ref="avatarMenu">
        <button type="button" class="avatar-btn" @click="avatarOpen = !avatarOpen">
          <span v-if="!userInfo.picture">{{initials}}</span>
          <data-image v-else :fileName="userInfo.picture.name" />
        </button>
        <transition name="fade">
          <div v-if="avatarOpen" class="avatar-dd">
            <div class="avatar-dd-header">
              <div class="avatar-header-image">
                <span v-if="!userInfo.picture">{{initials}}</span>
                <data-image v-else :fileName="userInfo.picture.name" />
              </div>
              <span class="name">{{userInfo.firstName}} {{userInfo.lastName}}</span>
              <span class="email">{{userInfo.username}}</span>
            </div>
            <ul class="avatar-dd-body">
              <li><app-button route="/user-settings" btnStyle="info-link" icon="user-cog">User Settings</app-button></li>
              <li><app-button btnStyle="info-link" icon="sign-out-alt" @click="logout">Logout</app-button></li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ErrorBanner from './error-banner.vue';
import AppButton from './button.vue';
import DataImage from './data-image.vue';
import api from '@/api';

@Component({
  components: { ErrorBanner, AppButton, DataImage }
})
export default class TopBar extends Vue {
  userInfo: any = {name: '', org: {name: ''}};
  avatarOpen = false;
  isLoggedIn = true;
  initials = '';
  errorList: string[] = [];

  created() {
    this.getUserInfo();
    document.addEventListener('click', this.outsideClick);
  }

  destroyed () {
    document.removeEventListener('click', this.outsideClick);
  }

  @Watch('$route')
  routeChange() {
    this.avatarOpen = false;
  }

  getUserInfo() {
    api.get('/user/').then( resp => {
      const user = resp.data;
      this.userInfo = user,
      this.initials = user.firstName.charAt(0) + user.lastName.charAt(0);
    }).catch( error => {
      this.errorList.push(error.response.data.message);
    });
  }

  outsideClick(evt) {
    let el: any = this.$refs.avatarMenu;
    let target = evt.target;
    if (el !== target && !el.contains(target)) {
      this.avatarOpen = false;
    }
  }

  logout() {
    sessionStorage.removeItem('jwt');
    this.$router.push('/login');
  }
}
</script>
