# RongCloud IM Integration Skill

用于快速集成[融云即时通讯（IM）](https://www.rongcloud.cn/product/im) 的 coding agent 技能。本技能指导 AI 编程助手完成即时通讯集成，包括频道类型选择、IMLib 与 IMKit 决策、平台配置、凭据管理、推送通知和常见集成模式。

**支持平台：** Android、iOS、Web、Flutter

## 快速链接

- [注册/登录融云控制台](https://console.rongcloud.cn/agile/register) 获取 App Key
- [官方文档](https://docs.rongcloud.cn/)
- [Demo 应用](https://sealtalk-cn.wegenmi.com/#/?channel=direct)
- [融云官网](https://www.rongcloud.cn/)

## 使用场景

融云 IM 组件库能力全面，可轻松构建丰富多样的聊天场景，满足不同业务需求。无论是一对一的陌生人社交、熟人好友互动，还是类似微信的多人群聊；无论是高效的客服沟通，还是团队协作所需的多人小组讨论，都能通过一套组件快速实现，让您专注业务创新，提升沟通效率。

## 核心能力

- **用户管理**：管理用户资料和好友关系，获取用户在线状态。
- **会话管理**：提供会话列表管理，支持会话删除、置顶、免打扰、未读数等会话管理能力。
- **消息已读**：针对单聊、群聊场景，支持消息已读状态展示。
- **丰富消息类型**：支持文本、表情、图片、语音、视频、文件和自定义消息。
- **消息操作**：支持消息撤回、删除、编辑、回复、表情回应和转发功能，同时支持获取消息历史及消息搜索功能。
- **服务端实时回调**：提供消息发送、用户在线状态、资料设置和群组操作事件等多个回调能力。
- **广播通知**：向全部用户、在线用户、指定标签用户或指定用户发送通知。
- **内容审核与安全**：实时审核消息内容并识别风险内容。

## 安装

使用 Skills CLI 安装 rongcloud-im：

~~~bash
npx skills add https://github.com/rongcloud/rongcloud-skills.git --skill rongcloud-im
~~~

## 快速开始

安装后，让 coding agent 使用 rongcloud-im 技能完成集成任务。例如：

> 使用 rongcloud-im 技能将融云 IM 集成到当前项目。

为了获得更准确的实现结果，请同时提供目标平台和聊天场景。

## 使用流程

集成融云 IM 时，按以下顺序执行：

1. 从项目文件识别目标平台和现有 SDK 状态。
2. 根据成员数量、消息持久化和实时性需求选择频道类型。
3. 优先评估 IMKit；需要自定义界面或 IMKit 未覆盖的频道类型时使用 IMLib。
4. 先阅读官方文档确认初始化、连接和消息流程，再根据已安装 SDK 验证具体 API。
5. 使用 App Key 初始化客户端；App Secret、签名逻辑和 Token 生成必须保留在服务端。

### 频道选择

| 使用场景 | 推荐频道 | 主要能力 |
| --- | --- | --- |
| 一对一私密会话 | 单聊 | 离线消息和推送通知 |
| 小型团队、兴趣群组、客户服务 | 群组 | 支持最多 3,000 名成员 |
| 大型社区、论坛、公会和组织 | 超级群 | 无成员数量限制，支持子频道 |
| 直播聊天和临时活动 | 聊天室 | 仅在线消息，适合高并发实时互动 |

详细能力对比请参阅[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)。

## 贡献

欢迎提交贡献。创建 Issue 或 Pull Request 前：

- 可复现的问题请使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md)。
- 文档、技能或示例变更请使用 [Pull Request 模板](.github/PULL_REQUEST_TEMPLATE.md)。
- 在适当时新增或更新测试，保持现有 API 行为，并清楚描述面向用户的变更。

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。
