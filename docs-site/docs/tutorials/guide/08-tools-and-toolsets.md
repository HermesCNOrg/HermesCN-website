---
title: "Hermes Agent 工具选择：按任务配置最小 Toolset"
sidebar_label: "08 · 工具与 Toolsets"
description: "根据文件、终端、网页、浏览器和图像任务选择最小工具集，缩小 Hermes Agent 的能力与权限范围。"
keywords: [Hermes Agent 工具, Hermes Toolsets, AI Agent 权限]
last_update:
  date: 2026-07-31
---

# 08 · 按任务选择最小工具集

*能用更多工具，不等于应该让这次任务看到更多工具。*

> 前两篇限定了文件和会话范围。本篇继续限定“能力范围”：先判断任务需要文件、终端、网页、浏览器还是图像能力，再用最小 toolsets 启动一次会话。结束时，你会得到 `tool-plan.md`，并能解释为什么工具可用、动作获批和结果合格是三件不同的事。

## 看完会得到什么

- 一张常用工具边界图
- 一份当前 CLI 工具状态检查结果
- 一个只启用 `file` 与 `clarify` 的受控会话
- 一份记录“需要什么、不需要什么、为什么”的 `tool-plan.md`

## 开始前

- 预计时间：20—30 分钟
- 前置课程：[07 · 怎样管理会话、上下文并继续一项工作](./sessions-context-resume)
- 已验证日期：2026-07-18
- 已实测环境：Hermes Agent 0.18.2，Linux x86_64，CLI
- 已核验命令：`hermes tools list/enable/disable` 与 `hermes chat --toolsets`
- 输入位置：系统终端和 Hermes CLI 会话
- 本篇会修改：练习目录中新建 `tool-plan.md`
- 本篇不会修改：持久 toolsets 配置、原始输入、凭据或外部服务

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Tool | 一个具体动作 | 例如读取文件、运行命令或提取网页 |
| Toolset | 一组相关工具的能力包 | 决定本次会话可向模型暴露哪些动作 |
| 可用性 | 工具是否出现在当前会话 | 还可能受平台、依赖和凭据影响 |
| 授权 | 某一次具体动作是否允许发生 | 工具可用不代表每次调用都应批准 |
| 最小范围 | 只开放完成任务所需的能力 | 减少误操作、无关探索和数据暴露面 |

## 五类常用能力怎样区分

| 能力 | 适合做什么 | 不应混淆为 |
|---|---|---|
| `file` | 读取、搜索、新建和定向修改本地文件 | 终端沙箱；其中也包含写入能力 |
| `terminal` | 运行系统命令、构建、测试和管理进程 | 只读能力；命令可产生广泛系统影响 |
| `web` | 搜索公开信息并提取网页正文 | 操作已登录网页界面 |
| `browser` | 导航、点击、输入和检查动态页面 | 无状态的公开资料读取 |
| `vision` | 分析图片内容 | 生成图片；生成由 `image_gen` 负责 |

同一目标可能需要多个 toolset。例如“打开动态网页，登录后下载报表，再分析截图”可能涉及浏览器、文件和图像；也意味着更高的数据与账户风险。不要因为最终结果是“一份报告”就忽略中间接触的系统。

## 从任务反推工具，而不是从工具寻找用途

![从任务目标反推必要动作、最小 Toolsets、逐次授权和最终验收](/tutorial-images/tool-selection.svg)

工具选择发生在执行前。即使 toolset 已启用，Hermes 仍应只调用任务所需动作；即使动作获批，你仍要验收交付物。

### 三个容易选错的例子

1. **总结三个本地文本并写一个文件**：需要 `file`，不需要 `web` 或 `browser`。若验收只需人工打开文件，连 `terminal` 也不是 Agent 必需能力。
2. **查当前官方文档并附来源**：需要 `web`；只有网页必须点击或输入时才增加 `browser`。
3. **运行项目测试并定位失败**：需要 `terminal` 与 `file`；网络只在必须查外部文档时再增加。

## 动手练习：用最小 toolsets 生成工具计划

### 第一步：只查看当前 CLI 工具状态

在系统终端运行：

```bash
hermes tools list --platform cli
```

这条命令读取 CLI 平台的工具启用状态，不修改配置。成功时会看到工具或 toolset 的启用/禁用信息；具体清单随版本、插件和凭据变化，不需要与别人完全相同。

如果只想看各平台摘要，可以运行：

```bash
hermes tools --summary
```

不要把完整状态输出直接贴到公开页面；其中可能暴露你安装了哪些集成。分享前先审查。

### 第二步：为本任务做能力决定

本任务只需要：

- 读取 `task-brief.md`；
- 在信息不足时向你提一个问题；
- 新建并检查 `tool-plan.md`。

因此选择：

```text
需要：file, clarify
不需要：terminal, web, browser, vision, image_gen
```

注意：`file` 是一个包含读、写、搜索和修改的能力包。启用它不等于授权修改所有文件；任务说明仍必须把可写对象限制为 `tool-plan.md`。

### 第三步：以会话级最小范围启动

在系统终端输入：

```bash
cd ~/hermes-first-task
hermes chat --toolsets file,clarify
```

第一条进入练习目录；第二条只为这次 CLI 会话指定 `file` 和 `clarify`。它不会永久改写平台工具配置。成功时 Hermes 启动交互会话；如果某项工具因版本、平台或配置不可用，应以启动信息和 `hermes tools list --platform cli` 为准。

进入会话后输入：

```text
请只读取当前目录的 task-brief.md，并创建 tool-plan.md，包含：
1. 完成 task-brief.md 中最终任务所需的动作；
2. 每个动作对应的最小 toolset；
3. 本任务明确不需要的 toolsets 及原因；
4. 即使 toolset 可用，也必须由人确认的动作；
5. 最终验收与工具执行成功的区别。

限制：这一次不执行最终任务；不修改 task-brief.md 和三份输入；不读取目录外文件；不联网。完成后重新读取 tool-plan.md，确认五节齐全。
```

成功模式是只读取本地任务说明并创建 `tool-plan.md`。由于本次会话没有开放终端、网页、浏览器或图像能力，Hermes 不应声称已经运行命令、访问网页或分析图片。

### 第四步：在会话外验收

退出 Hermes，在系统终端运行：

```bash
test -f tool-plan.md && echo "tool-plan.md exists"
```

这只检查文件存在。随后人工确认：

- 文件只把 `file` 作为当前练习的必需能力；
- 没有为了“可能有帮助”加入网页、浏览器或终端；
- 写入范围仍限定为 `tool-plan.md`；
- 明确写出“工具执行成功不等于内容验收通过”；
- 没有创建 `brief.md` 或改动输入。

PowerShell 对应检查：

```powershell
Test-Path tool-plan.md
```

## 持久启用和禁用什么时候用

如果某个平台长期需要一项能力，可以在系统终端使用：

```bash
hermes tools enable <name> --platform cli
hermes tools disable <name> --platform cli
```

`<name>` 替换为 `hermes tools list --platform cli` 中的真实名称。这些命令会持久修改对应平台的工具设置，不是本篇练习步骤。修改后应开始新会话；不要期待运行中的会话中途重建工具清单。

持久禁用适合表达平台政策，例如消息入口永远不需要终端；会话级 `--toolsets` 适合表达这一次任务的最小能力。两层不要混用。

## 为什么“safe”也不是绝对安全

官方 toolsets 参考把 `safe` 定位为只读研究与媒体生成组合，不含文件写入、终端和代码执行。但它仍可能访问网络或生成媒体，也不等于数据分类、账户权限和业务结果自动安全。安全来自多层共同作用：工具范围、任务边界、系统账户、审批、隔离和验收。

## 权限检查

- 本篇会访问：CLI 工具状态、`task-brief.md` 和新建的 `tool-plan.md`
- 可以批准：读取指定任务说明、新建并复查 `tool-plan.md`
- 需要停下来确认：持久启用/禁用工具、访问网络、运行命令、读取目录外文件、修改任何输入
- 不应输入的信息：API key、浏览器 Cookie、私有页面内容和与当前练习无关的本地路径

## 为什么这样设计

Toolset 是能力边界，不是文件 ACL，也不是完整沙箱。`file` 中同时有读取与写入；`terminal` 能运行的命令范围远大于一个项目；`browser` 可能接触已登录账户。最小 toolsets 减少 Agent 可选择的行动空间，但具体对象仍要由任务说明和系统权限约束。

反过来，工具太少也会让任务无法闭环。模型没有文件工具时，只能建议内容，不能证明文件已写入；没有终端工具时，不能声称测试已运行。正确目标不是“工具越少越好”，而是“完成与验证所需的最小集合”。

## 出错时按这个顺序查

1. 运行 `hermes tools list --platform cli`，确认名称和状态。
2. 确认 `--toolsets` 写在启动命令中，而不是作为对话文字输入。
3. 新开会话后再检查；工具清单不会可靠地在当前对话中途重建。
4. 工具存在但不可用时，检查对应依赖、凭据和平台限制。
5. Agent 请求无关能力时，拒绝并要求它说明必要动作；不要直接改成 `all`。
6. 对照 Toolsets 与 Built-in Tools 官方页面确认当前版本行为。

## 本篇作品

```text
~/hermes-first-task/tool-plan.md
```

它应是一份决策记录，而不是功能清单：每项能力都要对应一个必要动作，每个不需要的能力都有与当前任务相关的理由。

## 本篇验收

- [ ] 已查看当前 CLI 工具状态，没有修改持久配置
- [ ] 会话以 `file,clarify` 的最小范围启动
- [ ] `tool-plan.md` 包含五个要求的部分
- [ ] 没有访问网络、运行系统命令或读取目录外文件
- [ ] 三份输入和 `task-brief.md` 没有被修改
- [ ] 能区分工具可用、动作授权和结果验收
- [ ] 能为本地整理、公开资料研究和项目测试分别选择必要 toolsets

## 下一篇

下一篇会解决“哪些经验值得跨会话复用”：什么应该进入 Memory，什么应该成为 Skill，什么只应留在当前会话或交接文件。

## 官方来源

- [Toolsets Reference](https://hermes-agent.nousresearch.com/docs/reference/toolsets-reference)
- [Built-in Tools Reference](https://hermes-agent.nousresearch.com/docs/reference/tools-reference)
- [Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- [CLI Commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
