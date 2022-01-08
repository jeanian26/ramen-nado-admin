import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',

    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/Dashboard',
    name: 'DashBoard',

    component: () => import('../views/DashBoard.vue')
  },
  {
    path: '/Orders',
    name: 'Orders',

    component: () => import('../views/Orders.vue')
  },
  {
    path: '/Orders/:key/:id',
    name: 'OrderItem',

    component: () => import('../views/OrderItem.vue')
  },
  {
    path: '/Menu',
    name: 'Menu',

    component: () => import('../views/Menu.vue')
  },
  {
    path: '/Menu/:key',
    name: 'MenuList',

    component: () => import('../views/MenuList.vue')
  },
  {
    path: '/newitem',
    name: 'NewItem',

    component: () => import('../views/NewItem.vue')
  },
  {
    path: '/newcategory',
    name: 'NewCategory',

    component: () => import('../views/NewCategory.vue')
  },
  {
    path: '/editcategory/:key',
    name: 'EditCategory',

    component: () => import('../views/EditCategory.vue')
  },
  {
    path: '/Menu/:category/:key',
    name: 'editItem',

    component: () => import('../views/editItem.vue')
  },
  {
    path: '/cart',
    name: 'cart',

    component: () => import('../views/Cart.vue')
  },
  {
    path: '/users',
    name: 'users',

    component: () => import('../views/users.vue')
  },
  {
    path: '/users/:userID',
    name: 'usersProfile',

    component: () => import('../views/SingleUser.vue')
  },
  {
    path: '/profile',
    name: 'profile',

    component: () => import('../views/Profile.vue')
  },
  {
    path: '/invoice/:orderID/:userID',
    name: 'invoice',

    component: () => import('../views/invoice.vue')
  },
  {
    path: '/paypal/:status',
    name: 'paypal',

    component: () => import('../views/paypal.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
