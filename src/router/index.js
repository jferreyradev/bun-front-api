import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import UsersView from '../views/UsersView.vue'
import ReportsView from '../views/ReportsView.vue'
import ConfigView from '../views/ConfigView.vue'
import SqlView from '../views/SqlView.vue'
import ProceduresView from '../views/ProceduresView.vue'
import IPSSTView from '../views/IPSSTView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
    },
    {
      path: '/sql',
      name: 'sql',
      component: SqlView,
    },
    {
      path: '/procedures',
      name: 'procedures',
      component: ProceduresView,
    },
     {
      path: '/IPSST',
      name: 'IPSST',
      component: IPSSTView,
    }
  ],
})

export default router
