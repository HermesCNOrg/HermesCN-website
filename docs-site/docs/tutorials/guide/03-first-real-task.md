---
title: "使用 Hermes Agent 完成第一个可验证任务"
sidebar_label: "03 · 第一个真实任务"
description: "通过受控文件练习，让 Hermes Agent 读取输入、生成结果并按存在性、完整性、准确性和边界进行验收。"
keywords: [Hermes Agent 教程, AI Agent 文件任务, Agent 任务验收]
last_update:
  date: 2026-07-31
---

# 03 · 使用 Hermes 完成第一个可验证任务

*不是继续聊天，而是读取输入、写出文件，再由你验收。*

> 这是课程的第三篇。你会在一个独立练习目录里准备三份短文本，让 Hermes 只读取这些输入，生成一份 `summary.md`，并检查它有没有漏掉事实或改动原文件。

## 看完会得到什么

- 一个与正式文件隔离的练习目录
- 一段边界清楚的任务说明
- 一份由 Hermes 生成的 `summary.md`
- 一套“存在、完整、准确、未越界”的验收方法

## 开始前

- 预计时间：20—30 分钟
- 前置课程：[02 · 怎样安装 Hermes，并完成第一次对话](./install-and-first-run)
- 已验证日期：2026-07-17
- 输入位置：Desktop 或 CLI
- 本篇会修改：练习目录，并新增 `summary.md`
- 本篇不会修改：三份原始输入和你的正式项目

## 为什么第一个任务要放在练习目录

Agent 能读写文件时，最容易犯的错误不是“回答得不够漂亮”，而是任务范围没有说清楚。把第一次任务放在独立目录，有三个好处：

- 输入少，容易判断有没有漏读；
- 原文件短，容易核对事实；
- 即使结果不理想，也不会影响正式工作。

这不是玩具步骤。以后处理合同、研究资料或代码仓库，仍然应该先确定工作目录和可修改范围。

## 第一步：准备练习目录

项目仓库已经提供三份练习文件：

```text
examples/first-task/
├── event-notes.txt
├── learner-feedback.txt
└── next-actions.txt
```

如果你正在阅读本地仓库，可以复制它们。

Linux、macOS 或 WSL2 终端：

```bash
mkdir -p ~/hermes-first-task
cp examples/first-task/*.txt ~/hermes-first-task/
cd ~/hermes-first-task
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force "$HOME\hermes-first-task"
Copy-Item examples\first-task\*.txt "$HOME\hermes-first-task\"
Set-Location "$HOME\hermes-first-task"
```

这些命令创建练习目录、复制输入文件，并进入该目录。它们不会修改仓库中的原始样例。执行前应确认终端当前位于教程仓库根目录。

如果你只在网页阅读，也可以新建 `hermes-first-task` 文件夹，并按页面末尾“练习文件内容”创建三个文本文件。

检查目录里应该只有：

```text
event-notes.txt
learner-feedback.txt
next-actions.txt
```

## 第二步：从正确的目录启动 Hermes

### CLI

确认终端位于 `hermes-first-task` 后运行：

```bash
hermes
```

Hermes 会把当前目录作为这次任务的重要环境线索。

### Desktop

打开 Hermes Desktop，并把工作目录切换到 `hermes-first-task`。如果你无法确认当前目录，不要继续写文件；先在界面中检查项目或工作目录位置。

## 第三步：给出完整任务说明

复制下面这段任务：

```text
请只处理当前目录中的这三个文件：
- event-notes.txt
- learner-feedback.txt
- next-actions.txt

目标：创建 summary.md，内容包含：
1. 活动目标，用 2—3 句话说明；
2. 学员反馈，按“顺利 / 卡点 / 建议”三类整理，每条注明来源文件；
3. 下一步行动，保留负责人和时间信息；
4. 最后一节列出“信息缺口”，不要自行补充原文件没有的事实。

限制：
- 不修改或删除三个原始文件；
- 不访问当前目录之外的文件；
- 不联网；
- 写入前先告诉我你准备创建哪个文件；
- 完成后检查 summary.md 是否存在，并说明你怎样验收。
```

这段说明包含六个关键部分：

| 部分 | 本次内容 | 作用 |
|---|---|---|
| 输入 | 三个文件名 | 防止范围漂移 |
| 目标 | 创建 `summary.md` | 定义交付物 |
| 结构 | 四个章节 | 降低遗漏 |
| 限制 | 不改原文件、不联网 | 控制权限 |
| 确认点 | 写入前说明文件 | 保留控制权 |
| 验收 | 检查存在并说明方法 | 要求 Agent 闭环 |

## 第四步：看懂工具操作

Hermes 可能会先读取目录和文本文件，然后请求创建 `summary.md`。你不需要批准所有动作，只批准符合任务边界的动作。

可以批准：

- 查看当前练习目录；
- 读取指定的三个 `.txt` 文件；
- 新建 `summary.md`；
- 读取刚生成的 `summary.md` 做检查。

需要拒绝并追问：

- 读取父目录、主目录或其他项目；
- 修改三个原始输入；
- 使用网络搜索补充“更完整的信息”；
- 删除或覆盖不在任务中的文件。

## 第五步：验收结果

Agent 说“完成了”不等于任务已经完成。至少检查四层。

### 1. 文件存在

Linux、macOS 或 WSL2 终端可以运行：

```bash
test -f summary.md && echo "summary.md exists"
```

Windows PowerShell 可以运行：

```powershell
Test-Path summary.md
```

返回 `True` 表示文件存在。

Desktop 用户可以直接在目录中确认文件存在。

### 2. 结构完整

打开 `summary.md`，确认包含：

- 活动目标；
- 顺利、卡点、建议三类反馈；
- 下一步行动；
- 信息缺口。

### 3. 事实准确

逐条对照三个输入文件，特别检查：

- 有没有把“建议”写成已经确定的行动；
- 有没有补出原文不存在的数字、负责人或日期；
- 有没有遗漏下一步行动中的负责人和时间；
- 来源文件是否标注正确。

### 4. 没有越界

检查三个原始文件仍然存在，内容没有被改写。Linux、macOS 或 WSL2 终端可以运行：

```bash
ls -1
```

Windows PowerShell 可以运行：

```powershell
Get-ChildItem -Name
```

预期看到三个输入文件和一个新文件：

```text
event-notes.txt
learner-feedback.txt
next-actions.txt
summary.md
```

文件顺序可能不同，不影响结果。

## Hermes 在这个任务里做了什么

![Hermes 从读取三个输入文件到创建、回读并验收 summary.md 的文件任务流程](/tutorial-images/first-file-task.svg)

关键不在于“生成了一篇文字”，而在于它接触了真实文件，并把结果写回你的工作环境。模型负责整理和判断，文件工具负责读取与写入。

## 如果结果不合格，先改任务，不要全部重来

### 漏掉来源

```text
请只修改 summary.md：为“学员反馈”中的每条内容补上来源文件名，不改其他章节。
```

### 把建议写成事实

```text
请对照 learner-feedback.txt，找出 summary.md 中被写成确定事实、但原文只是建议的内容。先列出问题，等我确认后再修改。
```

### 原文件被修改

立即停止当前任务。不要让 Agent 继续“自动修复”，先从仓库样例重新复制原文件，再检查任务说明中是否明确写了“不修改原始文件”。

## 权限检查

本篇会访问：当前练习目录中的三个输入文件。

可以批准：读取指定输入、新建并检查 `summary.md`。

需要停下来确认：读取目录外文件、联网、覆盖输入、删除文件或执行与整理任务无关的命令。

不应输入的信息：真实客户资料、未脱敏聊天记录、API key、密码或私有身份信息。第一次练习只使用仓库提供的虚构材料。

## 本篇作品

```text
~/hermes-first-task/summary.md
```

它的具体措辞不要求与别人的结果一致，但事实、章节和边界必须通过验收。

## 本篇验收

- [ ] `summary.md` 已创建
- [ ] 四个要求的章节都存在
- [ ] 反馈和行动能够追溯到输入文件
- [ ] 没有虚构负责人、日期或结论
- [ ] 三个原始文件没有被修改或删除
- [ ] 能说明本次批准了哪些读取和写入动作

## 练习文件内容

如果没有克隆仓库，可以手动创建以下文件。

### `event-notes.txt`

```text
活动目标：让第一次接触 Hermes 的学员完成安装，并在练习目录中运行一个文件任务。
活动形式：20 分钟讲解，30 分钟动手，10 分钟集中答疑。
现场记录：大部分学员完成了第一次对话；文件任务将在下一次活动继续。
```

### `learner-feedback.txt`

```text
顺利：安装命令和版本检查比较清楚。
卡点：两位学员安装后没有重新打开终端，系统暂时找不到 hermes 命令。
卡点：部分学员不知道 provider 和模型的区别。
建议：下一次开始前增加一张术语对照表。
建议：为 Desktop 用户补充工作目录截图。
```

### `next-actions.txt`

```text
Ray：周五前整理安装卡点。
小布：下次活动前准备术语对照表草稿。
待认领：为 Desktop 工作目录步骤补充截图。
```

## 下一篇

下一篇会拆开这次任务：模型为什么知道下一步，工具怎样接触文件，Hermes 为什么会循环检查，以及权限确认到底保护了什么。

## 官方来源

- [CLI Usage](https://hermes-agent.nousresearch.com/docs/user-guide/cli/)
- [Tools Reference](https://hermes-agent.nousresearch.com/docs/reference/tools-reference)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security/)
