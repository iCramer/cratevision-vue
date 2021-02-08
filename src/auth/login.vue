<template>
  <div class="row auth">
    <div class="col">
      <div class="parallels1"></div>
      <div class="parallels2"></div>
      <img src="../assets/CrateVisionLogo.png" />
    </div>
    <div class="col">
      <div id="login">
        <h2>Login</h2>
        <form @submit.prevent="submitForm">
          <input-field label="Email" name="email" v-model.trim="email" icon="mailbox" />
          <input-field inputType="password" name="password" label="Password" v-model="password" icon="user-lock" />
          <app-button btnType="submit" size="lg" :centered="true">Submit</app-button>
        </form>
        <p class="auth-subtext">
          New to Crate Vision?
          <app-button size="xs" btnStyle="info-link" route="/register">Sign Up</app-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { InputField, Panel, AppButton } from '@/components';
import api from '@/api';

@Component({
  components: {
    InputField,
    Panel,
    AppButton
  }
})
export default class Login extends Vue {
  email: string = '';
  password: string = '';

  submitForm() {
    const body = { username: this.email, password: this.password };

    api.post('login', body).then(resp => {
      const token = resp.headers.authorization;
      sessionStorage.setItem('jwt', token);
      this.$router.push('/dashboard');
    }).catch( error => {
      console.log(error)
    });
  }
}
</script>
