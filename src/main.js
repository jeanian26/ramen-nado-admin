import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3Storage from "vue3-storage";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret,faBox,faMotorcycle,faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret,faMotorcycle,faUsers,faBox)
// createApp(App).use(router).use(Vue3Storage).component('font-awesome-icon',FontAwesomeIcon).mount('#app')


const app = createApp(App);
app.component('font-awesome-icon',FontAwesomeIcon)
app.use(router)
app.use(Vue3Storage)
app.mount('#app')
