---
title: "Hermes Agent 安装教程：完成第一次对话"
sidebar_label: "02 · 安装与首次运行"
description: "从 Desktop 与 CLI 中选择合适入口，安装 Hermes Agent、配置模型来源并完成首次对话和环境检查。"
keywords: [Hermes Agent 安装, Hermes CLI, Hermes Desktop]
last_update:
  date: 2026-07-31
---

# 02 · 安装 Hermes，并完成第一次对话

*Desktop 还是 CLI？模型从哪里来？怎样知道安装真的成功？*

> 这是课程的第二篇。你会选择适合自己的入口，安装 Hermes，配置一个模型来源，并完成第一次真实对话。结束时，你还会运行一次环境检查，而不是停在“软件看起来装好了”。

## 看完会得到什么

- 一个可以启动的 Hermes
- 一次成功的模型回复
- 一份不含凭据的环境检查结果
- 一套最小凭据安全规则

## 开始前

- 预计时间：20—40 分钟
- 前置课程：[01 · Hermes Agent 是什么](./what-is-hermes)
- 已验证日期：2026-07-17
- 已实测：Hermes Agent 0.18.2，Linux x86_64，CLI 路径
- Desktop 与其他系统安装方式：对照当日官方安装页验证
- 本篇会修改：安装 Hermes，并在用户目录中创建配置和运行数据
- 本篇不会修改：你的正式项目、云服务器或消息平台

## 先做一个安全约定

安装过程中可能需要登录模型服务，或者输入 API key。**凭据只应进入 Hermes 的登录或凭据输入界面，不要把它作为对话内容发给 Agent。**

开始前记住四条：

1. 不在聊天窗口里粘贴 Token、API key 或密码。
2. 不把凭据写进教程截图、公开文档或 Git 仓库。
3. 只从 Hermes 官方网站进入下载和安装页面。
4. 一旦凭据被发到群聊、Issue 或公开页面，立即撤销，不要继续使用。

## 第一步：选择 Desktop 还是 CLI

两条路径使用同一个 Hermes 核心，不存在“Desktop 是简化版、CLI 才是完整版”的区别。差别主要是操作入口。

| 你的情况 | 建议入口 | 原因 |
|---|---|---|
| 第一次接触终端，使用 macOS 或 Windows | Desktop | 安装和对话入口更直观 |
| 使用 Linux、WSL2 或远程机器 | CLI | 更符合这些环境的日常操作方式 |
| 已熟悉终端，希望看清命令和工作目录 | CLI | 路径和执行位置更明确 |
| 已装 CLI，后来想用桌面应用 | Desktop | 可以在现有安装上运行 `hermes desktop` |

本教程后续同时标出 Desktop 和 CLI 的入口。你只需选择一条，不需要两套都装。

## 第二步：安装 Hermes

### 路径 A：macOS 或 Windows 的 Desktop 安装器

打开 Hermes 官方安装页，选择 Desktop 安装器并按系统提示完成安装：

[Hermes Agent 官方安装页](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

安装完成后打开 Hermes Desktop。界面细节可能随版本变化，因此本教程不复制每一个按钮；判断是否成功只看两件事：

- Desktop 能正常打开；
- 配置模型后，能收到一次真实回复。

### 路径 B：Linux、macOS 或 WSL2 的 CLI

在系统终端中输入：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

这条命令从 Hermes 官方地址下载安装脚本并执行。它会安装运行 Hermes 所需的环境，并建立全局 `hermes` 命令。

命令结束后，关闭并重新打开终端，再检查：

```bash
hermes --version
```

成功时会看到类似下面的结构：

```text
Hermes Agent v<版本号>
```

版本号会变化，不需要和本教程完全相同。成功标准是命令存在，并且输出明确的 Hermes Agent 版本。

### 路径 C：Windows 原生 CLI

打开 PowerShell，输入官方安装命令：

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

安装后重新打开 PowerShell，再运行：

```powershell
hermes --version
```

如果系统提示找不到 `hermes`，先重开终端，不要立刻重复安装。新的 PATH 设置通常要在新终端中生效。

## 第三步：配置模型来源

Hermes 负责组织任务和调用工具，但文字理解与推理仍需要模型。提供模型的服务称为 **provider**。

首次配置可以运行：

```bash
hermes setup
```

它会打开交互式设置流程。按照界面选择模型来源和模型，不需要一次配置所有工具与平台。

如果你已经知道要使用哪个 provider，也可以运行：

```bash
hermes model
```

如果你选择官方文档当前提供的 Nous Portal 一站式路径，可以使用：

```bash
hermes setup --portal
```

三种入口不需要全部执行。选择一条成功路径即可。

### 输入凭据时看什么

- OAuth 登录应跳转到对应服务的正式登录页面；
- API key 应进入设置向导或安全提示框，而不是普通对话；
- 不要为了省事，把 key 直接写进命令历史；
- 页面来源或权限范围不清楚时，先停止，再对照官方 provider 文档。

## 第四步：完成第一次对话

### Desktop

打开一个新会话，输入：

```text
请只回复一句：Hermes 已经可以正常对话。
```

### CLI

在终端中运行：

```bash
hermes
```

进入对话后输入同一句话：

```text
请只回复一句：Hermes 已经可以正常对话。
```

只要收到模型生成的回复，就说明下面这条链已经连通：

![从 Desktop 或 CLI、Hermes 配置、Provider 到模型回复的首次对话链路](/tutorial-images/setup-to-model.svg)

这一步还没有测试文件和网页工具。它只证明基础对话可以工作。

## 第五步：检查环境

在系统终端中运行：

```bash
hermes doctor
```

`doctor` 会检查 Python 环境、配置文件、认证状态、目录、外部工具和可用工具。不同机器的结果不会完全相同。

判断方法：

- `✓` 表示该检查通过；
- `⚠` 通常表示某个可选能力未配置，不一定阻塞基础对话；
- 最后的摘要会告诉你是否有需要处理的问题。

不要把整份检查结果原样发到公开群聊。分享前先检查其中是否包含用户名、路径、平台状态或你不想公开的环境信息。需要分享时可优先使用：

```bash
hermes status --all
```

该命令的详细状态输出会对分享信息做脱敏处理，但发布前仍应自己再看一遍。

## 权限检查

本篇会访问：

- Hermes 官方安装地址；
- 你的用户目录，用于保存 Hermes 配置和运行数据；
- 你选择的模型服务。

可以批准：

- 从官方地址下载安装；
- 在本机用户目录创建 Hermes 文件；
- 跳转到你主动选择的 provider 登录页面。

需要停下来确认：

- 下载地址不是 Hermes 官方域名；
- 安装要求关闭系统安全功能；
- 页面索要与模型调用无关的高权限；
- 有人要求你把 Token 发给他“代为配置”。

## 出错时按这个顺序查

### `hermes: command not found`

1. 关闭并重新打开终端；
2. 回看安装命令是否正常结束；
3. 对照官方安装页检查当前系统路径；
4. 仍无法解决时，再重新运行安装器。

### 能启动，但没有模型回复

1. 运行 `hermes doctor`；
2. 运行 `hermes model`，确认已经选择模型；
3. 检查 OAuth 是否仍有效，或 API key 是否已撤销；
4. 检查当前网络能否连接所选 provider。

### Desktop 打不开

1. 确认安装器来自官方页面；
2. 检查系统是否拦截首次打开；
3. 如果 CLI 已安装，运行 `hermes --version` 判断核心安装是否成功；
4. 把 Desktop 问题和模型问题分开排查，不要同时重装所有组件。

## 本篇作品

保存以下三项，不要保存凭据：

- Hermes 版本号；
- 第一次对话的成功截图或文字记录；
- `hermes doctor` 的通过/警告摘要。

## 本篇验收

- [ ] `hermes --version` 能显示版本，或 Desktop 能正常打开
- [ ] Hermes 返回了一次真实模型回复
- [ ] 已运行 `hermes doctor` 并看懂警告是否阻塞当前任务
- [ ] 没有把 Token、API key 或密码发进聊天或截图
- [ ] 知道自己的入口是 Desktop 还是 CLI

## 下一篇

下一篇会进入独立练习目录，让 Hermes 读取三份短文本并写出一份可验证的整理结果。你将第一次看到“对话”怎样变成“完成任务”。

## 官方来源

- [Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers)
- [CLI Commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
