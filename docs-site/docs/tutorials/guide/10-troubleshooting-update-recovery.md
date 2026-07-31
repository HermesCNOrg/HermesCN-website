---
title: "Hermes Agent 故障排查、更新与恢复指南"
sidebar_label: "10 · 排错与恢复"
description: "按停止、状态、配置、凭据、日志和文档的顺序排查 Hermes 故障，并安全更新和恢复受控文件任务。"
keywords: [Hermes 故障排查, Hermes 更新, Hermes Agent 恢复]
last_update:
  date: 2026-07-31
---

# 10 · Hermes 故障排查、更新与恢复

*先保住现场，再缩小故障层；恢复不是重装，也不是让 Agent 继续试。*

> 这是核心主线的最后一篇。你会建立固定排错顺序，检查状态、配置和日志，学会停止正在运行的任务，安全检查更新，并在独立目录中用 checkpoint 恢复一次人为制造的文件错误。结束时，你会留下 `recovery-record.md` 和恢复后的 `status.txt`。

## 看完会得到什么

- 一套“停止 → 状态 → 配置 → 凭据 → 日志 → 文档”的排错顺序
- 区分应用故障、模型故障、工具故障和任务验收失败的方法
- 更新前检查与更新后验证清单
- 一次真实、可逆、范围受控的 checkpoint 恢复练习

## 开始前

- 预计时间：25—40 分钟
- 前置课程：[09 · 什么应该记进 Memory，什么应该写成 Skill](./memory-and-skills)
- 已验证日期：2026-07-18
- 已实测环境：Hermes Agent 0.18.2，Linux x86_64，CLI
- 已核验命令：`hermes status`、`doctor`、`config check/migrate`、`logs`、`update --check`、`chat --checkpoints`、`checkpoints`
- 输入位置：系统终端与 Hermes CLI 会话
- 本篇会修改：新建 `~/hermes-recovery-lab/`，并在其中改写后恢复 `status.txt`；新增 `recovery-record.md`
- 本篇不会修改：正式项目、全局 checkpoint 配置、凭据、Git 仓库、远程服务或消息平台

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| 状态检查 | 先判断哪个组件不正常 | 避免一上来重装所有东西 |
| 日志 | 程序记录的真实事件与错误 | 区分模型猜测和运行时证据 |
| Safe mode | 暂时禁用自定义配置、规则、插件和 MCP 的排错启动方式 | 判断故障是否来自个性化层 |
| Checkpoint | 写入前保存的文件系统快照 | 恢复 Agent 在当前目录造成的文件变化 |
| Rollback | 把工作目录恢复到某个 checkpoint | 不等于撤销外部消息、交易或服务端操作 |

## 先判断是哪一层失败

| 现象 | 首先怀疑 | 第一项证据 |
|---|---|---|
| Hermes 命令无法启动 | 安装或本地环境 | `hermes --version`、终端错误 |
| 能启动但模型不回复 | provider、模型或凭据 | `hermes status`、`hermes doctor` |
| 模型回复但工具不可用 | toolset、依赖或权限 | `hermes tools list --platform cli`、工具错误 |
| 工具执行成功但结果不对 | 任务说明或验收 | 交付物与输入的人工核对 |
| 只有自定义环境会失败 | 配置、规则、plugin 或 MCP | `hermes chat --safe-mode` 对比 |

最常见的错误是把最后一类“内容不合格”当成安装故障。命令退出码为 0、文件存在或模型有回复，都不能替代业务验收。

## 固定排错顺序

![Hermes 固定排错顺序：停止、状态、配置、凭据、日志、隔离和更新](/tutorial-images/troubleshooting-path.svg)

不要在每一层同时改东西。一次只验证一个假设，才能定位原因。

## 第一步：先停止，不要边失控边排错

如果 Hermes 正在一个会话中执行长任务，输入：

```text
/stop
```

`/stop` 用于停止后台进程和正在运行的任务。若界面不再响应，退出当前 Hermes 进程。停止后先检查真实影响：哪些文件已写入、命令是否仍有子进程、外部动作是否已经发生。

停止不是恢复：

- 已写入的文件不会因为 `/stop` 自动回到旧版本；
- 已发送的消息不会自动撤回；
- 已提交的交易或远程修改需要各自的恢复路径；
- 泄露的凭据仍需服务端撤销。

## 第二步：收集最小状态证据

在系统终端依次运行：

```bash
hermes --version
hermes status
hermes config check
```

三条命令分别回答：当前安装是什么、组件目前怎样、配置是否缺失或过期。它们以读取和检查为主；`config check` 不自动迁移配置。

需要更完整、可分享前仍应人工审查的状态时：

```bash
hermes status --all
```

官方 CLI help说明该输出会做分享脱敏，但脱敏不是绝对保证。发布前检查用户名、路径、平台名称和业务信息。

再运行诊断：

```bash
hermes doctor
```

`doctor` 会检查配置与依赖。警告可能只是可选能力未配置；根据你当前任务需要判断是否阻塞。不要一看到警告就运行 `--fix`。

## 第三步：查错误和日志

先列出可用日志：

```bash
hermes logs list
```

查看最近错误：

```bash
hermes logs errors --since 1h
```

查看 Agent 日志中 warning 及以上级别：

```bash
hermes logs --level WARNING --since 1h
```

这些命令读取本地日志，不修复问题。成功模式是命令正常返回日志内容或明确表示没有匹配记录；不要编造“应该出现”的错误行。

日志可能包含路径、提示片段、会话 ID 或集成信息。对外求助前只截取与故障相关的最小片段，并删除秘密和私人内容。

## 第四步：用最小环境验证是不是自定义层造成的

如果普通会话异常，但安装和 provider 看起来正常，可以从一个无关正式项目的安全目录运行：

```bash
hermes chat --safe-mode
```

本地 CLI help说明，safe mode 会禁用用户配置、项目规则与 Memory 注入、plugins 和 MCP servers，用于隔离故障来源。它不是日常工作模式，也不会删除这些设置。

判断：

- safe mode 正常、普通模式失败 → 优先检查自定义配置、规则、plugin 或 MCP；
- 两者都失败 → 优先检查安装、provider、网络或基础依赖；
- 两者都能回复但任务结果错 → 回到任务说明和验收，不要继续折腾安装。

## 第五步：检查更新，不要把更新当第一反应

只检查是否有更新：

```bash
hermes update --check
```

本地 CLI help确认 `--check` 不安装任何内容。若确有更新，先阅读变更、保存未完成工作，并确认没有其他 Hermes 进程正在关键任务中。

执行更新使用：

```bash
hermes update
```

该命令会拉取代码并重新安装依赖，可能触发配置迁移；它有实际系统影响，本篇不替你执行。当前 CLI 还支持更新前备份选项，是否启用以 `hermes update --help` 的当日说明为准。

更新后的最低验证顺序：

```bash
hermes --version
hermes config check
hermes doctor
hermes status
```

如果配置检查提示迁移，先审查再运行：

```bash
hermes config migrate
```

迁移会修改配置，不应在不了解变化时批量自动执行。更新也不能修复错误任务说明、过期凭据或外部服务故障。

## 动手练习：恢复一次受控文件错误

本练习只操作一个新目录和一个虚构文件。checkpoint 是可选功能；本篇按会话启用，不修改全局配置。

### 第一步：创建恢复实验目录

在系统终端运行：

```bash
mkdir -p ~/hermes-recovery-lab
printf 'mode=ready\n' > ~/hermes-recovery-lab/status.txt
cd ~/hermes-recovery-lab
```

第一条创建独立目录；第二条创建或覆盖该目录中的 `status.txt`；第三条进入目录。只在确认路径准确后执行，因为 `>` 会覆盖同名文件。

检查初始内容：

```bash
python3 -c "from pathlib import Path; print(Path('status.txt').read_text(), end='')"
```

这是只读检查。成功时应显示你刚写入的 `mode=ready`；该结果来自本次命令，不是教程虚构的程序输出。

PowerShell 对应准备方式：

```powershell
New-Item -ItemType Directory -Force "$HOME\hermes-recovery-lab"
Set-Content -Path "$HOME\hermes-recovery-lab\status.txt" -Value "mode=ready"
Set-Location "$HOME\hermes-recovery-lab"
Get-Content status.txt
```

### 第二步：按会话启用 checkpoint

在实验目录的系统终端运行：

```bash
hermes chat --checkpoints
```

本地 CLI help与官方 Checkpoints 文档都确认：`--checkpoints` 为本次会话启用写入前快照。官方文档说明 checkpoint 默认关闭，并保存在 Hermes 的 shadow store，不修改真实项目的 `.git`。

进入会话后输入：

```text
这是恢复练习。请只把当前目录的 status.txt 完整改写为一行：mode=broken
不要修改其他文件，不要运行终端命令，不要联网。写完后重新读取 status.txt 并停止。
```

批准前确认对象只有当前目录的 `status.txt`。成功模式是文件变为 `mode=broken`，并且写入前产生一个可列出的 checkpoint；界面显示形式可能随版本变化。

### 第三步：先预览，再恢复

在同一 Hermes 会话输入：

```text
/rollback
```

它应列出当前目录的 checkpoint 和编号。不要假定编号一定是 1；以你屏幕上的真实列表为准。

先预览目标 checkpoint：

```text
/rollback diff <N>
```

把 `<N>` 换成列表中的真实编号。检查 diff 是否只涉及 `status.txt` 从 `mode=ready` 变到 `mode=broken`。范围不符就停止，不要恢复。

确认后输入：

```text
/rollback <N>
```

官方文档说明恢复会还原工作目录中的受跟踪文件，并撤销上一轮对话，使上下文与文件状态一致。恢复后退出 Hermes，在系统终端重新读取：

```bash
python3 -c "from pathlib import Path; print(Path('status.txt').read_text(), end='')"
```

验收标准是内容回到 `mode=ready`。如果没有恢复，先重新列出 checkpoint 和当前目录，不要连续尝试多个编号。

### 第四步：记录故障与恢复证据

在文本编辑器中创建：

```text
~/hermes-recovery-lab/recovery-record.md
```

写入以下内容，使用你真实观察到的信息，不复制虚构输出：

```markdown
# Recovery Record

- 故障范围：
- 停止方式：
- 初始状态：
- 失败状态：
- 使用的 checkpoint 编号：
- diff 范围：
- 恢复后验证：
- 未受影响的对象：
- 下次预防措施：
```

这份记录是本篇作品的一部分。它要求你区分事实证据和推断，而不是只写“已修复”。

## checkpoint 不能恢复什么

Checkpoint 只覆盖受支持的本地文件变化，并有目录、文件大小和存储限制。它不能自动恢复：

- 已发送或发布到外部平台的内容；
- 数据库、云服务或第三方 API 中已经提交的变更；
- 支付、链上交易和凭据泄露；
- snapshot 未包含的大文件或过宽目录；
- checkpoint 启用前已经发生且没有快照的修改。

因此，高风险任务仍应先备份、先草稿、先预览 diff，并由人确认具体执行。

<details>

<summary>权限检查</summary>


- 本篇会访问：Hermes 本地状态、配置检查结果、日志和 `~/hermes-recovery-lab`
- 可以批准：只读检查；在实验目录改写 `status.txt`；预览并恢复只涉及该文件的 checkpoint
- 需要停下来确认：`doctor --fix`、配置迁移、执行更新、清空 checkpoint store、恢复范围超出实验目录、任何外部操作
- 不应输入的信息：日志中的 Token、私钥、完整私人对话、生产配置和真实事故数据

</details>

## 为什么这样设计

可靠排错的核心是缩小变量。先停止可以限制影响；状态和配置告诉你系统在哪一层异常；日志给出运行证据；safe mode隔离个性化层；更新只在版本原因成立时使用；checkpoint 恢复的是已确认范围内的本地文件。

“重装”同时改变太多变量，还可能覆盖现场证据。它应该是安装损坏得到证据后的选择，不是所有错误的第一步。

<details>

<summary>出错时按这个顺序查</summary>


1. 停止任务并记录已经发生的真实影响。
2. 确认当前目录、文件和进程，不继续自动修复。
3. 运行 `hermes status`、`hermes config check` 和 `hermes doctor`。
4. 读取与时间、组件、会话相关的最小日志片段。
5. 用 `hermes chat --safe-mode` 做隔离对比。
6. 若怀疑版本问题，先运行 `hermes update --check`，再决定是否更新。
7. 文件恢复前使用 `/rollback diff <N>`；恢复后重新读取文件并验收。
8. 仍无法解决时带上版本、系统、真实错误和最小复现查阅官方 FAQ 或报告问题。

</details>

## 本篇作品

```text
~/hermes-recovery-lab/status.txt
~/hermes-recovery-lab/recovery-record.md
```

`status.txt` 必须恢复为初始状态；`recovery-record.md` 必须记录真实 checkpoint 编号、diff 范围和恢复验证。不要把教程中的占位符当作执行证据。

## 本篇验收

- [ ] 能先停止任务，再判断已经发生的影响
- [ ] 已运行状态、配置和诊断检查，并能区分警告与阻塞项
- [ ] 知道怎样按时间读取错误日志且不会公开秘密
- [ ] 知道 safe mode 用于隔离自定义层，不是日常安全沙箱
- [ ] 已用 `hermes update --check` 理解只检查与执行更新的区别
- [ ] checkpoint 恢复前查看了真实 diff
- [ ] `status.txt` 已恢复为初始内容
- [ ] `recovery-record.md` 记录了真实证据和未受影响范围
- [ ] 能说明 checkpoint 无法撤销哪些外部动作

## 核心主线完成

你现在可以在本机完成一项边界清楚的任务，管理会话和工具，判断哪些经验值得复用，并在失败时停止、定位和恢复。后续场景课程会把这些方法带到消息平台、Cron 和多媒体任务中；无论入口怎样变化，任务边界、最小权限、真实证据和人工验收仍然不变。

## 下一篇

下一篇将进入场景课程：接入消息平台，以飞书为完整主案例，从移动端发送第一项受控任务，并核对平台权限和会话边界。

## 官方来源

- [FAQ & Troubleshooting](https://hermes-agent.nousresearch.com/docs/reference/faq)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Checkpoints and /rollback](https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback)
- [CLI Commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security/)
