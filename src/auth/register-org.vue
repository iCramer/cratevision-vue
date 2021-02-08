<template>
    <div class="row auth">
      <div class="col">
        <div class="parallels1"></div>
        <div class="parallels2"></div>
        <img src="../assets/CrateVisionLogo.png" />
      </div>
      <div class="col">
        <div id="register">
          <h2>New Organization</h2>
          <error-banner v-model="errorList" />
          <progress-tracker @submit="submitOrg" :showCancel="false">
            <progress-tracker-step title="Create User" stepKey="createUser" @next-click="submitUser" :validate="validate.user">
              <validation-observer ref="user" slim>
                <form @submit.prevent="submitForm">
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6">
                        <input-validate label="First Name" rules="required" name="firstName" v-model.trim="user.firstName" />
                      </div>
                      <div class="col-md-6">
                        <input-validate label="Last Name" rules="required" name="lastName" v-model.trim="user.lastName" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="password" inputType="password" rules="required" vid="password" label="Password" v-model.trim="user.password" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="confirmPassword" inputType="password" rules="required|confirmed:password" label="Confirm Password" v-model.trim="user.confirmPassword" data-vv-as="password" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="email" rules="required|email" label="Email" v-model.trim="user.userName" />
                      </div>
                    </div>
                  </div>
                </form>
              </validation-observer>
            </progress-tracker-step>
            <progress-tracker-step title="Create Organization" stepKey="createOrg" :validate="validate.createOrg">
              <validation-observer ref="createOrg" slim>
                <form @submit.prevent="submitOrg">
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6">
                        <input-validate label="Name" rules="required" name="name" v-model.trim="org.name" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="phone" rules="required" label="Phone" v-model="org.phone" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="addressLine1" rules="required" label="Address Line 1" v-model.trim="org.address.addressLine1" />
                      </div>
                      <div class="col-md-6">
                        <input-field name="addressLine2" label="Address Line 2" v-model.trim="org.address.addressLine2" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="city" rules="required" label="City" v-model.trim="org.address.city" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="state" rules="required" label="State" v-model="org.address.state" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="zipCode" rules="required" label="Zip Code" v-model.trim="org.address.zipCode" />
                      </div>
                      <div class="col-md-6">
                        <input-validate name="country" rules="required" label="Country" v-model.trim="org.address.country" />
                      </div>
                    </div>
                  </div>
                </form>
              </validation-observer>
            </progress-tracker-step>
          </progress-tracker>
          <p class="auth-subtext">
            Already a member?
            <app-button size="xs" btnStyle="info-link" route="/login">Log In</app-button>
          </p>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { InputField, InputValidate, Panel, AppButton, ProgressTracker, ProgressTrackerStep, ErrorBanner } from '@/components';
import api from '@/api';
import { IOrganization, IUser, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import deepCopy from '@/utils';

@Component({
  components: {
    InputField,
    Panel,
    AppButton,
    InputValidate,
    ValidationObserver,
    ProgressTracker,
    ProgressTrackerStep,
    ErrorBanner
  }
})
export default class RegisterOrg extends Vue {
  org: IOrganization = { address: {} };
  user: IUser = {};
  errorList: string[] = [];
  validate = {
    user: undefined,
    createOrg: undefined
  }
  newUserId: number;

  mounted() {
    this.validate.user = (this.$refs.user as VForm).validate;
    this.validate.createOrg = (this.$refs.createOrg as VForm).validate;
  }

  submitUser() {
    (this.$refs.user as VForm).validate().then( valid => {
      if(valid) {
        let body = deepCopy(this.user);
        delete body.confirmPassword;
        api.post('/user/', body).then(resp => {
          const token = resp.headers.authorization;
          sessionStorage.setItem('jwt', token);
          this.newUserId = resp.data.id;
        }).catch( error => {
          this.errorList.push(error.response.data.message);
        });
      }
    });
  }

  submitOrg() {
    (this.$refs.orgIfno as VForm).validate().then( valid => {
      if(valid) {
        api.post('organization/', this.org).then(resp => {
          let body = { id: this.newUserId, org: { id: resp.data.id } };
          api.put('user', body).then(resp => {
            this.$router.push('/dashboard');
          }).catch( error => {
            this.errorList.push(error.response.data.message);
          });
        }).catch( error => {
          this.errorList.push(error.response.data.message);
        });
      }
    });
  }
}
</script>
