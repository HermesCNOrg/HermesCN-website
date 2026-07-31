# 17 · 综合练习：整理一组可验证资料

*从受控输入、带来源整理，到自动检查与失败重试。*

> 这是第一篇综合练习。你会复制三份互相补充、又包含一个数字冲突的虚构资料，让 Hermes 生成 `research-summary.md`，再用检查脚本验证章节、来源标签和原始输入哈希。任务不联网、不依赖 gateway，也不接触真实资料。

## 看完会得到什么

- 一个独立的资料整理目录
- 一份带来源、冲突和信息缺口的研究摘要
- 一次可重复运行的自动验收
- 输入被改动、结果不合格或 Agent 失控时的恢复路径

## 开始前

- 预计时间：35—50 分钟
- 前置课程：必须完成 03—06、08、10；建议完成 16
- 已验证日期：2026-07-18
- 已实测：Hermes Agent 0.18.2，Linux x86_64；fixture 哈希、Python 检查脚本、VitePress 构建
- 输入位置：系统终端和 Hermes CLI；Desktop 用户可在同一目录完成 Agent 步骤
- 本篇会修改：`~/hermes-lesson-17/`，并新建 `research-summary.md`
- 本篇不会修改：教程仓库中的 fixtures、其他目录、Hermes 配置、网络或外部服务
- 成本边界：只运行一个主会话；最多两次针对性修正，不使用 delegation，不联网

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Fixture | 为练习准备的固定虚构输入 | 让每位读者面对同一组可核对事实 |
| Source label | 一条结论来自哪个文件 | 防止摘要脱离依据 |
| Hash | 文件内容的指纹 | 判断原始输入是否被改动 |
| Conflict | 两个来源无法同时成立的信息 | 要明确列出，不能替读者擅自选一个 |
| Acceptance | 对交付物是否合格的检查 | 与“工具执行成功”分开 |

## 先看流程

![从固定资料、哈希基线到脚本验收和人工事实复核的可验证资料整理流程](/tutorial-images/research-verification.svg)

脚本能检查文件、章节、来源标签和输入完整性，不能判断每句话是否忠实。因此自动检查通过后，还要人工核对预算冲突、建议与已确认事实。

## 第一步：复制练习资料，不直接在仓库里做

从教程仓库根目录运行：

```bash
rm -rf /tmp/hermes-lesson-17-copy
mkdir -p /tmp/hermes-lesson-17-copy
cp -R examples/lesson-17/. /tmp/hermes-lesson-17-copy/
mkdir -p "$HOME/hermes-lesson-17"
cp -R /tmp/hermes-lesson-17-copy/. "$HOME/hermes-lesson-17/"
cd "$HOME/hermes-lesson-17"
```

这组命令只清理 `/tmp` 下本练习自己的临时副本，然后复制到独立目录；不会修改仓库 fixtures。执行前确认路径拼写完全一致。若 `~/hermes-lesson-17` 已有内容，先换一个新目录，不要覆盖。

目录应包含：

```text
01-project-brief.md
02-session-notes.md
03-feedback-and-budget.md
fixture-sha256.txt
verify_artifact.py
```

## 第二步：先验证输入基线

在练习目录运行：

```bash
sha256sum -c fixture-sha256.txt
```

成功时，三个输入文件各自显示 `OK`。这里的哈希来自仓库实际 fixtures；如果任一项失败，停止练习并重新复制，不要让 Agent “修复”原始资料。

再运行一次验收脚本：

```bash
python3 verify_artifact.py
```

此时还没有 `research-summary.md`，所以脚本应以非零退出并列出“缺少”类问题。这是预期的失败基线，证明检查器不是无条件通过。

## 第三步：从受控目录启动 Hermes

```bash
hermes --toolsets file
```

该命令从当前练习目录启动会话，并把本次 CLI 会话的工具范围限制为文件工具。不同版本的界面展示可能变化；成功标准是会话启动，且任务不需要 terminal、web、browser、messaging 或 delegation。

如果本机版本不接受全局位置的参数，使用本地帮助确认：

```bash
hermes chat --help
```

然后从同一目录运行等价的 `hermes chat --toolsets file`。

## 第四步：提交完整任务说明

把下面内容发进 Hermes 会话：

```text
只处理当前目录中的以下输入：
- 01-project-brief.md
- 02-session-notes.md
- 03-feedback-and-budget.md

创建 research-summary.md，必须使用以下二级标题，顺序不变：
## 原定目标
## 已确认事实
## 行动项
## 冲突与信息缺口
## 验收记录

要求：
- 每条事实或行动项都标注来源文件名；
- 保留负责人、日期、数字和时区；
- 明确指出预算分项与总额的冲突；
- 把“建议”“口头提出”“尚未确认”和“预算”保留为对应状态；
- 不把缺失签到人数、未确认讲师或未知录屏状态补成事实；
- 验收记录列出实际读取的三个输入文件。

限制：
- 不修改、重命名或删除输入、哈希清单和检查脚本；
- 不读取当前目录外文件；
- 不联网，不调用子代理；
- 只创建 research-summary.md；
- 写入前先说明将创建的文件；
- 完成后重新读取结果并对照以上要求。
```

只批准读取三个输入、创建和重读 `research-summary.md`。任何联网、读取父目录、修改输入或运行额外代码的请求都不在范围内。

## 第五步：先自动验收，再人工核对

退出 Hermes 或另开一个系统终端，回到练习目录：

```bash
cd "$HOME/hermes-lesson-17"
python3 verify_artifact.py
sha256sum -c fixture-sha256.txt
```

检查脚本通过时会报告 `PASS`；哈希检查应再次全部为 `OK`。这些结果只证明：输入没变、要求的章节存在、三个来源文件名都出现在产物中。

随后人工打开 `research-summary.md`，逐项确认：

- 第二轮实际约 20 分钟，没有被写成原计划 35 分钟；
- 2,400 元与 600 元的分项合计和“总预算 2,800 元”被标为冲突；
- 预算没有写成已支付费用；
- 补充练习的讲师仍是未确认；
- 未知签到人数和未知录屏状态没有被补全；
- Mia 与 Noah 的负责人和日期没有互换。

## 第六步：故意恢复一次失败

如果脚本提示缺少某个标题，不要重做全部任务。在原会话中发送：

```text
只修改 research-summary.md。检查 verify_artifact.py 报告的缺失标题，补齐该标题及对应内容；不要改其他文件。完成后重新读取结果。
```

如果事实不准确，使用更窄的修正：

```text
只检查 research-summary.md 中与预算有关的句子。对照 03-feedback-and-budget.md，先列出哪些句子把预算写成支出，或忽略了 2,800 元与分项合计的冲突；等我确认后再修改。
```

最多进行两次针对性修正。仍不合格时使用 `/stop`，保存当前失败产物，重新复制 fixtures 到新目录，并把失败项补进任务说明。无限重试会继续消耗模型费用，却不一定改善边界。

## 权限检查

本篇会访问：练习目录中的三份虚构输入、哈希清单、验证脚本和新产物。

可以批准：读取指定输入，新建和重读 `research-summary.md`。

需要停下来确认：访问目录外资料、联网补充、修改输入或哈希、执行删除、启用 delegation、写入其他文件。

不应输入的信息：真实访谈、客户信息、凭据、未脱敏内部材料。本练习只使用虚构 fixtures。

## 出错时按这个顺序查

1. `pwd`：确认在 `~/hermes-lesson-17`。
2. `sha256sum -c fixture-sha256.txt`：先确认输入是否完整。
3. `python3 verify_artifact.py`：读取具体失败项。
4. 打开产物人工核对事实状态和冲突。
5. 查看 Agent 实际调用过的工具；越界时立即 `/stop`。

输入哈希失败时，删除练习副本并从仓库重新复制；不要更新 `fixture-sha256.txt` 来掩盖变化。只有课程维护者主动修改 fixtures 时才应重建基线。

## 停止与成本边界

- 运行中失控：在会话输入 `/stop`；必要时在系统终端中断 Hermes 进程。
- 只允许一个主会话，不调用子代理。
- 最多两次局部修正；超过后停止并分析任务说明。
- 本练习不联网，避免网页搜索和浏览器调用。
- 模型费用以 provider 计费页为准；教程不承诺固定金额。

## 本篇作品

```text
~/hermes-lesson-17/research-summary.md
```

同时保留最后一次 `python3 verify_artifact.py` 与哈希检查记录。文字措辞可以不同，但事实状态、来源、冲突和输入完整性必须通过验收。

## 本篇验收

- [ ] 初始哈希检查三个输入均通过
- [ ] 初次运行验证脚本会因缺少产物而失败
- [ ] `research-summary.md` 包含五个指定章节
- [ ] 每类事实可追溯到具体来源文件
- [ ] 预算冲突、未知签到人数和未知录屏状态被明确保留
- [ ] 最终验证脚本通过，输入哈希仍不变
- [ ] 没有联网、调用子代理或访问目录外文件
- [ ] 能用 `/stop` 停止，并能只修一个失败项

## 下一篇

最后一篇会把同样的“输入—状态—产物—验收”闭环变成每日工作流，并用飞书接收结果。重点将转向常驻运行的费用、暂停、凭据与失败恢复。

## 官方来源

- [CLI Interface](https://hermes-agent.nousresearch.com/docs/user-guide/cli/)
- [Tools Reference](https://hermes-agent.nousresearch.com/docs/reference/tools-reference)
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Slash Commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands)
