# 平台说明：Flutter

本文件仅用于**导航**：它指向需要获取的文档并标记跨文档差异。频道覆盖情况位于 SKILL.md；频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)；单个文档事实位于官方文档中。请从技能根目录运行：`rg chatui-flutter references/llms.txt`，然后运行 `bash scripts/fetch-docs.sh <path>`。⚠️ 约定定义在 SKILL.md 中。

## Cross-doc differences worth knowing before you fetch

- Chat UI **is** available on Flutter (package `ai_nexconn_chatui_plugin`) — both mounting the built-in Chat UI and building your own against Chat SDK are viable. Don't assume Flutter is Chat-SDK-only.
- The Chat UI package re-exports the SDK types the UI needs through a single entry point, so you rarely import the Chat SDK package directly. (See `init.md` / `import.md`.)
- **Customization is builder-based**, unlike the other platforms: Flutter splits into a *config* layer (`customization/config/`) and a *builder* layer (`customization/builder/`) for replacing widgets. (See `customization.md`.)
- Flutter Chat UI 内置**频道置顶**（`features/channel-pin.md`）——注意这里使用的路径是 `channel-pin.md`，而 Android/iOS/Web 使用 `stick-to-top.md`。

## Doc paths (fetch on demand)

- Core: `/chatui-flutter.md`, `/chatui-flutter/import.md`, `/chatui-flutter/init.md`, `/chatui-flutter/chatui-config-guide.md`, [release notes](https://docs.rongcloud.cn/chatui-flutter/release-notes)
- 关键功能：`/chatui-flutter/key-functions/` → `channel-list.md`、`chat-page.md`、`input.md`、`listener.md`
- Profile: `/chatui-flutter/user/userinfo.md`, `/chatui-flutter/user/group-info.md`
- 功能：`/chatui-flutter/features/` → `message-mention.md`、`message-forward.md`、`message-reference.md`、`channel-pin.md`、`unread.md`、`draft.md`、`voice-message.md`、`file-message.md`、`image-gif-message.md`、`short-video-message.md`、`delete-message-for-all.md`
- 定制：`/chatui-flutter/customization.md`、`customization/config/`（`channel-page.md`、`chat-page.md`、`input.md`、`bubble.md`）、`customization/builder/`（`channel-page.md`、`chat-page.md`、`message-bubble.md`）
- Chat SDK（聊天室 / 超级群 / 直接使用 SDK）：`/chatsdk-flutter.md`
- 发现未列出的文档：从技能根目录运行 `rg chatui-flutter references/llms.txt`
