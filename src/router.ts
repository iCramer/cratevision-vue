import VueRouter from 'vue-router';
import Dashboard from '@/pages/dashboard.vue';
import AllProducts from './pages/products/all-products.vue';
import Products from './pages/products/products.vue';
import NewProduct from './pages/products/new-product.vue';
import ProductDetails from './pages/products/product-details.vue';
import ProductInfo from './pages/products/product-info.vue';
import ProductOrderHistory from './pages/product-orders/product-order-history.vue';
import ProductOrderDetails from './pages/product-orders/product-order-details.vue';
import NewProductOrder from './pages/product-orders/new-product-order.vue';
import ProductItems from './pages/products/product-items.vue';
import Login from './auth/login.vue';
import RegisterOrg from './auth/register-org.vue';
import UserSettings from './pages/user-settings.vue';
import Configuration from './pages/configuration/configuration.vue';
import Warehouses from './pages/configuration/warehouses.vue';
import Statuses from './pages/configuration/statuses.vue';
import Fees from './pages/configuration/fees.vue';
import Suppliers from './pages/configuration/suppliers.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: RegisterOrg },
  { path: '/user-settings', name: 'UserSettings', component: UserSettings },
  { path: '/configuration', name: 'Configuration', component: Configuration, redirect: { name: 'Warehouses' },
    children: [
      { path: 'warehouses', name: 'Warehouses', component: Warehouses, props: true },
      { path: 'statuses', name: 'Statuses', component: Statuses, props: true },
      { path: 'fees', name: 'Fees', component: Fees, props: true },
      { path: 'suppliers', name: 'Suppliers', component: Suppliers, props: true }
    ]
  },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  { path: '/product-orders', name: 'ProductOrderHistory', component: ProductOrderHistory },
  { path: '/product-orders/new-product-order', name: 'NewProductOrder', component: NewProductOrder },
  { path: '/product-orders/:id', name: 'ProductOrderDetails', component: ProductOrderDetails },

  { path: '/products', name: 'Products', component: Products, redirect: { name: 'AllProducts' },
    children: [
      { path: 'all-products', name: 'AllProducts', component: AllProducts, props: true },
      { path: 'product-items', name: 'ProductItems', component: ProductItems, props: true }
    ]
  },
  { path: '/products/new-product', name: 'NewProduct', component: NewProduct },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true,
    children: [
      { path: 'product-info', name: 'ProductInfo', component: ProductInfo, props: true }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router;
