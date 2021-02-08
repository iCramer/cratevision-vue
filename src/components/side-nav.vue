<template>
  <nav id="side-nav">
    <div class="nav-overlay"></div>
    <div id="logo">
      <img src="@/assets/logoHorizontal.png" />
    </div>
    <h6 class="nav-section-title">Products</h6>
    <ul class="flex-column">
      <li>
        <router-link to="/dashboard">
          <font-awesome-icon :icon="['far', 'user-chart']" size="xs" />
          <span>Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/products">
          <font-awesome-icon :icon="['far', 'box-full']" size="xs" />
          <span>Products</span>
        </router-link>
      </li>
      <li>
        <router-link to="/product-orders">
          <font-awesome-icon :icon="['far', 'shipping-fast']" size="xs" />
          <span>Product Orders</span>
        </router-link>
      </li>
    </ul>
    <h6 class="nav-section-title">Configuration</h6>
    <ul class="flex-column">
      <li>
        <router-link to="/configuration">
          <font-awesome-icon :icon="['far', 'sliders-h']" size="xs" />
          <span>Configuration</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SideNav extends Vue {

}

</script>
