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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',

    component: () => import(/* webpackChunkName: "about" */ '../views/ResetPassword.vue')
  },
  {
    path: '/Dashboard',
    name: 'DashBoard',

    component: () => import(/* webpackChunkName: "about" */ '../views/DashBoard.vue')
  },
  {
    path: '/Orders',
    name: 'Orders',

    component: () => import(/* webpackChunkName: "about" */ '../views/Orders.vue')
  },
  {
    path: '/Orders/:key/:id',
    name: 'OrderItem',

    component: () => import(/* webpackChunkName: "about" */ '../views/OrderItem.vue')
  },
  {
    path: '/Menu',
    name: 'Menu',

    component: () => import(/* webpackChunkName: "about" */ '../views/Menu.vue')
  },
  {
    path: '/Menu/:key',
    name: 'MenuList',

    component: () => import(/* webpackChunkName: "about" */ '../views/MenuList.vue')
  },
  {
    path: '/newitem',
    name: 'NewItem',

    component: () => import(/* webpackChunkName: "about" */ '../views/NewItem.vue')
  },
  {
    path: '/newcategory',
    name: 'NewCategory',

    component: () => import(/* webpackChunkName: "about" */ '../views/NewCategory.vue')
  },
  {
    path: '/editcategory/:key',
    name: 'EditCategory',

    component: () => import(/* webpackChunkName: "about" */ '../views/EditCategory.vue')
  },
  {
    path: '/Menu/:category/:key',
    name: 'editItem',

    component: () => import(/* webpackChunkName: "about" */ '../views/editItem.vue')
  },
  {
    path: '/cart',
    name: 'cart',

    component: () => import(/* webpackChunkName: "about" */ '../views/Cart.vue')
  },
  {
    path: '/users',
    name: 'users',

    component: () => import(/* webpackChunkName: "about" */ '../views/users.vue')
  },
  {
    path: '/profile',
    name: 'profile',

    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
