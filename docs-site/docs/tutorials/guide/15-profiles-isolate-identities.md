# 15 · 用 Profiles 隔离身份与配置

*工作 Agent、个人 Agent 和不同机器人，怎样不混用配置、记忆与会话？*

> 这是高级选修的第二篇。你会创建一个名为 `research` 的独立 profile，给它指定练习工作目录，完成一次最小检查，并写下一份边界记录。重点不是“多开一个窗口”，而是知道哪些状态真的隔离，哪些系统权限仍然共享。

## 看完会得到什么

- 一个独立的 `research` profile
- 一个固定的研究练习目录
- 一份 `profile-boundaries.md` 边界记录
- 创建、切换、检查和删除 profile 的恢复路径

## 开始前

- 预计时间：20—30 分钟
- 前置课程：建议完成 01—10；如果要配置独立模型凭据，先复习 05
- 已验证日期：2026-07-18
- 已实测：Hermes Agent 0.18.2，Linux x86_64，`profile`、`config`、`doctor` CLI 帮助与只读命令
- 官方文档核验：profile 隔离范围、`terminal.cwd`、`terminal.home_mode` 与删除语义
- 输入位置：系统终端
- 本篇会修改：`~/.hermes/profiles/research/`、profile 命令别名与 `~/hermes-profile-lab/`
- 本篇不会修改：默认 profile、现有会话、Git 仓库、远程账号或已运行的 gateway

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Profile | 一套独立的 Hermes 身份目录 | 分开配置、凭据、会话、memory、skills、cron 和日志 |
| `HERMES_HOME` | Hermes 当前身份的“家” | 决定 profile 数据写到哪里 |
| `terminal.cwd` | 工具开始工作的目录 | 让研究身份从指定练习目录启动 |
| `HOME` | 操作系统用户目录 | 外部 CLI 默认仍可能共享这里的登录状态 |
| Sandbox | 强制限制可访问范围的执行环境 | Profile 本身不是 sandbox |

## 先看流程

![从检查、创建、配置到记录边界并决定保留或删除的 Profile 生命周期](/tutorial-images/profile-boundaries.svg)

先确认名称没有冲突，再创建空白身份。随后把“身份状态”和“工作目录”分别设置、分别验收；最后决定保留还是删除，而不是把 profile 当成安全沙箱。

## 第一步：先检查名称和当前身份

在系统终端运行：

```bash
hermes profile list
hermes profile show research
```

第一条只读取 profile 清单。第二条在 `research` 不存在时应返回未找到一类提示；如果它已经存在，先停止，不要覆盖或删除。你可以改用一个新的小写字母数字名称，并把后文的 `research` 一并替换。

成功判断：你知道当前默认 profile，并确认目标名称可用。失败时先运行 `hermes profile --help`，检查本机版本支持的子命令。

## 第二步：创建独立 Profile，不复制秘密

```bash
hermes profile create research
```

本篇故意不使用 `--clone`。官方文档说明，`--clone` 会复制当前 profile 的 `config.yaml`、`.env`、`SOUL.md` 和 skills；这可能把原身份的 API key 或机器人凭据一起带过去。空白创建会保留新 profile 自己的状态目录。

创建后检查：

```bash
hermes profile show research
hermes -p research config path
hermes -p research config env-path
```

成功时，详情和两个路径都应指向 `research` 对应的 profile 目录，而不是默认 profile。不要打印 `.env` 内容；路径足以完成本次验收。

## 第三步：给工具指定练习工作目录

```bash
mkdir -p "$HOME/hermes-profile-lab"
hermes -p research config set terminal.cwd "$HOME/hermes-profile-lab"
```

第一条只新建练习目录。第二条修改 `research` 的配置，不修改默认 profile。路径必须是已经存在的绝对目录。

再运行：

```bash
hermes -p research config
```

只检查 `terminal.cwd` 是否指向 `~/hermes-profile-lab` 展开后的绝对路径。配置输出可能包含环境信息，公开分享前先人工检查。

:::warning Profile 不是文件沙箱
`terminal.cwd` 决定工具从哪里开始，不会阻止本地工具访问其他目录。默认本地 backend 仍以当前操作系统用户权限运行；`SOUL.md` 中写“不要离开目录”也不是强制隔离。
:::

## 第四步：单独配置模型，并限制一次验证成本

如果 `research` 还没有可用模型，在终端运行：

```bash
hermes -p research setup
```

只选择一套已理解费用和权限的 provider。凭据进入设置或 OAuth 流程，不进入普通聊天。若你不准备产生模型调用，可跳过本步和下一条对话验证，仍可完成隔离结构验收。

先做本地检查：

```bash
hermes -p research doctor
```

需要验证模型时，只运行一次最小请求：

```bash
hermes -p research chat -q "只回复：research profile 可用。不要调用任何工具。"
```

成功标准是得到一条真实模型回复。该请求会产生一次模型调用，费用取决于所选 provider；失败时不要连续重试，先看 `doctor` 的认证与模型检查。

## 第五步：写下边界，而不是凭感觉判断

在 `~/hermes-profile-lab/profile-boundaries.md` 写入：

```markdown
# research profile 边界

- Hermes 状态目录：以 `hermes -p research config path` 的结果为准
- 默认工作目录：`~/hermes-profile-lab` 展开后的绝对路径
- 独立状态：配置、Hermes 凭据文件、会话、memory、skills、cron、日志和状态数据库
- 默认仍共享：操作系统用户权限，以及外部 CLI 在真实 HOME 中保存的登录状态
- 不允许：读取练习目录外资料、外部发布、删除正式数据
- 停止方式：结束当前会话；必要时先停对应 gateway，再处理 profile
- 删除前检查：导出需要保留的资料，并确认 profile 名称
```

这份文件是本篇作品。不要把真实 key、Token 或账号标识写进去。

## 两种“更严格隔离”不要混为一谈

若希望外部 CLI 也使用 profile 专属的 HOME，官方文档提供 `terminal.home_mode: profile`。启用后，SSH、Git、云 CLI 等工具需要在 profile 专属 HOME 中重新初始化；这会改变工具找到凭据的位置，不适合作为新人默认设置。

若目标是强制限制文件、网络或系统权限，需要容器、远程受限 backend 或操作系统权限控制。Profile 解决的是 Hermes 状态分离，不解决完整执行隔离。

## 权限检查

本篇会访问：profile 清单、`research` 的配置目录和练习目录。

可以批准：创建新 profile、在新 profile 内保存配置、创建练习目录、运行一次受限模型验证。

需要停下来确认：使用 `--clone` 复制 `.env`、删除已有 profile、启动新机器人、复用同一机器人凭据、启用 `terminal.home_mode: profile`，或让工具访问练习目录外文件。

不应输入的信息：真实凭据、私钥、助记词、未脱敏客户资料。

## 出错时按这个顺序查

1. `hermes profile list`：确认命令实际指向哪个 profile。
2. `hermes profile show research`：确认 profile 路径和状态。
3. `hermes -p research config`：确认模型和 `terminal.cwd`。
4. `hermes -p research doctor`：区分环境、认证和可选能力问题。
5. 对照官方 Profiles 文档；不要用“问 Agent 自己在哪个目录”代替配置检查。

如果创建错了但没有重要数据，先停止该 profile 的 gateway，再运行：

```bash
hermes -p research gateway stop
hermes profile delete research
```

删除会移除该 profile 的数据、别名和服务，并要求输入名称确认。不要使用跳过确认的选项。默认 profile 不能用该命令删除。

## 本篇作品

```text
~/hermes-profile-lab/profile-boundaries.md
```

它应清楚区分 Hermes 状态隔离、工作目录和系统权限三件事。

## 本篇验收

- [ ] `hermes profile show research` 指向独立 profile 目录
- [ ] `research` 的 config 与 env 路径不等于默认 profile 路径
- [ ] `terminal.cwd` 是存在的绝对练习目录
- [ ] 已完成 `doctor`；如运行模型验证，只调用一次
- [ ] `profile-boundaries.md` 写明独立项、共享项、禁止项和删除前检查
- [ ] 能解释为什么 profile 不是 sandbox
- [ ] 知道删除 profile 会删除哪些本地状态

## 下一篇

下一篇不急着安装扩展，而是先判断一个需求应该使用内置工具、skill、MCP 还是 plugin。选错扩展层，通常比少装一个功能更难维护。

## 官方来源

- [Profiles: Running Multiple Agents](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)
- [Profile Commands](https://hermes-agent.nousresearch.com/docs/reference/profile-commands)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
