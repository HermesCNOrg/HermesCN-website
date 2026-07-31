---
title: "Hermes Cron 教程：创建和管理定时任务"
sidebar_label: "12 · 定时任务"
description: "创建、触发、检查、暂停、恢复与删除 Hermes Cron 定时任务，理解模型成本、交付位置和停止方式。"
keywords: [Hermes Cron, AI Agent 定时任务, Hermes 自动化]
last_update:
  date: 2026-07-31
---

# 12 · 创建、检查、暂停与删除定时任务

*自动运行不等于放任运行：先做一个有输出、有限时长、知道送到哪里的 Cron 练习。*

> 这是第二篇场景课程。你会创建一个每小时运行的本地练习任务，手动触发一次，找到真实输出，再依次暂停、恢复和删除。练习不联网、不读取项目文件，也不向外部平台发送消息。

## 看完会得到什么

- 一个名称、频率、任务内容和交付位置都明确的 Cron job
- 一次由 Gateway 调度产生的真实本地输出
- 一套创建、查看、触发、暂停、恢复和删除的完整生命周期
- 判断模型成本、运行环境和停止方式的方法

## 开始前

- 预计时间：20—30 分钟；手动触发后可能需要等待下一次调度 tick
- 前置课程：建议完成 06—10；如果要把结果发送到飞书，先完成第 11 篇
- 已验证日期：2026-07-20
- 已实测环境：Hermes Agent 0.18.2，Linux x86_64；本地核对了 `hermes cron create/list/pause/resume/run/remove/status` 与 Gateway CLI 帮助
- 官方事实范围：已对照当日 Cron 官方文档；调度行为、存储位置和 delivery 规则可能随版本变化，发布或使用前应重新核对
- 输入位置：系统终端
- 本篇会修改：当前 profile 的 Cron job 列表；运行时会在 Hermes Cron 输出目录保存结果
- 本篇不会修改：正式项目、系统 crontab、消息平台配置，也不会联网或向外发送练习结果

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Cron job | 被保存、按时间触发的任务定义 | 记录何时运行、做什么、结果送到哪里 |
| Schedule | 触发时间规则 | 本篇使用 `every 1h`，便于识别为重复任务 |
| Scheduler tick | 调度器定期检查到期任务的一次“巡检” | 到期任务由 tick 发现；手动 `run` 的等待方式要以当前 CLI 回报为准 |
| Fresh session | 每次运行使用的新 Agent 会话 | 任务不能依赖你创建它时的聊天上下文 |
| Delivery | 最终输出的交付位置 | 本篇固定为 `local`，避免误发外部消息 |
| Job ID | 任务的唯一标识 | 用于暂停、恢复、触发和删除准确对象 |

## 先看流程

![Hermes Cron 从运行前检查、创建、试跑到暂停和删除的完整任务生命周期](/tutorial-images/cron-lifecycle.svg)

创建只是开始。练习成果是你能找到输出、解释成本，并能让任务停止，不留下一个无人管理的重复任务。

## Cron 运行前必须满足什么

Hermes 的 Cron 由 Gateway 调度。官方文档说明，Gateway 周期性检查到期任务，并在独立 Agent 会话中运行它们。因此先检查：

```bash
hermes gateway status --deep
hermes cron status
```

- 输入位置：运行 Hermes 的系统终端
- 读取或修改：只读取 Gateway 与 Cron 调度状态
- 成功判断：能确认 Gateway 正在运行，Cron 状态没有报告调度器不可用
- 失败先查：如果 Gateway 未运行，先按第 11 篇选择 `hermes gateway run` 前台运行，或启动已安装的用户服务

如果你只打开了普通 Hermes 对话，但 Gateway 没有运行，job 可以被保存，却不会按预期由常驻调度器执行。

## 第一步：先把任务写成“新会话也看得懂”

Cron 每次在 fresh session 中运行，不记得你创建任务时的上下文。下面这种写法不合格：

```text
每小时继续检查刚才那个东西。
```

“刚才”和“那个东西”在新会话中没有指向。使用这段自包含任务：

```text
这是 Cron 课程练习。不要调用网页、浏览器、文件或终端工具。
只输出三行：
任务：Cron 课程练习
状态：本次调度已执行
边界：未访问外部数据
不要添加其他内容。
```

它写清了身份、禁止动作和输出结构，也不会因为资料变化产生不同答案。

## 第二步：创建一个只交付到本地的重复任务

在终端中运行：

```bash
hermes cron create "every 1h" "这是 Cron 课程练习。不要调用网页、浏览器、文件或终端工具。只输出三行：任务：Cron 课程练习；状态：本次调度已执行；边界：未访问外部数据。不要添加其他内容。" --deliver local --name "cron-course-practice"
```

- 输入位置：系统终端，不是在 Hermes 对话框里
- 读取或修改：在当前 profile 中新增一个每小时重复的 job；不会修改系统 crontab
- 成功判断：命令返回已创建的任务信息或 Job ID，随后能被 `hermes cron list` 找到
- 失败先查：先运行 `hermes cron create --help`；检查 schedule 和 prompt 是否分别作为位置参数传入

`--deliver local` 很重要。官方文档说明，CLI 创建的任务默认也倾向本地交付，但教程仍显式写出，避免读者把默认值当作永远不变的保证。

记录命令真实返回的 Job ID。后文中的 `<job_id>` 必须替换为这个值，不要原样输入尖括号占位符。

## 第三步：列出任务并检查四个字段

```bash
hermes cron list
```

- 输入位置：系统终端
- 读取或修改：只读取当前 profile 的 job 列表
- 成功判断：能找到名为 `cron-course-practice` 的条目
- 失败先查：确认创建和列表命令使用同一个 Hermes profile；命名 profile 时，两条命令都要使用同样的 `--profile`

至少核对：

1. 名称是 `cron-course-practice`；
2. schedule 是每小时重复，而不是一次性延迟；
3. delivery 是本地；
4. job 当前为启用状态，并有下一次运行信息。

输出格式会随版本变化，不要把教程中的字段顺序当作固定界面。

## 第四步：手动触发一次

将真实 ID 代入：

```bash
hermes cron run <job_id>
```

- 输入位置：系统终端
- 读取或修改：请求该 job 立即运行或在调度器可执行时触发；不改变它原来的每小时 schedule
- 成功判断：命令接受该 ID，并明确回报触发或运行状态；随后任务产生一次运行记录或本地输出
- 失败先查：先读命令真实返回的状态，再用 `hermes cron list` 重新复制 ID，并确认 Gateway、Cron 和 provider 状态

这里存在需要明确记录的版本差异：2026-07-18 的官方文档把 `run` 描述为在下一次 scheduler tick 触发；本地 Hermes Agent 0.18.2 的实测 CLI 会在命令中尝试运行，并回报 `Ran now` 状态。不要依赖固定等待方式，也不要把“已触发”当作“任务成功”：以当前命令的真实回报、运行记录和本地输出三者为准。

再次查看：

```bash
hermes cron list
```

然后到官方文档给出的 profile 本地输出目录核对：

```bash
ls -lt "$HOME/.hermes/cron/output/<job_id>"
```

- 输入位置：系统终端；把 `<job_id>` 替换为真实 ID
- 读取或修改：只列出该 job 已保存的本地输出文件
- 成功判断：手动触发完成后出现带时间信息的输出文件；再打开最新文件核对三行内容
- 失败先查：先检查 `hermes cron status` 和 Gateway 日志；如果你使用 named profile，输出根目录位于该 profile 的 Hermes home，而不一定是默认路径

不要预先声称某个文件名一定存在。只有真实运行完成后，目录中实际出现的文件才是本篇作品。

## 第五步：检查运行成本和权限

这个练习虽然不联网查资料，默认仍是 LLM-driven job：每次运行都会启动 Agent 并调用模型，因此可能消耗 token、订阅额度或 API 费用。每小时重复意味着如果忘记删除，成本会持续发生。

创建前后都应回答：

- **模型成本：** 每次运行是否需要推理？本篇需要。
- **工具成本：** 是否会调用收费搜索、浏览器或外部 API？本篇明确禁止。
- **运行次数：** 一次性还是重复？本篇每小时重复，必须在课末删除。
- **交付位置：** 本地还是消息平台？本篇为本地。
- **凭据有效期：** 无人值守时，当前 provider 登录能否刷新？不确定时先做短期测试，不承诺长期稳定。
- **模型变化：** 官方文档当前说明 job 会记录创建时的 provider/model 选择；全局默认变化后可能采用 fail-closed 行为而跳过运行，具体以当日文档与 job 状态为准。

固定阈值检查、心跳或脚本已有完整输出时，可以考虑官方的 no-agent 模式，以避免 LLM 成本。但那是另一种自动化设计，本篇先练习有 Agent 输出的完整生命周期。

## 第六步：暂停，并证明它仍然存在

```bash
hermes cron pause <job_id>
hermes cron list --all
```

- 输入位置：系统终端
- 读取或修改：把 job 设为暂停；不删除任务定义和已有输出
- 成功判断：列表仍能找到该 job，但状态为暂停或禁用
- 失败先查：确认 ID；如果普通 `list` 隐藏了禁用任务，使用本地帮助已核对的 `--all`

暂停适合临时止损：配置有问题、费用异常、输入源失效，或者你还想保留任务定义排查。暂停后不要只凭“命令成功”判断，要用列表确认状态。

## 第七步：恢复一次，再删除

恢复：

```bash
hermes cron resume <job_id>
hermes cron list
```

恢复会重新启用调度，并计算下一次未来运行时间。确认状态后，结束练习：

```bash
hermes cron remove <job_id>
hermes cron list --all
```

- 输入位置：系统终端
- 读取或修改：`resume` 重新启用；`remove` 删除 job 定义
- 成功判断：最终列表中不再出现该 Job ID 或名称
- 失败先查：不要猜 ID；先列表，再对准确对象操作

删除 job 不应被理解为自动清除所有历史输出。需要处理历史文件时，先确认保存范围和保留要求；本篇不要求删除输出文件。

## 如果要把结果送到飞书

完成本地练习后，才考虑把 `--deliver local` 改为飞书。前提是：

- 第 11 篇的飞书 Gateway 已验证；
- 已在目标飞书会话设置 home channel，或明确配置了交付目标；
- 任务内容适合发送到该会话；
- 收件范围、费用和失败告警都已确认。

官方飞书文档提供 `/set-home` 作为在会话中设置 home channel 的入口，并确认 Cron 可以向飞书交付。Hermes Agent 0.18.2 的 `cron create --help` 只展示部分常见平台，不是完整的平台清单；是否可用还取决于当前 profile 是否完成飞书配置。**设置 home chat 和创建外发 job 都会产生外部影响，应在真实发送前单独确认会话。**本篇不执行这一步。

<details>

<summary>权限检查</summary>


本篇会访问：

- 当前 profile 的 Cron 配置与调度状态；
- 所选模型服务；
- Hermes 的本地 Cron 输出目录。

可以批准：

- 新增一个名称明确、每小时运行、只交付到本地的练习 job；
- 手动触发一次；
- 暂停、恢复并删除准确 Job ID。

需要停下来确认：

- delivery 指向真实群聊、个人或多个平台；
- prompt 要读取正式项目、私有文件或生产系统；
- schedule 频率高到可能快速累积费用；
- 任务要求发布、支付、删除或修改生产环境；
- job 名称重复，而命令只按名称操作，无法确认唯一对象。

不应输入的信息：API key、密码、私钥、真实用户 ID、聊天 ID，以及任何不需要进入模型的敏感数据。

</details>

## 为什么练习选择“重复任务 + 本地交付”

一次性任务无法完整练习暂停与恢复；真实外发又会把收件人、home channel 和平台权限混进第一轮 Cron 学习。每小时重复、本地交付把问题限制为调度本身，同时又让“忘记删除会持续产生成本”变得可见。

这也是自动化的基本判断：先验证运行与停止，再扩大输入、频率和交付范围。

<details>

<summary>出错时按这个顺序查</summary>


**创建成功，但一直没有输出**

1. 运行 `hermes gateway status --deep`；
2. 运行 `hermes cron status`；
3. 用 `hermes cron list --all` 确认 job 没有暂停；
4. 检查下一次运行时间，并确认时区；
5. 检查 provider 凭据和模型是否仍可用；
6. 查看 Gateway 与 Cron 错误日志，再对照官方 Cron 排错文档。

**`run` 后没有立即出现文件**

先读 `hermes cron run` 的真实回报：如果当前版本已尝试运行，检查它报告成功还是失败；如果只登记触发，则等待调度器处理。随后检查状态和输出，不要连续触发同一个 job，否则可能制造你无法区分的多次尝试。

**输出内容不符合三行要求**

调度已成功，内容验收失败。先保存真实输出作为证据，再编辑 prompt；不要把“有文件”当作任务通过。修改后只触发一次重新验收。

**费用或调用次数异常**

立即 `pause`，确认状态后检查频率、prompt、模型和工具范围。保留 job 便于诊断；只有确认不再需要时才删除。

**不确定输出送到哪里**

先暂停。用 `hermes cron list --all` 核对 delivery，再检查当前 profile 的 home channel 配置。不要用发送测试消息的方式猜收件人。

</details>

## 本篇作品

保存：

1. `hermes cron list` 中该 job 的非敏感字段记录；
2. 该 Job ID 对应目录中一次真实运行产生的 `.md` 输出；
3. 最终删除后，`hermes cron list --all` 不再出现该 job 的验证结果。

记录中不要包含 provider 凭据、聊天 ID 或无关的其他 job 内容。

## 本篇验收

- [ ] Gateway 与 Cron scheduler 状态已检查
- [ ] job 的 prompt 在 fresh session 中也能独立理解
- [ ] schedule、名称、delivery 和重复性质都已核对
- [ ] 手动触发产生了真实本地输出，而不是只看到“已接受”
- [ ] 输出包含要求的三项，且没有声称访问了未访问的数据
- [ ] 能说明每次运行可能产生模型成本
- [ ] 已成功暂停，并通过列表确认暂停状态
- [ ] 已恢复后删除准确 Job ID
- [ ] 最终列表不再包含练习 job

## 下一篇

下一篇会回到飞书，分别发送一段语音、一张截图和一份虚构文档，观察它们怎样被转写、下载、分析并汇总成一个可验收结果。

## 官方来源

- [Hermes：Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Hermes：Automate with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron)
- [Hermes：Cron Troubleshooting](https://hermes-agent.nousresearch.com/docs/guides/cron-troubleshooting)
- [Hermes：CLI Commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Hermes：飞书接入](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
