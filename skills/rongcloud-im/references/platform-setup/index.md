# Nexconn Chat 平台说明

每个平台文件仅用于**导航**：它指向需要获取的官方文档，并标记跨文档差异（例如 iOS 没有内置置顶/取消置顶 UI，而 Android 有）。这里不会重复单个文档中的事实；这些事实位于官方文档中，并按需获取。

频道覆盖情况也不在这里，而在 SKILL.md 中。频道能力矩阵见[频道指南](https://docs.rongcloud.cn/guides/realtime-chat/intro-chat/im-feature-basic.md)，它是各频道能力的事实来源。

确定目标平台后，打开对应文件查看文档地图和差异标记：

| 平台 | 文件 |
| --- | --- |
| Web | `platform-setup/web.md` |
| Android | `platform-setup/android.md` |
| iOS | `platform-setup/ios.md` |
| Flutter | `platform-setup/flutter.md` |

## 获取官方文档（适用于所有平台）

每个平台文件末尾都有**按需获取的文档索引**，列出官方文档路径，而不是阅读清单。平台文件说明某个问题对应哪个文档；获取该路径后才能查看实际事实（功能默认值、限制、API 名称、参数和配置对象）：

平台文件中的命令都应从**技能根目录**（`nexconn-chat/`）运行，例如：

```
bash scripts/fetch-docs.sh <path>      # e.g. bash scripts/fetch-docs.sh /chatui-android.md
rg chatui-android references/llms.txt  # 发现平台文件未列出的路径
```

`fetch-docs.sh` writes into `references/cache/` and manages freshness itself — it re-downloads a cached file once it passes the staleness threshold (7 days by default) and falls back to a stale copy when offline, so you normally don't manage the cache by hand. Use `--force` to refresh immediately.

⚠️ 约定（例如 `⚠️ 未验证`）定义在 SKILL.md 中。
