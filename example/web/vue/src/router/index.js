import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/imlib' },
  // 纯 IMLib 实现:单群聊会话列表 + 会话详情 + 远端历史消息
  { path: '/imlib', component: () => import('../IMLib.vue') },
  // Web IMKit 示例(开箱即用 UI)
  { path: '/imkit', component: () => import('../ImKit.vue') },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
