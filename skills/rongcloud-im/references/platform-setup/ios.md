# 平台说明：iOS

本文件仅用于**导航**：它指向需要获取的文档并标记跨文档差异。频道覆盖情况位于 SKILL.md；频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)；单个文档事实位于官方文档中。请从技能根目录运行：`rg chatui-ios references/llms.txt`，然后运行 `bash scripts/fetch-docs.sh <path>`。⚠️ 约定定义在 SKILL.md 中。

## Cross-doc differences worth knowing before you fetch

- **频道置顶**与 Android 不同：iOS IMKit 仅显示已置顶频道，**没有内置置顶/取消置顶 UI**；操作需要 IMLib 频道 API。不要承诺 iOS 内置置顶 UI。（参见 `features/stick-to-top.md`。）
- **Data center**: defaults to Singapore — `areaCode` must be set explicitly when the App Key belongs elsewhere, or connection silently targets the wrong region. (See `init.md`.)

## Doc paths (fetch on demand)

- 核心：`/chatui-ios.md`、`/chatui-ios/import.md`、`/chatui-ios/init.md`、[发行说明](https://docs.rongcloud.cn/chatui-ios/release-notes)
- 个人资料：`/chatui-ios/user/userinfo.md`
- 频道列表：`/chatui-ios/key-functions/conversation-list.md`
- 功能：`/chatui-ios/features/` → `message-mention.md`、`message-receipt.md`、`online-status.md`、`stick-to-top.md`、`typing-status.md`
- IMLib（聊天室 / 超级群 / 置顶/取消置顶操作 / 消息置顶）：`/chatsdk-ios.md`
