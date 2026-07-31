# 18 · 综合实战：构建可暂停的每日研究助手

*从本地信息源、变化状态、定时运行，到飞书交付与费用止损。*

> 这是课程最后一篇。你会用两份虚构来源搭建一个最小每日研究助手：预检查脚本只在来源变化时唤醒 Agent，Cron 在独立会话中生成本地产物，并把最终摘要交付到飞书。结束时，你还会实际暂停任务、验证不再常驻运行，并写清凭据撤销路径。

## 看完会得到什么

- 一个 `~/hermes-daily-research/` 工作目录
- 一个“无变化不调用模型”的 pre-check gate
- 一个每天运行、只交付到飞书的 Cron job
- 一份 `out/daily-brief.md` 和自动验收记录
- 暂停、重跑、移除、费用检查和凭据撤销路径

## 开始前

- 预计时间：50—75 分钟；飞书应用审批时间不计入
- 前置课程：必须完成 05、10、11、12、17
- 已验证日期：2026-07-20
- 已实测：Hermes Agent 0.18.2，Linux x86_64；`gateway`、`cron create/edit/run/pause/resume/remove` 本地 CLI 帮助；pre-check 脚本三种状态；本地产物检查脚本
- 官方文档核验：2026-07-20 的 Cron、`wakeAgent`、`workdir`、飞书 WebSocket、home chat 与 allowlist 说明
- 输入位置：系统终端、Hermes CLI、飞书开发者后台与飞书聊天
- 本篇会修改：练习目录、`~/.hermes/scripts/lesson18-change-gate.py`、当前 profile 的飞书配置和一个 Cron job
- 本篇不会修改：教程仓库 fixtures、其他消息平台、Git、远程资料源、公开页面或付费账户设置
- 成本边界：每天最多一个有变化的 Agent run；无变化时 gate 跳过模型；首次验证只主动触发一次

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Cron job | 按计划触发的持久任务 | 每天检查一次资料 |
| Fresh session | 每次运行都是新会话 | Prompt 必须自包含，不能依赖当前聊天记忆 |
| Pre-check script | 模型调用前的便宜检查 | 来源没变时输出 `wakeAgent: false` |
| `workdir` | Cron 工具的固定工作目录 | 把读取和产物集中在练习目录 |
| Home chat | 默认接收计划任务结果的飞书会话 | 避免在 prompt 中硬编码真实 chat ID |
| Pause | 保留配置但停止未来触发 | 第一止损动作 |

## 先看闭环

![每日研究助手从变化检查、Cron 新会话到本地产物与飞书交付的闭环](/tutorial-images/daily-research-loop.svg)

Gate 只判断文件是否变化，不负责总结。Agent 只在变化时读取虚构来源、写本地产物；Cron 的 `deliver` 负责把最终回复送到飞书，prompt 不应再调用消息发送工具。

## 第一步：复制虚构来源与检查器

从教程仓库根目录运行：

```bash
mkdir -p "$HOME/hermes-daily-research/inbox"
mkdir -p "$HOME/hermes-daily-research/state"
mkdir -p "$HOME/hermes-daily-research/out"
mkdir -p "$HOME/.hermes/scripts"
cp examples/lesson-18/inbox/*.md "$HOME/hermes-daily-research/inbox/"
cp examples/lesson-18/source-baseline.json "$HOME/hermes-daily-research/state/"
cp examples/lesson-18/task-prompt.txt "$HOME/hermes-daily-research/"
cp examples/lesson-18/verify_artifact.py "$HOME/hermes-daily-research/"
cp examples/lesson-18/change_gate.py "$HOME/.hermes/scripts/lesson18-change-gate.py"
chmod 700 "$HOME/.hermes/scripts/lesson18-change-gate.py"
```

如果目标目录已有同名文件，先停止并换目录；不要覆盖真实工作流。来源中的 `example.invalid` 是专为示例保留的无效域名，本篇不联网访问它。

建立输入基线检查：

```bash
cd "$HOME/hermes-daily-research"
python3 - <<'PY'
from pathlib import Path
import hashlib, json
root = Path.home() / "hermes-daily-research"
actual = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((root / "inbox").glob("*.md"))}
expected = json.loads((root / "state/source-baseline.json").read_text())["files"]
assert actual == expected, "fixture baseline mismatch"
print("PASS: source baseline matches")
PY
```

成功时只说明复制后的来源与仓库基线一致。

## 第二步：验证 Gate 的三种真实状态

第一次运行：

```bash
python3 "$HOME/.hermes/scripts/lesson18-change-gate.py"
```

因为还没有 `state/gate-state.json`，输出 JSON 中应包含 `"wakeAgent": true`，并列出两个 changed 文件。

立刻再运行一次相同命令：

```bash
python3 "$HOME/.hermes/scripts/lesson18-change-gate.py"
```

来源没有变化时，输出应为包含 `"wakeAgent": false` 的 JSON。这个结果意味着 Cron 可以跳过本次 Agent 和模型调用，不代表任务失败。

最后模拟一次变化：

```bash
printf '\n- 状态补充：本条仅用于练习变化检测。\n' >> "$HOME/hermes-daily-research/inbox/source-b.md"
python3 "$HOME/.hermes/scripts/lesson18-change-gate.py"
```

输出应重新包含 `"wakeAgent": true`，changed 中只有 `source-b.md`。随后立即恢复 fixture：

```bash
cp examples/lesson-18/inbox/source-b.md "$HOME/hermes-daily-research/inbox/source-b.md"
rm -f "$HOME/hermes-daily-research/state/gate-state.json"
```

删除 gate 状态会让下一次受控试跑重新识别全部来源。它也是 Agent 运行失败后强制重试的恢复入口。

## 第三步：只接入飞书

运行官方交互入口：

```bash
hermes gateway setup
```

选择 **Feishu / Lark**，优先使用扫码创建；如需手动配置，只在向导的凭据输入位置填写 App ID 与 App Secret。不要把它们写进 prompt、命令参数、截图或本教程目录。

飞书应用至少需要官方页面列出的消息接收、机器人发送、资源与会话权限，并订阅 `im.message.receive_v1`。本机或私有服务器优先选 WebSocket 长连接，不需要公开 webhook 地址。应用权限配置完成后还要发布版本；企业应用可能需要管理员批准。

启动或检查 gateway：

```bash
hermes gateway start
hermes gateway status
```

如果当前环境不支持后台服务，按官方说明在独立终端以前台方式运行：

```bash
hermes gateway run
```

在飞书里给机器人发一条测试消息。成功收到回复后，在希望接收日报的飞书会话中输入：

```text
/set-home
```

生产使用必须配置飞书用户 allowlist。群聊默认还需要明确 @机器人；不要为了省配置把机器人开放给所有可访问用户。

## 第四步：把 Cron 的工具面缩到任务所需

运行：

```bash
hermes tools
```

在交互界面选择 `cron` 平台，只保留本任务需要的 `file` 工具组；不需要 terminal、browser、delegation 或消息发送工具。工具选择会影响 Cron 新会话，不要在正在运行的旧会话里判断是否已经生效。

这样做既减少权限面，也减少每次模型请求携带的工具 schema。Gate 脚本由 scheduler 在 Agent 之前运行，不需要把 terminal tool 暴露给模型。

## 第五步：创建自包含的每日任务

先把 prompt 读入 shell 变量，再创建 job：

```bash
PROMPT="$(cat "$HOME/hermes-daily-research/task-prompt.txt")"
hermes cron create "0 8 * * *" "$PROMPT" \
  --name "lesson18-daily-research" \
  --deliver feishu \
  --script "lesson18-change-gate.py" \
  --workdir "$HOME/hermes-daily-research"
```

五字段表达式表示按 scheduler 所在时区每天 08:00。若你不确定时区，先暂停 job，确认系统与 gateway 时区后再恢复；不要假定它必然是北京时间。

这条命令会创建持久任务并指定：

- self-contained prompt：新会话不依赖当前聊天；
- `workdir`：绝对且已存在的练习目录；
- pre-check script：无变化时 `wakeAgent: false`；
- `deliver feishu`：只把最终回复交付到飞书 home chat；
- 默认模型：创建时记录当前 provider/model。官方文档说明，之后全局默认改变时任务会 fail closed，而不是静默继承新的付费模型。

`hermes cron create --help` 只展示部分常见 delivery 示例，没有穷举全部消息平台。飞书能否交付，应以当前 profile 已完成飞书配置、`/set-home` 已设置目标，以及一次受控试发三项证据为准。

立即检查：

```bash
hermes cron list
hermes cron status
```

记录该 job 的真实 ID、状态、计划和下一次运行时间。不要把教程中的占位符当成真实 ID。

## 第六步：只做一次受控试跑

确认 `state/gate-state.json` 已删除，然后用上一步记录的真实 ID：

```bash
hermes cron run <job_id>
```

`run` 请求立即触发任务，但命令返回不等于整项任务已经完成。不同构建可能直接回报 `Ran now`，也可能先登记触发并由 scheduler 处理。以命令回报、运行记录和最终产物为准；不要连续执行 `run`。

完成后依次验收：

```bash
test -f "$HOME/hermes-daily-research/out/daily-brief.md"
python3 "$HOME/hermes-daily-research/verify_artifact.py"
```

同时在飞书 home chat 检查是否收到一条日报。三层都要成立：本地文件存在、验证脚本通过、飞书消息到达。任一失败都不能称为闭环完成。

:::warning 验证脚本在模拟变化后必须使用已恢复的来源
若前一步忘记恢复 `source-b.md`，脚本会报告来源基线不一致。重新从仓库复制该 fixture，不要修改基线文件掩盖差异。
:::

## 第七步：现在就练习暂停

使用真实 job ID：

```bash
hermes cron pause <job_id>
hermes cron list
```

成功标准是该 job 显示为暂停，不再参加未来计划触发。暂停不会撤回已经送达的飞书消息，也不保证终止一个已经开始的 run。

需要恢复时：

```bash
hermes cron resume <job_id>
```

课程验收结束后，建议保持暂停，直到你把虚构来源替换为经过授权的真实来源、重新做隐私评估，并确认费用预算。

<details>

<summary>权限检查</summary>


本篇会访问：虚构 inbox、本地状态与产物、当前 profile 的 Cron 存储、飞书应用和指定 home chat。

可以批准：读取虚构来源、写 `state`/`out`、创建一个每日 job、向你指定的飞书会话交付一次测试结果。

需要停下来确认：开放机器人给所有用户、写入真实私密资料、增加高频计划、启用网络或删除工具、改投其他聊天、发送附件、改变 provider/model、公开 webhook、覆盖已有工作流。

不应输入的信息：App Secret、Token、真实 chat ID、私钥、助记词、未脱敏研究资料。

</details>

<details>

<summary>出错时按这个顺序查</summary>


1. `hermes cron list` 与 `hermes cron status`：确认 job 是否启用、scheduler 是否运行。
2. 手动运行 gate：确认是 `wakeAgent: false` 跳过，还是脚本错误。
3. 检查 `workdir`、`task-prompt.txt` 和 `out/` 权限。
4. `hermes gateway status`：确认飞书 gateway 在线。
5. 飞书侧检查应用已发布、事件已订阅、home chat 已设置、用户在 allowlist。
6. 查 gateway 日志中的真实错误，再对照官方 Cron 与飞书文档。

**Gate 过早记录变化，但 Agent 失败**

Gate 会在 Agent 启动前写入 `state/gate-state.json`。如果之后模型或写文件失败，下一次可能判断“无变化”。恢复方法：先修复失败原因，再删除该状态文件，只主动触发一次。

```bash
rm -f "$HOME/hermes-daily-research/state/gate-state.json"
hermes cron run <job_id>
```

**本地产物成功，但飞书没有消息**

不要重跑 Agent。先保留本地产物，检查 gateway、home chat、应用权限和 allowlist。重复运行会增加费用，也可能产生重复消息。

**飞书收到消息，但本地产物不合格**

立即暂停 job。按第 17 课的方法只修 prompt 或验收失败项，删除 gate 状态后做一次受控重跑。

</details>

## 成本与停止边界

- 计划频率固定为每天一次，不做分钟级轮询。
- `wakeAgent: false` 时跳过 Agent 与模型调用；脚本本身仍会本地运行。
- 每个有变化的 tick 仍可能产生多轮模型/工具调用，实际费用取决于 provider、模型、输入长度和 Agent 循环。
- 只启用 `file`，避免无用工具 schema 增加输入成本。
- 每周运行 `hermes insights --days 7` 查看使用趋势；费用账单仍以 provider 为准。
- 第一止损：`hermes cron pause <job_id>`。
- 若 gateway 整体异常：`hermes gateway stop`，但这会同时影响该 profile 的飞书接入和 scheduler。
- 永久退出前先 `hermes cron list` 确认对象，再运行 `hermes cron remove <job_id>`。

## 凭据撤销与清理

暂停或删除 job 不会撤销飞书 App Secret。永久退出时按顺序处理：

1. 暂停并移除 Cron job；
2. 停止 gateway；
3. 在飞书开发者后台撤销或轮换 App Secret，必要时停用应用；
4. 通过 `hermes gateway setup` 禁用或重新配置飞书；
5. 删除 `~/.hermes/scripts/lesson18-change-gate.py` 与练习目录前，先确认没有其他 job 引用它们；
6. 再次运行 `hermes cron list` 和 `hermes gateway status` 验证清理结果。

服务端撤销是凭据失效的关键。本地删文件、删消息或清空会话都不能替代它。

## 本篇作品

需要保留四项：

```text
~/hermes-daily-research/out/daily-brief.md
~/hermes-daily-research/state/gate-state.json
~/.hermes/scripts/lesson18-change-gate.py
Cron job 的真实 ID 与暂停状态记录
```

飞书中的一次测试日报是外部交付证据；不要公开带真实会话标识或环境路径的截图。

## 本篇验收

- [ ] 两份虚构来源通过基线检查
- [ ] Gate 实际经历 `true → false → 变化后 true`
- [ ] 飞书应用已发布，gateway 在线，home chat 与 allowlist 已设置
- [ ] Cron prompt 自包含，`workdir` 是绝对路径，交付目标只有飞书
- [ ] 只主动触发一次测试 run
- [ ] `daily-brief.md` 存在且验证脚本通过
- [ ] 飞书收到一次对应摘要
- [ ] Job 已实际暂停，并通过 `cron list` 验证
- [ ] 能解释无变化为何不产生模型调用、变化时费用仍来自哪里
- [ ] 能执行状态重置、job 移除与飞书凭据服务端撤销

## 课程完成

这项练习把一次对话推进成有输入、有状态、有本地产物、有飞书交付、有费用边界、能暂停和恢复的常驻工作流。正式上线前，替换信息源只是小部分工作；还要重新确认数据授权、来源稳定性、模型预算、收件范围和故障责任人。

## 官方来源

- [Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Automate with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron)
- [Cron Troubleshooting](https://hermes-agent.nousresearch.com/docs/guides/cron-troubleshooting)
- [Feishu / Lark Setup](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
