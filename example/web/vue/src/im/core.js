import * as RongIMLib from '@rongcloud/imlib-next';
import { APP_KEY } from './config';

let inited = false;

/**
 * IMLib 初始化守卫:融云要求 init 在应用全生命周期内仅执行一次,
 * IMKit 页面与纯 IMLib 页面共用此入口,避免路由切换时重复初始化。
 */
export function ensureIMLibInit() {
  if (inited) return;
  RongIMLib.init({
    appkey: APP_KEY,
    // 集成验证期间输出 DEBUG 日志,上线前请改为 RongIMLib.LogL.WARN
    logOutputLevel: RongIMLib.LogL.DEBUG,
  });
  inited = true;
}
