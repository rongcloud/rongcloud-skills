<template>
  <main class="app-shell">
    <!-- 连接成功后渲染 IMKit 主界面(含会话列表 + 聊天区) -->
    <rc-imkit-app-provider v-if="status === 'connected'" class="im-app" />

    <div v-else class="im-placeholder">
      <p v-if="status === 'error'">IM 连接失败:{{ errorMsg }}</p>
      <p v-else>正在连接融云 IM 服务…</p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { initIM, destroyIM } from './im';

const status = ref('connecting');
const errorMsg = ref('');

onMounted(async () => {
  try {
    await initIM({
      onStatusChange: (s) => {
        // 断线重连期间保持界面挂载,仅首次连接前显示占位
        if (s === 'connected') status.value = 'connected';
      },
    });
    status.value = 'connected';
  } catch (err) {
    status.value = 'error';
    errorMsg.value = err.message;
  }
});

onUnmounted(() => {
  destroyIM();
});
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.app-shell {
  height: 100%;
}

.im-app {
  display: block;
  width: 100%;
  height: 100%;
}

.im-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 14px;
}
</style>
