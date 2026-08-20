# 平台说明：Web

本文件仅用于**导航**：它指向需要获取的文档并标记跨文档差异。频道覆盖情况位于 SKILL.md；频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)；单个文档事实（语音/搜索支持、成员上限等）位于官方文档中。请从技能根目录运行：`rg chatui-web references/llms.txt`，然后运行 `bash scripts/fetch-docs.sh <path>`。⚠️ 约定定义在 SKILL.md 中。

## 获取文档前需要了解的跨文档差异

- Web Chat UI 的功能集在所有平台中最窄——`/chatui-web.md` 中的能力矩阵是缺失功能的事实来源（例如发送语音、消息搜索）。在承诺 Web 支持移动端已有功能前先检查该矩阵。
- Chat UI 以 **Web Components / 自定义元素**交付，而不是普通组件树；组件会锁定部分结构布局。如果用户需要这些布局变化，应接受锁定布局，或将该表面迁移到 Chat SDK。（参见 `components.md`、`chat-ui/layout.md`。）

## 文档路径（按需获取）

- 核心：`/chatui-web.md`（能力矩阵——语音/搜索/成员限制在此），`/chatui-web/quickstart.md`，`/chatui-web/chat-ui/switch.md`（功能开关）
- 个人资料/数据：`/chatui-web/user/hooks.md`、`/chatui-web/user/overview.md`、`/chatui-web/user/update.md`
- UI/布局：`/chatui-web/components.md`、`/chatui-web/chat-ui/layout.md`、`/chatui-web/chat-ui/editor.md`
- 发现其他文档：从技能根目录运行 `rg chatui-web references/llms.txt`
