import * as RongIMLib from '@rongcloud/imlib-next';
import * as RCIMKit from '@rongcloud/im-kit';
import { TEST_TOKEN } from './config';
import { ensureIMLibInit } from './core';
import { hooks } from './hooks';

let kitApp = null;

/**
 * 初始化 IMLib + Web IMKit 并建立 IM 连接。
 * 成功返回 { kitApp, userId },失败抛出携带错误码的异常。
 */
export async function initIM({ onStatusChange } = {}) {
  if (kitApp) {
    return { kitApp, userId: kitApp.getCurrentUserId() };
  }

  // 1. 初始化 IMLib(与 IMLib 示例页共用初始化守卫,全生命周期仅 init 一次)
  ensureIMLibInit();

  // 2. 初始化 Web IMKit,传入 Hooks
  kitApp = RongIMLib.installPlugin(RCIMKit.RCKitInstaller, {
    hooks,
    // 集成验证期间输出 DEBUG 日志,上线前请改为 RongIMLib.LogL.WARN
    logLevel: RongIMLib.LogL.DEBUG,
    language: 'zh_CN',
  });

  if (!kitApp) {
    throw new Error('Web IMKit 插件安装失败,请检查 SDK 版本是否匹配');
  }

  // 3. 关闭会话置顶:从会话菜单中移除「置顶 / 取消置顶」菜单项
  const conversationMenu = kitApp.cloneConversationMenu().filter(
    (item) =>
      item.id !== RCIMKit.RCKitConversationMenuID.ADD_TOP &&
      item.id !== RCIMKit.RCKitConversationMenuID.REMOVE_TOP,
  );
  kitApp.setConversationMenu(conversationMenu);

  // 4. 结束配置,SDK 开始向浏览器注册 rc-* 自定义标签
  //    (如需预设开关、自定义菜单等“仅在 ready() 前调用生效”的配置,须在此之前完成)
  kitApp.ready();

  // 5. 监听连接状态,便于 UI 层展示
  RongIMLib.addEventListener(RongIMLib.Events.CONNECTED, () => {
    console.log('[IM] 连接成功');
    onStatusChange?.('connected');
  });
  RongIMLib.addEventListener(RongIMLib.Events.CONNECTING, () => {
    console.log('[IM] 连接中');
    onStatusChange?.('connecting');
  });
  RongIMLib.addEventListener(RongIMLib.Events.SUSPEND, (code) => {
    console.warn('[IM] 连接中断,等待自动重连,错误码:', code);
    onStatusChange?.('suspend');
  });
  RongIMLib.addEventListener(RongIMLib.Events.DISCONNECT, (code) => {
    console.warn('[IM] 连接已断开,错误码:', code);
    onStatusChange?.('disconnected');
  });

  // 6. 建立 IM 连接(IMKit 会自动处理断线重连)
  const { code, data } = await RongIMLib.connect(TEST_TOKEN);
  if (code !== RongIMLib.ErrorCode.SUCCESS) {
    const err = new Error(`IM 连接失败,错误码: ${code}`);
    err.code = code;
    throw err;
  }

  console.log('[IM] 当前登录用户 ID:', data.userId);
  return { kitApp, userId: data.userId };
}

/** 登出/切换账号时调用:断开连接并销毁 IMKit 实例 */
export function destroyIM() {
  if (!kitApp) return;
  RongIMLib.disconnect();
  kitApp.destroy();
  kitApp = null;
}
