---
name: nexconn-chat
description: >-
  指导 Nexconn Chat 集成决策，包括频道选择（单聊、群组、超级群、聊天室）、SDK 选择（Chat SDK 或 Chat UI）、平台配置、凭据管理和推送通知。构建聊天/消息功能、实现即时通讯、选择频道类型、集成 Chat SDK 或 Chat UI、分析即时通讯截图，或咨询消息能力时使用。
version: 1.0.1
last_updated: 2026-08-06
---

# Nexconn Chat 集成技能

将本技能作为 Nexconn Chat 任务入口。先路由请求并确认范围，再按需加载参考文档。

## 集成路由

**关键**：每个集成请求都必须加载 [SDK 集成决策框架](references/sdk-integration-decision-framework.md)。先识别项目平台和现有 SDK 状态，阅读官方文档并检查已安装 SDK 产物，再执行五层判断。用户明确选择 Chat UI 或 Chat SDK 时，将其视为约束；切换前必须解释权衡并获得同意。记录决策层级后才能实现。

| 构建内容 | 推荐方式 | 详情 |
| --- | --- | --- |
| 一对一私聊 | Chat SDK/UI + 单聊 | 通过频道指南查询能力 |
| 小型群组、客服（≤3000 人） | Chat SDK/UI + 群组 | 通过频道指南查询能力 |
| 大型社区、论坛、公会 | Chat SDK + 超级群 | 通过频道指南查询能力 |
| 实时聊天室、临时活动 | Chat SDK + 聊天室 | 通过频道指南查询能力 |
| 快速上线、标准即时通讯体验 | Chat UI | `integration-workflow.md` |
| 自定义 UI、深度定制 | Chat SDK | `integration-workflow.md` |
| 平台专属配置 | 阅读对应平台说明 | `platform-setup/index.md` |
| 凭据/Token 管理 | 参阅凭据参考 | `credentials-and-token.md` |

对单聊/群组优先使用各平台 Chat UI；仅当 Chat UI 不覆盖目标频道类型时回退到 Chat SDK。确定方案前始终交叉检查下面的覆盖表。

## Chat UI 频道覆盖情况

Chat UI 在各平台只内置支持部分频道类型。未覆盖的类型使用 Chat SDK。`⚠️ 未验证` 表示没有官方文档确认，不要说成“不支持”。

| 平台 | 单聊 | 群组 | 超级群 | 聊天室 | 系统（只读） |
| --- | --- | --- | --- | --- | --- |
| Web | ✅ | ✅ | ❌ 使用 Chat SDK | ❌ 使用 Chat SDK | ✅ |
| Android | ✅ | ✅ | ❌ 使用 Chat SDK | ❌ 使用 Chat SDK | ✅ |
| iOS | ✅ | ✅ | ❌ 使用 Chat SDK | ❌ 使用 Chat SDK | ✅ |
| Flutter | ✅ | ✅ | ❌ 使用 Chat SDK | ❌ 使用 Chat SDK | ✅ |

混合请求（例如 Web 群组 + 聊天室）应对覆盖部分使用 Chat UI，其余使用 Chat SDK，并明确拆分。

## 频道能力

对于成员上限、离线存储/推送、@ 提及、已读回执、未读数、编辑/回复/转发、仅自己删除/全员删除、频道删除/服务端解散、子频道、置顶和可靠性等问题，获取并阅读频道指南：

1. `bash scripts/fetch-docs.sh /guides/realtime-chat/intro-chat/im-feature-basic.md`
2. 阅读 `references/cache/guides/realtime-chat/intro-chat/im-feature-basic.md`
3. 网络失败时使用现有信息，并标记待验证。

频道指南未记录的能力（消息置顶、表情回应、在线状态/最后上线时间等）在验证前都属于未验证能力。注意：删除频道只从当前用户列表移除会话；解散频道会从服务端为所有人移除。Telegram 广播频道与 Nexconn 聊室不同：前者离线持久化并推送，后者仅在线；单向广播场景默认推荐**群组 + 基于角色的发送权限**。

## 关键规则

- 所有集成请求都必须在写代码前获取并完整阅读官方文档。
- 不要在客户端放 App Secret、签名逻辑或 Token 生成代码。
- 先读官方文档，再用安装包验证 API 签名、枚举、类型和版本差异；不能凭类型定义逆向流程。
- 文档与安装代码冲突时按安装版本实现并说明；无法确认的细节标为待复核。
- 默认生成 UI 文案和 Chat UI 语言为 `en_US`，除非用户或项目另有约定。
- 集成验证期间默认 `NCEngine.initialize` 日志级别为 Debug，生产前提醒改为 WARN/ERROR。
- 登录、注册、2FA、二维码登录属于应用层；Chat SDK 只消费服务端 Token。
- 截图中的竞品品牌、营销页面和水印丢弃；Chat 与通话/会议混合时拆分，通话部分转 Nexconn Call。

## 范围外

| 用户关键词 | 处理方式 |
| --- | --- |
| 视频会议、会议 | 非 Nexconn Chat，建议联系 https://www.rongcloud.cn/contact-us |
| 直播/视频流 | 非 Chat；若需求是直播文字互动，使用聊天室 |
| 音视频通话、1v1 视频 | 非 Chat 消息能力，建议联系支持 |
| 登录、注册、二维码、手机登录、2FA | 应用认证；Chat 只消费服务端 Token |
| 营销页、应用商店页、第三方品牌外壳 | 非 SDK 集成表面，截图分析时丢弃 |

部分需求在范围内时，只处理 Chat 消息部分，并明确分离非 Chat 能力。

## 分流流程

```
用户请求
  │
  ├─ 第 1 步：术语规范化
  ├─ 第 2 步：范围检查（通话、会议、认证、营销页等）
  └─ 第 3 步：分类并执行
       ├─ 咨询：查官方能力和限制，回答并停止
       └─ 集成：先获取平台快速入门文档，再识别项目、验证 SDK、执行五层决策并实现
```

咨询类不执行完整五层流程，除非用户询问实现方式。集成类必须以文档获取为第一步，并在响应中记录“第 X 层：……”。截图请求先按 `image-analysis-guide.md` 清点、丢弃、拆分认证/通话和去重；全部丢弃时按无截图处理。

## 术语规范化

1. 在 `references/llms.txt` 中搜索 Chat/Call 术语表路径。
2. 运行 `bash scripts/fetch-docs.sh <path>` 获取术语表并阅读缓存。
3. 保留用户业务意图；若规范化会改变范围，只说明一次；无法确定时提出一个简短问题。

## 参考文档

| 文件 | 用途 | 触发条件 |
| --- | --- | --- |
| `sdk-integration-decision-framework.md` | 五层集成决策 | 每个集成请求 |
| `integration-workflow.md` | 项目识别、文档验证、实现和测试 | 集成请求 |
| `chat-ui-repositories.md` | Chat UI 源码仓库 | 进入第 4 层且用户批准源码修改 |
| `platform-setup/<platform>.md` | 平台文档路径和差异 | 已知目标平台 |
| `credentials-and-token.md` | App Key、App Secret、Token 和安全规则 | 处理凭据 |
| `application-layer-rules.md` | 编辑窗口、撤回窗口、提及和过滤 | 请求包含应用层规则 |
| `feature-pattern-map.md` | 现代即时通讯功能分层 | 截图/原型包含高级功能 |
| `image-analysis-guide.md` | 截图识别与批处理 | 用户提供截图 |
| `llms.txt` | 官方文档索引 | 需要定位文档路径 |
| `api-references.md` | 官方 API 链接 | 询问具体方法、类型、事件或属性 |

## 文档索引搜索速查

`llms.txt` 较大，使用 `rg` 搜索而不要从头通读：

- 术语表：`Chat glossary`、`Call glossary`
- 快速入门：`quickstart`、`Send your first message`
- 多设备同步：`multi-device`、`multiple-client-sync`
- 已读回执：`read receipt`
- @ 提及：`mention`
- 自定义消息：`custom message`
- Chat UI 扩展：`hooks`、`theme`、`customize`
- Token/签名：`token`、`signing`
- 错误码：`status codes`

搜索不到时，分段阅读索引或提出一个简短澄清问题，不要猜测。
