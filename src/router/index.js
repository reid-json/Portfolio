import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AppPage from '../views/App.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/app', name: 'App', component: AppPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router