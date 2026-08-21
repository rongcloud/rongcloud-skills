# 平台说明：Android

本文件仅用于**导航**：它指向需要获取的文档并标记跨文档差异。频道覆盖情况位于 SKILL.md；频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)；单个文档事实位于官方文档中。请从技能根目录运行：`rg android-imkit references/llms.txt`，然后运行 `bash scripts/fetch-docs.sh <path>`。⚠️ 约定定义在 SKILL.md 中。

## 获取文档前需要了解的跨文档差异

- **频道置顶**与 iOS 不同：Android IMKit 内置长按置顶/取消置顶；iOS 仅显示已置顶频道，操作需要 IMLib。（比较两个平台的 `features/stick-to-top.md`。）

## 文档路径（按需获取）

- 核心：`/android-imkit.md`、`/android-imkit/import.md`、`/android-imkit/init.md`、`/android-imkit/android-os-version.md`、[发行说明](https://docs.rongcloud.cn/android-imkit/release-notes)
- 个人资料：`/android-imkit/user/userinfo.md`
- 频道列表：`/android-imkit/key-functions/conversation-list.md`、`/android-imkit/customization/conversation-list-data-processor.md`
- 功能：`/android-imkit/features/` → `message-mention.md`、`message-receipt.md`、`online-status.md`、`stick-to-top.md`、`typing-status.md`
- IMLib（聊天室 / 超级群 / 消息置顶）：`/chatsdk-android.md`
