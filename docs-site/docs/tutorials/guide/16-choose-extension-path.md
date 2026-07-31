---
title: "Hermes 扩展选择：Tool、Skill、MCP 还是 Plugin"
sidebar_label: "16 · 选择扩展方式"
description: "比较 Hermes Tool、Skill、MCP 与 Plugin 的适用场景、权限和维护成本，为新需求选择最小扩展层。"
keywords: [Hermes MCP, Hermes Skills, Hermes Plugin]
last_update:
  date: 2026-07-31
---

# 16 · 新需求该选 Tool、Skill、MCP 还是 Plugin

*先选择最小扩展层，再决定要不要安装。*

> 这是高级选修的最后一篇。你会盘点当前能力，用同一套问题比较内置 tool、skill、MCP 和 plugin，并为一个虚构需求写出可审查的选择记录。本篇不会安装第三方代码或连接真实服务。

## 看完会得到什么

- 一张四类能力的选择地图
- 一份当前 Hermes 扩展面清单
- 一个 `extension-decision.md` 决策产物
- 安装前的权限、维护与退出检查

## 开始前

- 预计时间：15—25 分钟
- 前置课程：08、09；建议完成 15
- 已验证日期：2026-07-18
- 已实测：Hermes Agent 0.18.2，Linux x86_64，`tools`、`skills`、`mcp`、`plugins` 的本地 CLI 帮助与只读清单命令
- 官方文档核验：MCP 的工具发现与筛选、plugin 的启用边界、skills 的用途
- 输入位置：系统终端与文本编辑器
- 本篇会修改：只新建 `~/hermes-extension-lab/extension-decision.md`
- 本篇不会修改：toolsets、skills、MCP、plugins、凭据或远程服务

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Tool | Hermes 可以执行的一个动作 | 直接读文件、运行命令或访问已提供能力 |
| Toolset | 一组相关工具的开关 | 按任务保留最小工具面 |
| Skill | 按需加载的知识、流程和资源包 | 复用“怎样做”，不一定增加外部权限 |
| MCP Server | 通过标准协议提供外部工具的服务 | 接入现成服务、数据库或内部 API |
| Plugin | 在 Hermes 进程中扩展工具、hook、命令或集成的代码 | 需要更深的本地定制与维护 |

## 先看选择顺序

![Hermes 扩展选择顺序：内置 Tool、Skill、MCP 与 Plugin](/tutorial-images/extension-choice.svg)

原则是从上往下找第一个足够的层。能用内置文件工具完成的任务，不因为“MCP 更高级”就接入外部文件服务；只缺固定写作流程时，也不需要运行第三方代码。

## 第一步：只读盘点当前能力

在系统终端运行：

```bash
hermes tools list
hermes skills list
hermes mcp list
hermes plugins list
```

四条命令只读取当前 profile 的状态。成功时分别得到工具/工具组、已安装 skills、MCP 连接和 plugins 清单；空清单也是有效结果，不代表 Hermes 损坏。

失败时先运行对应帮助：

```bash
hermes tools --help
hermes skills --help
hermes mcp --help
hermes plugins --help
```

不要为了让清单“更丰富”而随手安装。清单的价值是看清当前攻击面和维护面。

## 第二步：用五个问题判断缺口

面对任何扩展需求，先写下：

1. **缺的是动作还是方法？** “不会按团队格式写周报”通常是方法；“无法读取某服务记录”才是能力。
2. **数据在哪里？** 本地文件、公开网页、私有 API 和生产数据库对应不同权限。
3. **动作会改变外部状态吗？** 读取、创建、覆盖、删除、发送应分开授权。
4. **谁维护它？** 官方内置、团队 skill、第三方 MCP 和自建 plugin 的更新责任不同。
5. **怎样退出？** 禁用工具、移除 skill、断开 MCP、禁用 plugin 后，凭据是否还需在服务端撤销？

如果这五项没有答案，先不要安装。

## 四种选择分别在什么时候成立

### 内置 Tool / Toolset

当 Hermes 已经能执行所需动作时，直接使用内置工具。优点是依赖少、文档和生命周期统一；边界是它只提供动作，不会自动带入团队方法。一个只读取本地 Markdown 并生成摘要的任务，应优先使用 `file`，而不是接入新的文件 MCP。

### Skill

当动作已经存在，但需要稳定步骤、模板、术语或验收标准时使用 skill。Skill 可以包含参考资料和脚本，但安装 skill 仍需审查内容；“它只是文字”不意味着完全无风险，因为其中可能要求执行命令或连接外部服务。

### MCP

当可信服务已经提供 MCP server，而且你需要它暴露的外部工具时使用 MCP。Hermes 支持本地 stdio 与远程 HTTP server，会在启动时发现工具，并允许按 server 筛选暴露给模型的工具。MCP server 的代码和凭据边界独立于 Hermes；只启用任务需要的读取工具，不要默认开放删除、支付或管理权限。

### Plugin

当需求必须扩展 Hermes 的工具、hook、命令、gateway 适配或生命周期行为，而且没有更小的层可用时，才考虑 plugin。Plugin 是在 Hermes 环境中运行的代码，维护和信任成本最高。用户安装的通用 plugin 默认需要显式启用；项目本地 plugin 还涉及项目代码信任。

## 第三步：完成一个选择练习

虚构需求如下：

> 团队每周把三份 Markdown 研究记录放到本地目录。需要按固定结构生成中文摘要，保留来源标签，不联网，也不发布。

在终端创建产物目录：

```bash
mkdir -p "$HOME/hermes-extension-lab"
```

然后创建 `~/hermes-extension-lab/extension-decision.md`：

```markdown
# 扩展选择记录

## 需求
读取本地三份 Markdown，按固定结构生成带来源摘要；不联网、不发布。

## 已有能力
- 动作：内置 file toolset 可以读取和写入指定目录。
- 方法：需要固定章节、来源标签和验收清单。

## 选择
- 使用：file toolset + 一个团队维护的 skill。
- 不使用 MCP：没有外部服务或远程工具需求。
- 不使用 plugin：不需要 hook、命令或 Hermes 生命周期扩展。

## 最小权限
只读取三个输入，只新建一个结果文件；不访问网络，不覆盖输入。

## 验收
结果文件存在；章节齐全；每条事实可追溯；输入哈希不变。

## 退出
停用或移除该 skill 后，内置文件能力仍可独立使用；没有外部凭据需要撤销。
```

这不是唯一答案，但选择必须与数据位置、动作和维护责任一致。

## 反例：什么时候应改选 MCP

如果需求变为“读取团队私有工单系统中的新记录，并把确认后的标签写回”，缺口就不再只是整理方法。若该系统有经过审查的 MCP server，可以选 MCP，并只暴露读取和必要的标签工具；写回前仍需人工确认。若不存在可信 MCP，先用受控脚本验证 API 与权限，不要直接跳到常驻 plugin。

## 安装前的精确检查入口

本篇不执行安装。准备安装时，先使用官方入口预览：

```bash
hermes skills search <关键词>
hermes skills inspect <skill-id>
hermes mcp catalog
hermes plugins --help
```

其中搜索、预览和 catalog 可能联网，但不等于已经授权外部服务。`hermes mcp add`、`hermes mcp install` 和 `hermes plugins install` 会改变本地配置或安装代码，必须另行审查来源、工具清单、环境变量、写权限与移除方式。

## 权限检查

本篇会访问：当前 profile 的四类清单和一个本地练习目录。

可以批准：只读列出状态、新建决策文档、查看官方 catalog 或预览页。

需要停下来确认：执行第三方安装、运行 `npx`/`pip` 安装 hook、把 secret 写入 MCP 参数、启用写/删/管理工具、加载项目本地 plugin，或连接生产服务。

不应输入的信息：真实 API key、OAuth Token、数据库口令、私有服务完整数据。

## 出错时按这个顺序查

1. 确认当前 profile；扩展状态按 profile 保存。
2. 用四条 `list` 命令确认“未安装”还是“已安装但未启用”。
3. MCP 使用 `hermes mcp test <name>` 检查连接，再用 `hermes mcp configure <name>` 检查工具筛选。
4. Plugin 检查是否安装、是否启用，以及启动日志中的加载错误。
5. 对照官方文档和上游仓库；来源不明时不要绕过检查。

如果安装后发现选错层，先禁用，再观察核心任务是否仍能工作；确认无依赖后才移除。远程凭据还要在对应服务端撤销，本地移除配置不等于服务端失效。

## 本篇作品

```text
~/hermes-extension-lab/extension-decision.md
```

它必须说明需求、已有能力、选择理由、最小权限、验收与退出方式。

## 本篇验收

- [ ] 已完成 tools、skills、MCP、plugins 四类只读盘点
- [ ] 能区分“缺方法”和“缺外部能力”
- [ ] 选择从最小足够层开始，而不是从最强扩展开始
- [ ] 决策文档说明数据、写权限、维护者和退出路径
- [ ] 没有为了练习安装第三方代码或输入真实凭据
- [ ] 能说明 MCP 与 plugin 的信任边界为什么高于普通方法说明

## 下一篇

下一篇进入综合练习：你会在独立目录中整理一组有冲突的虚构资料，让结果同时通过结构、来源和输入完整性检查。

## 官方来源

- [Tools Reference](https://hermes-agent.nousresearch.com/docs/reference/tools-reference)
- [Skills](https://hermes-agent.nousresearch.com/docs/skills/)
- [MCP (Model Context Protocol)](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Use MCP with Hermes](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes)
- [Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
