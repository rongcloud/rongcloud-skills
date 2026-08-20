# 平台说明：Web

本文件仅用于导航。请从技能根目录运行 `rg 'web-im-kit|web-imlib' references/llms.txt`，再用 `bash scripts/fetch-docs.sh <path>` 获取目标文档。⚠️ 约定定义在 SKILL.md 中。

## 获取文档前需要了解的跨文档差异

- 国内 Web IMKit 包为 `@rongcloud/im-kit`；同时依赖版本匹配的 `@rongcloud/engine` 与 `@rongcloud/imlib-next`。
- 默认语言是 `zh_CN`。公开扩展能力包括 Hooks、事件、自定义组件、消息气泡和菜单；实现前以对应文档核对版本要求。
- 使用 Web IMKit 时通过 IMKit 的消息接口发送消息，避免绕过其 UI 状态更新。

## 文档路径（按需获取）

- 核心：`/web-im-kit.md`、`/web-im-kit/quickstart.md`、`/web-im-kit/release-notes.md`
- 用户资料/数据：`/web-im-kit/user/hooks.md`、`/web-im-kit/user/overview.md`、`/web-im-kit/user/update.md`
- UI/扩展：`/web-im-kit/components/overview.md`、`/web-im-kit/components/override-component.md`、`/web-im-kit/chat-ui/message-bubble.md`、`/web-im-kit/chat-ui/editor.md`
- IMLib：`/web-imlib/import.md`、`/web-imlib/init.md`、`/web-imlib/quickstart.md`
