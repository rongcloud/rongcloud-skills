# 平台说明：uni-app

本文件仅用于导航。请从技能根目录运行 `rg 'uni-app-imkit|uni-app-imlib' references/llms.txt`，再用 `bash scripts/fetch-docs.sh <path>` 获取目标文档。uni-app 有两条互斥的融云集成路径：基于 Web IMLib 的 uni-app IMKit，或基于 Android/iOS 原生插件的 uni-app IMLib。单个 API、参数、平台限制和版本仍以按需获取的官方文档及项目安装版本为准。

## 方案选择与平台差异

### uni-app IMKit（Web IMLib + RCUIKit）

- 提供会话列表、聊天、转发、视频播放和消息阅读状态等页面；RCUIKit 源码随 Demo 交付，可按官方入口定制。
- 官方支持 Android、iOS、H5、微信小程序；抖音小程序从 1.1.0 起支持。配置要求为 HBuilderX >= 4.57、Node.js >= 18、TypeScript >= 5.1，支持 Vue 2 和 Vue 3。
- 官方版本矩阵当前列出 uni-app IMLib 5.4.x；IMKit 以其自身发行说明为准，实际项目以依赖锁定版本为准。
- 依赖 `@rongcloud/engine`、`@rongcloud/imlib-next`、`@rongcloud/imkit-store`；在 `App.vue` 初始化 Web IMLib，再初始化 `RCKitStoreInstaller`。
- 页面需要在 `pages.json` 注册 RCUIKit 路由，并按官方说明配置 `manifest.json` 的网络超时、媒体模块和平台权限。
- IMKit 提供单聊/群聊会话 UI；超级群、聊天室等未覆盖类型需使用 Web IMLib API，并遵循 Web IMLib 的会话流程。

### uni-app IMLib（原生插件）

- 适用于 Android/iOS 原生 App，不提供聊天 UI；页面和交互由应用实现。
- 在 DCloud 插件市场安装原生插件 `RCUniIMV2`（插件 ID 9227），在 `manifest.json` 添加后制作自定义调试基座；再安装 `RongCloud-IMWrapper-V2`（插件 ID 9225）并从 `@/uni_modules/RongCloud-IMWrapper-V2/js_sdk/RCIMEngine` 导入。
- 初始化使用 `RCIMIWEngine.create(appKey, options)`，设置消息/连接监听后调用 `connect(token, timeout, callback)`；`RCIMIWEngineOptions` 可配置数据中心、导航、文件、统计和推送开关。
- 原生插件方案不能与 uni-app IMKit 同时使用。需要 H5/小程序 UI 时选 IMKit；需要原生 IMLib 能力（例如聊天室或超级群）时选原生插件，并自行实现 UI。
- 官方迁移说明指出 5.2.4、5.4.0 存在较大接口/回调变化，升级时必须阅读迁移文档并核对项目版本。

两种方案都遵守同一安全规则：App Secret、签名逻辑和 Token 生成仅部署在应用服务端，客户端只请求服务端 Token 并传给 SDK。

## 文档路径（按需获取）

- IMKit 核心：`/uni-app-imkit.md`、`/uni-app-imkit/quickstart.md`、`/uni-app-imkit/feature-overview.md`、`/uni-app-imkit/release-notes.md`
- IMKit 页面与定制：`/uni-app-imkit/ui-pages/overview.md`、`/uni-app-imkit/ui-pages/conversation.md`、`/uni-app-imkit/ui-customization/message-components.md`、`/uni-app-imkit/ui-customization/input-area.md`、`/uni-app-imkit/business-data/userinfo.md`
- IMKit 推送：`/uni-app-imkit/push/summary.md`、`/uni-app-imkit/push/integration.md`（仅 Android/iOS）
- IMLib 核心：`/uni-app-imlib.md`、`/uni-app-imlib/import.md`、`/uni-app-imlib/init.md`、`/uni-app-imlib/quickstart.md`、`/uni-app-imlib/migrate-imlib.md`
- IMLib 连接与生命周期：`/uni-app-imlib/connection/connect.md`、`/uni-app-imlib/connection/listener.md`、`/uni-app-imlib/connection/disconnect.md`、`/uni-app-imlib/connection/reconnect-kick.md`
- IMLib 会话与消息：`/uni-app-imlib/conversation/intro.md`、`/uni-app-imlib/conversation/get.md`、`/uni-app-imlib/message/introduction.md`、`/uni-app-imlib/message/send.md`、`/uni-app-imlib/message/receive.md`
- API 参考：<https://doc.rongcloud.cn/apidoc/imlib-uniapp/latest/zh_CN/>
- IMKit Demo/源码：<https://github.com/rongcloud/rc-uikit-uniapp>
- IMLib Demo/源码：<https://github.com/rongcloud/im-uni-app-wrapper>

uni-app IMLib 未在官方索引中提供可用的专属功能清单；能力判断应获取对应功能页和版本说明。uni-app IMKit 使用 `feature-overview.md` 及页面/组件文档作为能力入口，不能把原生插件能力自动视为 IMKit 内置能力。
