<template>
  <div class="imlib-page">
    <div v-if="status !== 'connected'" class="imlib-placeholder">
      <p v-if="status === 'error'">IM 连接失败:{{ errorMsg }}</p>
      <p v-else>正在连接融云 IM 服务…</p>
    </div>

    <template v-else>
      <!-- 左栏:会话列表 -->
      <aside class="conv-panel">
        <form class="conv-new" @submit.prevent="openNewConversation">
          <select v-model.number="newConvType">
            <option :value="ConversationType.PRIVATE">单聊</option>
            <option :value="ConversationType.GROUP">群聊</option>
          </select>
          <input v-model.trim="newConvTargetId" placeholder="用户 ID / 群组 ID" />
          <button type="submit">发起会话</button>
        </form>

        <ul class="conv-list">
          <li
            v-for="conv in conversations"
            :key="convKey(conv)"
            :class="{ active: current && convKey(conv) === convKey(current) }"
            @click="selectConversation(conv)"
          >
            <div class="conv-row">
              <span class="conv-name">{{ conversationName(conv) }}</span>
              <span class="conv-time">{{ formatTime(conv.latestMessage?.sentTime) }}</span>
            </div>
            <div class="conv-row">
              <span class="conv-digest">{{ messageDigest(conv.latestMessage) }}</span>
              <span v-if="conv.unreadMessageCount > 0" class="conv-unread">
                {{ conv.unreadMessageCount > 99 ? '99+' : conv.unreadMessageCount }}
              </span>
            </div>
          </li>
        </ul>

        <button
          v-if="convHasMore"
          class="conv-more"
          :disabled="convLoading"
          @click="loadMoreConversations"
        >
          {{ convLoading ? '加载中…' : '加载更多会话' }}
        </button>
        <p v-if="!conversations.length" class="conv-empty">
          暂无会话,可在上方输入对方 ID 发起会话
        </p>
      </aside>

      <!-- 右栏:会话详情 -->
      <section class="chat-panel">
        <template v-if="current">
          <header class="chat-header">
            {{ conversationName(current) }}
            <small>(我:{{ currentUserId }})</small>
          </header>

          <div ref="messageListEl" class="msg-list">
            <button
              v-if="historyHasMore"
              class="msg-more"
              :disabled="historyLoading"
              @click="loadHistory(false)"
            >
              {{ historyLoading ? '加载中…' : '加载更早消息' }}
            </button>

            <div
              v-for="msg in messages"
              :key="msg.__localId || msg.messageUId"
              class="msg-item"
              :class="isSelf(msg) ? 'self' : 'peer'"
            >
              <div v-if="!isSelf(msg)" class="msg-sender">{{ msg.senderUserId }}</div>
              <div class="msg-bubble">{{ messageDigest(msg) }}</div>
              <div class="msg-meta">
                <span v-if="msg.__status === 'sending'">发送中…</span>
                <span v-else-if="msg.__status === 'failed'" class="msg-failed">发送失败</span>
                <span v-else>{{ formatTime(msg.sentTime) }}</span>
              </div>
            </div>
          </div>

          <footer class="chat-input">
            <textarea
              v-model="draft"
              rows="2"
              placeholder="输入消息,Enter 发送"
              @keydown.enter.exact.prevent="handleSend"
            />
            <button :disabled="sending || !draft.trim()" @click="handleSend">发送</button>
          </footer>
        </template>

        <div v-else class="chat-empty">选择左侧会话,或发起新会话开始聊天</div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import {
  ConversationType,
  MessageDirection,
  clearUnread,
  connectIM,
  fetchConversations,
  fetchHistoryMessages,
  onConnectionStatus,
  onConversationChange,
  onMessages,
  sendTextMessage,
} from './im/imlib-service';

const CONV_PAGE_SIZE = 20;
const HISTORY_PAGE_SIZE = 20;

const status = ref('connecting');
const errorMsg = ref('');
const currentUserId = ref('');

const conversations = ref([]);
const convHasMore = ref(false);
const convLoading = ref(false);

const current = ref(null);
const messages = ref([]);
const historyHasMore = ref(false);
const historyLoading = ref(false);

const draft = ref('');
const sending = ref(false);
const newConvType = ref(ConversationType.PRIVATE);
const newConvTargetId = ref('');

const messageListEl = ref(null);
let localIdSeed = 0;
const unbinders = [];

const convKey = (conv) => `${conv.conversationType}_${conv.targetId}`;

function conversationName(conv) {
  // 示例未接入用户/群组资料服务,直接展示 targetId;实际业务中在此处映射昵称/群名
  const label = conv.conversationType === ConversationType.GROUP ? '群' : '单';
  return `[${label}] ${conv.targetId}`;
}

function messageDigest(message) {
  if (!message) return '';
  if (message.messageType === 'RC:TxtMsg') return message.content?.content ?? '';
  if (message.messageType === 'RC:ImgMsg') return '[图片]';
  if (message.messageType === 'RC:VcMsg' || message.messageType === 'RC:HQVCMsg') return '[语音]';
  if (message.messageType === 'RC:FileMsg') return '[文件]';
  return `[${message.messageType}]`;
}

function isSelf(message) {
  return message.messageDirection === MessageDirection.SEND;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return hm;
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hm}`;
}

function sortConversations() {
  conversations.value.sort((a, b) => {
    if (!!a.isTop !== !!b.isTop) return a.isTop ? -1 : 1;
    return (b.latestMessage?.sentTime || 0) - (a.latestMessage?.sentTime || 0);
  });
}

/** 会话变更事件增量合并(官方建议:首次拉取后靠事件更新,勿反复调远端列表接口) */
function mergeConversations(list) {
  list.forEach((conv) => {
    const idx = conversations.value.findIndex((c) => convKey(c) === convKey(conv));
    if (idx >= 0) {
      conversations.value[idx] = conv;
    } else {
      conversations.value.push(conv);
    }
    // 正在查看的会话不累计未读
    if (current.value && convKey(conv) === convKey(current.value) && conv.unreadMessageCount > 0) {
      conv.unreadMessageCount = 0;
      clearUnread({ conversationType: conv.conversationType, targetId: conv.targetId });
    }
  });
  sortConversations();
}

async function loadConversations() {
  convLoading.value = true;
  try {
    const list = await fetchConversations({ startTime: 0, count: CONV_PAGE_SIZE });
    conversations.value = list;
    convHasMore.value = list.length >= CONV_PAGE_SIZE;
    sortConversations();
  } catch (err) {
    console.warn('[IMLib] 获取会话列表失败:', err);
  } finally {
    convLoading.value = false;
  }
}

async function loadMoreConversations() {
  if (convLoading.value) return;
  // 翻页:以当前最后一条会话最新消息的 sentTime 作为下一页起始时间
  const last = conversations.value[conversations.value.length - 1];
  const startTime = last?.latestMessage?.sentTime;
  if (!startTime) {
    convHasMore.value = false;
    return;
  }
  convLoading.value = true;
  try {
    const list = await fetchConversations({ startTime, count: CONV_PAGE_SIZE });
    const fresh = list.filter(
      (conv) => !conversations.value.some((c) => convKey(c) === convKey(conv)),
    );
    conversations.value.push(...fresh);
    convHasMore.value = list.length >= CONV_PAGE_SIZE;
    sortConversations();
  } catch (err) {
    console.warn('[IMLib] 加载更多会话失败:', err);
  } finally {
    convLoading.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    const el = messageListEl.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

async function selectConversation(conv) {
  if (current.value && convKey(conv) === convKey(current.value)) return;
  current.value = conv;
  messages.value = [];
  historyHasMore.value = false;
  conv.unreadMessageCount = 0;
  clearUnread({ conversationType: conv.conversationType, targetId: conv.targetId });
  await loadHistory(true);
}

/** 拉取远端历史消息;initial 为 true 表示进入会话后的首屏加载 */
async function loadHistory(initial) {
  if (historyLoading.value || !current.value) return;
  const key = convKey(current.value);
  const conv = {
    conversationType: current.value.conversationType,
    targetId: current.value.targetId,
  };
  // 翻页边界:当前已加载最早一条消息的 sentTime;首屏传 0 表示从当前时间向前取
  const timestamp = initial ? 0 : messages.value[0]?.sentTime || 0;
  const el = messageListEl.value;
  const prevScrollHeight = el ? el.scrollHeight : 0;

  historyLoading.value = true;
  try {
    const { list, hasMore } = await fetchHistoryMessages(conv, {
      timestamp,
      count: HISTORY_PAGE_SIZE,
    });
    // 请求期间已切换会话,丢弃结果
    if (!current.value || convKey(current.value) !== key) return;
    const sorted = [...list].sort((a, b) => a.sentTime - b.sentTime);
    messages.value = [...sorted, ...messages.value];
    historyHasMore.value = hasMore;
    await nextTick();
    if (initial) {
      scrollToBottom();
    } else if (el) {
      // 向前补历史后保持视口停留在原位置
      el.scrollTop = el.scrollHeight - prevScrollHeight;
    }
  } catch (err) {
    console.warn('[IMLib] 获取历史消息失败:', err);
  } finally {
    historyLoading.value = false;
  }
}

function openNewConversation() {
  const targetId = newConvTargetId.value;
  if (!targetId) return;
  const existing = conversations.value.find(
    (c) => c.conversationType === newConvType.value && c.targetId === targetId,
  );
  selectConversation(
    existing || {
      conversationType: newConvType.value,
      targetId,
      latestMessage: null,
      unreadMessageCount: 0,
    },
  );
  newConvTargetId.value = '';
}

async function handleSend() {
  const content = draft.value.trim();
  if (!content || !current.value || sending.value) return;
  const conv = {
    conversationType: current.value.conversationType,
    targetId: current.value.targetId,
  };
  let localId = null;
  sending.value = true;
  draft.value = '';
  try {
    const res = await sendTextMessage(conv, content, {
      onSendBefore: (message) => {
        localId = `local-${++localIdSeed}`;
        messages.value.push({ ...message, __localId: localId, __status: 'sending' });
        scrollToBottom();
      },
    });
    const idx = messages.value.findIndex((m) => m.__localId === localId);
    if (res.code === 0 && res.data) {
      if (idx >= 0) messages.value[idx] = { ...res.data, __localId: localId };
      else messages.value.push(res.data);
      scrollToBottom();
    } else {
      console.warn('[IMLib] 消息发送失败,错误码:', res.code);
      if (idx >= 0) messages.value[idx].__status = 'failed';
      draft.value = content;
    }
  } finally {
    sending.value = false;
  }
}

/** 新消息:属于当前会话则追加;会话列表由 CONVERSATION 事件负责刷新 */
function handleIncomingMessages(list) {
  if (!current.value) return;
  const key = convKey(current.value);
  const incoming = list.filter(
    (m) =>
      `${m.conversationType}_${m.targetId}` === key &&
      !messages.value.some((exist) => exist.messageUId && exist.messageUId === m.messageUId),
  );
  if (!incoming.length) return;
  messages.value.push(...incoming);
  clearUnread({
    conversationType: current.value.conversationType,
    targetId: current.value.targetId,
  });
  scrollToBottom();
}

onMounted(async () => {
  unbinders.push(
    onConnectionStatus((s) => {
      if (s === 'connected') status.value = 'connected';
    }),
    onMessages(handleIncomingMessages),
    onConversationChange(mergeConversations),
  );
  try {
    currentUserId.value = await connectIM();
    status.value = 'connected';
    await loadConversations();
  } catch (err) {
    status.value = 'error';
    errorMsg.value = err.message;
  }
});

onUnmounted(() => {
  // 切换示例走 location 整页跳转,连接随页面卸载自动释放,这里只解绑监听
  unbinders.forEach((off) => off());
});
</script>

<style scoped>
.imlib-page {
  display: flex;
  height: 100%;
  min-height: 0;
  font-size: 14px;
  color: #1f2329;
}

.imlib-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #666;
}

/* 会话列表 */
.conv-panel {
  display: flex;
  flex-direction: column;
  width: 280px;
  border-right: 1px solid #e5e5e5;
  background: #f7f8fa;
}

.conv-new {
  display: flex;
  gap: 6px;
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
}

.conv-new input {
  flex: 1;
  min-width: 0;
  padding: 4px 6px;
}

.conv-list {
  flex: 1;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.conv-list li {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.conv-list li:hover {
  background: #eef1f5;
}

.conv-list li.active {
  background: #e1eaff;
}

.conv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.conv-name {
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.conv-time {
  flex-shrink: 0;
  color: #999;
  font-size: 12px;
}

.conv-digest {
  overflow: hidden;
  color: #86909c;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.conv-unread {
  flex-shrink: 0;
  min-width: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #f53f3f;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

.conv-more {
  margin: 8px;
  padding: 6px;
}

.conv-empty {
  padding: 16px;
  color: #999;
  font-size: 12px;
  text-align: center;
}

/* 会话详情 */
.chat-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
}

.chat-header small {
  margin-left: 8px;
  color: #999;
  font-weight: 400;
}

.msg-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
}

.msg-more {
  display: block;
  margin: 0 auto 12px;
  padding: 4px 12px;
}

.msg-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  max-width: 70%;
}

.msg-item.self {
  align-items: flex-end;
  align-self: flex-end;
  margin-left: auto;
}

.msg-item.peer {
  align-items: flex-start;
}

.msg-sender {
  margin-bottom: 2px;
  color: #86909c;
  font-size: 12px;
}

.msg-bubble {
  padding: 8px 12px;
  border-radius: 8px;
  background: #f2f3f5;
  word-break: break-word;
  white-space: pre-wrap;
}

.msg-item.self .msg-bubble {
  background: #d3e3fd;
}

.msg-meta {
  margin-top: 2px;
  color: #c0c4cc;
  font-size: 11px;
}

.msg-failed {
  color: #f53f3f;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #e5e5e5;
}

.chat-input textarea {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: none;
  font: inherit;
}

.chat-input button {
  align-self: flex-end;
  padding: 6px 18px;
}

.chat-empty {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
