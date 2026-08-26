import * as RongIMLib from '@rongcloud/imlib-next';
import { ensureIMLibInit } from './core';
import { APP_KEY, TEST_TOKEN } from './config';

export const ConversationType = RongIMLib.ConversationType;
export const MessageDirection = RongIMLib.MessageDirection;

/**
 * 连接融云 IM(纯 IMLib 场景)。
 * 所有会话/消息接口必须在连接成功后调用。
 */
export async function connectIM() {
  if (!APP_KEY || !TEST_TOKEN) {
    throw new Error('请先在 src/im/config.js 中填写 APP_KEY 与 TEST_TOKEN');
  }
  ensureIMLibInit();
  const { code, data } = await RongIMLib.connect(TEST_TOKEN);
  if (code !== RongIMLib.ErrorCode.SUCCESS) {
    const err = new Error(`IM 连接失败,错误码: ${code}`);
    err.code = code;
    throw err;
  }
  return data.userId;
}

export function disconnectIM() {
  return RongIMLib.disconnect();
}

/** 监听连接状态,返回解绑函数 */
export function onConnectionStatus(onChange) {
  const { Events } = RongIMLib;
  const handlers = {
    [Events.CONNECTING]: () => onChange('connecting'),
    [Events.CONNECTED]: () => onChange('connected'),
    [Events.SUSPEND]: (code) => onChange('suspend', code),
    [Events.DISCONNECT]: (code) => onChange('disconnected', code),
  };
  Object.entries(handlers).forEach(([evt, fn]) => RongIMLib.addEventListener(evt, fn));
  return () => {
    Object.entries(handlers).forEach(([evt, fn]) => RongIMLib.removeEventListener(evt, fn));
  };
}

/** 监听新消息(在线消息与离线补偿消息都从这里回调),返回解绑函数 */
export function onMessages(listener) {
  const handler = (evt) => listener(evt.messages);
  RongIMLib.addEventListener(RongIMLib.Events.MESSAGES, handler);
  return () => RongIMLib.removeEventListener(RongIMLib.Events.MESSAGES, handler);
}

/**
 * 监听会话变更(新消息、未读数、置顶等都会触发),返回解绑函数。
 * 官方建议:会话列表首次主动拉取一次,后续依赖该事件增量合并,
 * 不要在每次收发消息时重复调用 getConversationListByTimestamp。
 */
export function onConversationChange(listener) {
  const handler = (evt) => listener(evt.conversationList.map((state) => state.conversation));
  RongIMLib.addEventListener(RongIMLib.Events.CONVERSATION, handler);
  return () => RongIMLib.removeEventListener(RongIMLib.Events.CONVERSATION, handler);
}

/**
 * 分页拉取远端会话列表(Web 端数据来自融云服务端,需开通「单群聊消息云端存储」)。
 * startTime 传 0 获取最新一页;翻页时传上一页最后一条会话 latestMessage.sentTime。
 */
export async function fetchConversations({ startTime = 0, count = 20 } = {}) {
  const res = await RongIMLib.getConversationListByTimestamp({ startTime, count });
  if (!res.isOk) {
    const err = new Error(`获取会话列表失败,错误码: ${res.code}`);
    err.code = res.code;
    throw err;
  }
  return res.data || [];
}

/**
 * 拉取远端历史消息(需开通「单群聊消息云端存储」)。
 * timestamp 传 0 表示从当前时间向前取;翻页时传当前已加载最早一条消息的 sentTime。
 * 返回的 list 按时间升序,可直接向前插入;hasMore 标识是否还有更早消息。
 */
export async function fetchHistoryMessages(conversation, { timestamp = 0, count = 20 } = {}) {
  const res = await RongIMLib.getHistoryMessages(conversation, { timestamp, count, order: 0 });
  if (res.code !== RongIMLib.ErrorCode.SUCCESS) {
    const err = new Error(`获取历史消息失败,错误码: ${res.code}`);
    err.code = res.code;
    throw err;
  }
  return { list: res.data.list || [], hasMore: res.data.hasMore };
}

/**
 * 发送文本消息。onSendBefore 回调返回带 messageId 的消息对象,
 * 可先渲染到列表,再根据发送结果更新状态。
 */
export function sendTextMessage(conversation, content, { onSendBefore } = {}) {
  const message = new RongIMLib.TextMessage({ content });
  return RongIMLib.sendMessage(conversation, message, { onSendBefore });
}

/** 清除指定会话未读数(进入会话详情时调用) */
export function clearUnread(conversation) {
  return RongIMLib.clearMessagesUnreadStatus(conversation);
}
