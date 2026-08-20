# 平台说明：Android

本文件仅用于**导航**：它指向需要获取的文档并标记跨文档差异。频道覆盖情况位于 SKILL.md；频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)；单个文档事实位于官方文档中。请从技能根目录运行：`rg chatui-android references/llms.txt`，然后运行 `bash scripts/fetch-docs.sh <path>`。⚠️ 约定定义在 SKILL.md 中。

## 获取文档前需要了解的跨文档差异

- **频道置顶**与 iOS 不同：Android Chat UI 内置长按置顶/取消置顶；iOS 仅显示已置顶频道，操作需要 Chat SDK。（比较两个平台的 `features/stick-to-top.md`。）

## 文档路径（按需获取）

- 核心：`/chatui-android.md`、`/chatui-android/import.md`、`/chatui-android/init.md`、`/chatui-android/android-os-version.md`、[发行说明](https://docs.rongcloud.cn/chatui-android/release-notes)
- 个人资料：`/chatui-android/user/userinfo.md`
- 频道列表：`/chatui-android/key-functions/conversation-list.md`、`/chatui-android/customization/conversation-list-data-processor.md`
- 功能：`/chatui-android/features/` → `message-mention.md`、`message-receipt.md`、`online-status.md`、`stick-to-top.md`、`typing-status.md`
- Chat SDK（聊天室 / 超级群 / 消息置顶）：`/chatsdk-android.md`
