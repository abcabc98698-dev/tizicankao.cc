# CONTENT_GRAPH.md - 梯子参考 内容拓扑与内链图谱

## 1. 纵向树状层级结构 (Hierarchical Backbone)
```text
/ (首页 H00)
├── /choose/ (主专题 H01 梯子怎么选)
│   ├── /choose/needs/ (二级专题 H01-S1 需求与约束判断)
│   │   ├── /choose/needs/workloads/ (三级集群 H01-S1-C1 真实任务与使用频率)
│   │   │   ├── /choose/browsing-task-budget/ (H01-S1-C1-A1)
│   │   │   ├── /choose/occasional-use-choice/ (H01-S1-C1-A2)
│   │   │   ├── /choose/mixed-workloads/ (H01-S1-C1-A3)
│   │   │   └── /choose/travel-use-planning/ (H01-S1-C1-A4)
│   │   ├── /choose/needs/budget/ (三级集群 H01-S1-C2)
│   │   ├── /choose/needs/complexity/ (三级集群 H01-S1-C3)
│   │   └── /choose/needs/constraints/ (三级集群 H01-S1-C4)
│   └── /choose/decisions/ (二级专题 H01-S2 候选比较与最终取舍)
│       ├── /choose/decisions/shortlist/
│       ├── /choose/decisions/devices/
│       ├── /choose/decisions/evidence/
│       └── /choose/decisions/final-choice/
├── /mobile/ (主专题 H02 手机方案)
├── /desktop/ (主专题 H03 电脑方案)
├── /beginner/ (主专题 H04 新手方案)
├── /service-types/ (主专题 H05 服务类型)
├── /checklist/ (主专题 H06 选型检查)
├── /free-trial/ (主专题 H07 免费试用)
├── /brands/ (主专题 H08 品牌数据库)
├── /clients/ (主专题 H09 客户端下载)
├── /guides/ (主专题 H10 使用教程)
├── /troubleshooting/ (主专题 H11 网络排障)
├── /risks/ (主专题 H12 风险提示)
└── /wiki/ (主专题 H13 知识百科)
```

## 2. 横向语义关联边体系 (Semantic Edge Rules)
横向内链只在语境高度相关且目标处于 `published` 状态时通过 `RelatedTasks` 组件或正文语义链接呈现：
1. `prerequisite`（前置先决条件）：例如进入客户端配置教程前，先修读软件官方安装包获取（`/clients/...`）。
2. `explains`（底层原理支持）：例如在排查 DNS 泄露时，横向链接至原理解释（`/wiki/ip-dns/`）。
3. `evidence`（数据证据引用）：例如在选型决策中，横向引用真实协议支持字段与实体档案（`/brands/...`）。
4. `troubleshoots`（配套排障支持）：例如在使用教程的 TUN 启用模块，挂载“TUN 启动失败诊断”（`/troubleshooting/error-tun-permission/`）。
5. `next_step`（任务推进下一步）：例如验收完成后，指导进入日常订阅更新与配置备份（`/guides/...`）。

## 3. 严格禁止项
- 严禁全站页脚塞入 416 篇无序链接墙。
- 严禁通过近义锚文本大量刷同页面链接。
- 严禁空链接、占位 `javascript:void(0)` 或指向 404 页面的死链。
