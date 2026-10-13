# IM SDK 功能清单使用规则

功能清单用于快速定位各端 IMKit/IMLib 的能力边界、官方功能页和首次支持版本；它不能替代功能页中的 API、限制、套餐和平台细节。回答能力、版本、兼容性或升级问题时，必须继续获取清单指向的功能页并完整阅读相关章节。

## 官方清单路径

| 平台 | IMKit | IMLib |
| --- | --- | --- |
| Android | `/android-imkit/feature-list.md` | `/android-imlib/feature-list.md` |
| iOS | `/ios-imkit/feature-list.md` | `/ios-imlib/feature-list.md` |
| Web | `/web-im-kit/feature-list.md` | `/web-imlib/feature-list.md` |
| Flutter | `/flutter-imkit/feature-list.md` | `/flutter-imlib/feature-list.md` |
| React Native | —（无官方 IMKit） | 按 `/react-native-imlib/` 各功能页和版本说明核对 |
| uni-app | `/uni-app-imkit/feature-overview.md` | 按 `/uni-app-imlib/` 各功能页和版本说明核对 |

从技能根目录执行 `bash scripts/fetch-docs.sh <清单路径>` 获取并阅读缓存。确认缓存是目标 Markdown 文档而非 HTML 首页；传统清单标题为 `# 功能列表`，uni-app IMKit 的概览标题为 `# 功能概览`。React Native 和 uni-app IMLib 没有可用的专属清单，应读取对应功能页和版本说明。

### 使用规则

1. 在清单中定位功能分类和首次支持版本；未列出的能力不得推断为“始终支持”或“不支持”。
2. 读取“文档”列中的功能页路径，继续执行 `bash scripts/fetch-docs.sh <path>` 并阅读缓存。
3. 按平台读取 Gradle、CocoaPods/SPM、`package.json`/lockfile 或 `pubspec.yaml`/lockfile，确认已安装 SDK 与版本；功能版本要求未满足时，先提出升级方案并说明影响。
4. 将清单版本号视为对应平台客户端 SDK 版本；`dev`、`stable` 或细分版本能力必须按清单备注区分。
5. 清单中的“始终支持”仍需阅读功能页确认目标会话类型、套餐、权限、厂商限制和平台差异。
6. 实现后输出能力依据：功能名、清单版本结论、功能页路径和已安装版本。

若 `rg "feature-list|功能列表" references/llms.txt` 搜索不到，不要推断路径不存在；继续使用技能脚本获取。若网络失败且无缓存，功能判断标记为“待文档复核”。
