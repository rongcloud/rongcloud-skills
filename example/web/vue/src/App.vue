<template>
  <main class="app-shell">
    <nav class="app-nav">
      <a
        href="#/imlib"
        :class="{ 'router-link-active': isActive('/imlib') }"
        @click.prevent="go('/imlib')"
      >IMLib 自定义 UI</a>
      <a
        href="#/imkit"
        :class="{ 'router-link-active': isActive('/imkit') }"
        @click.prevent="go('/imkit')"
      >IMKit 示例</a>
    </nav>
    <RouterView class="app-view" />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';

const isActive = (path) => window.location.hash.startsWith(`#${path}`);

/**
 * IMKit 与 IMLib 两套示例通过 location 整页跳转切换:
 * 每个页面拥有独立的 SDK 初始化与连接生命周期,互不干扰。
 */
function go(path) {
  if (isActive(path)) return;
  window.location.hash = `#${path}`;
  window.location.reload();
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-nav {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fafafa;
  font-size: 14px;
}

.app-nav a {
  color: #666;
  text-decoration: none;
}

.app-nav a.router-link-active {
  color: #0f6dff;
  font-weight: 600;
}

.app-view {
  flex: 1;
  min-height: 0;
}
</style>
