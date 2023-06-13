import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Main from '../components/Main.vue';
import Setting from '../components/Setting.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
