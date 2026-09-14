# 平台说明：React Native

本文件仅用于导航。请从技能根目录运行 `rg 'react-native-imlib' references/llms.txt`，再用 `bash scripts/fetch-docs.sh <path>` 获取目标文档。React Native 当前使用融云 IMLib 原生桥接 SDK；官方没有 React Native IMKit，不能按 Android/iOS/Web IMKit 的组件流程推断 React Native 能力。单个 API、参数和版本仍以按需获取的官方文档及项目安装版本为准。

## 已核实的平台差异

- 依赖包为 `@rongcloud/react-native-im-wrapper`，导出 `RCIMIWEngine` 和 `RCIMIWEngineOptions`。
- 环境要求：`react` >= 16.0.0，`react-native` >= 0.60；接口语言为 TypeScript。
- 官方版本矩阵当前列出 React Native IMLib 5.2.x；实际项目以 `package.json`/lockfile 和发行说明为准。
- 初始化使用 `RCIMIWEngine.create(appKey, options)`，然后设置消息/连接状态监听并调用 `connect(token, timeout, callback)`。
- IMLib 只提供能力 API，不提供聊天 UI；会话列表、聊天页、消息气泡和输入框由应用实现。
- SDK 具备重连机制，一个应用生命周期通常只调用一次 `connect()`；返回 `31004` 时应由应用服务端重新获取 Token，避免无限重试。
- App Secret、签名逻辑和 Token 生成必须留在应用服务端。客户端只请求服务端 Token 并传给 SDK。

## 文档路径（按需获取）

- 核心：`/react-native-imlib.md`、`/react-native-imlib/import.md`、`/react-native-imlib/init.md`、`/react-native-imlib/quickstart.md`、`/react-native-imlib/release-notes.md`
- 连接与生命周期：`/react-native-imlib/connection/connect.md`、`/react-native-imlib/connection/listener.md`、`/react-native-imlib/connection/disconnect.md`、`/react-native-imlib/connection/reconnect-kick.md`
- 会话与消息：`/react-native-imlib/conversation/intro.md`、`/react-native-imlib/conversation/get.md`、`/react-native-imlib/message/introduction.md`、`/react-native-imlib/message/send.md`、`/react-native-imlib/message/receive.md`
- 业务类型：`/react-native-imlib/group/overview.md`、`/react-native-imlib/ultragroup/overview.md`、`/react-native-imlib/chatroom/overview.md`
- 推送与高级能力：`/react-native-imlib/push/summary.md`、`/react-native-imlib/engine_config.md`、`/react-native-imlib/moderation/overview.md`
- API 参考：<https://doc.rongcloud.cn/apidoc/imlib-react-native/latest/zh_CN/>
- 官方 Demo：<https://github.com/rongcloud/rongcloud-react-native-im-wrapper>

React Native 未在官方文档索引中提供可用的专属功能清单；涉及首次支持版本或能力边界时，应直接获取对应功能页和版本说明，无法确认的结论标记为“待文档复核”，不得用其他平台清单代替。
