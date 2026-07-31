---
title: "Hermes Memory 与 Skills：跨会话复用边界"
sidebar_label: "09 · Memory 与 Skills"
description: "区分 Hermes Memory、Skills、当前会话和交接文件，判断事实、流程、临时状态与原始材料应保存在哪里。"
keywords: [Hermes Memory, Hermes Skills, AI Agent 记忆]
last_update:
  date: 2026-07-31
---

# 09 · Memory、Skill 与会话信息的边界

*跨会话复用不是“把所有东西都永久保存”。*

> 会话和工具解决的是当前任务。本篇把信息分到四个位置：当前会话、交接文件、Memory 或 Skill。你会完成一份 `reuse-map.md`，但不会把虚构练习材料写入长期记忆或创建 Skill。

## 看完会得到什么

- 一套“事实、流程、临时状态、原始材料”的分类方法
- Memory、Skill、会话与 session search 的边界
- 一份包含八项判断和理由的 `reuse-map.md`
- 发现错误长期信息时的更正与清理顺序

## 开始前

- 预计时间：15—25 分钟
- 前置课程：[08 · 怎样为任务选择最小工具范围](./tools-and-toolsets)
- 已验证日期：2026-07-18
- 已实测环境：Hermes Agent 0.18.2，Linux x86_64，CLI
- 已核验范围：内置 Memory、Skills CLI、会话搜索与写入审批的官方文档
- 输入位置：系统终端和 Hermes 对话框
- 本篇会修改：练习目录中新建 `reuse-map.md`
- 本篇不会修改：你的 Memory、User Profile、Skills、凭据和原始输入

## 先认识本篇术语

| 术语 | 中文直觉 | 本篇用途 |
|---|---|---|
| Memory | 每个新会话都值得带入的短小稳定信息 | 保存偏好、环境事实、约定和长期纠正 |
| User Profile | Memory 中面向用户身份与偏好的部分 | 例如语言、表达习惯和稳定工作方式 |
| Skill | 遇到某类任务时按需加载的知识与流程包 | 保存步骤、检查表、参考资料、脚本和模板 |
| Session Search | 需要时搜索真实历史对话 | 找回“上次具体说了什么”，不占每轮固定上下文 |
| 交接文件 | 某项工作的当前状态记录 | 保存阶段成果、TODO、当前路径和下一步 |

## 四个位置各自解决什么问题

![当前会话、交接文件、Memory 与 Skill 的信息存放选择图](/tutorial-images/reuse-map.svg)

Memory 追求高信号和低体积；Skill 追求可执行方法；会话库保存真实历史；交接文件保存项目当前状态。把所有内容塞进 Memory 会增加每个新会话的固定上下文，也会让过期信息持续影响判断。

## Memory 适合保存什么

适合的内容通常同时满足三项：

1. **稳定**：不会几天后就过期；
2. **常用**：未来多个会话都会影响回答或行动；
3. **短小**：可以压成一两句事实或偏好。

例如：

- 用户偏好中文回答，先给结论；
- 某长期项目固定使用 `uv` 管理 Python 环境；
- 一项反复出现的纠正：不要在这个环境里使用 `sudo`；
- 项目目录和稳定测试框架。

不适合直接进入 Memory 的内容：长日志、原始数据、一次性临时目录、当前任务 TODO、完整会议记录和很快会过期的状态。它们更适合留在文件或会话中，需要时再读取。

官方文档说明内置 Memory 分为 `MEMORY.md` 与 `USER.md`，有严格字符上限，并在会话开始时作为冻结快照注入。会话中写入会立即保存到磁盘，但不会中途改写当前系统提示；新会话才会拿到新的快照。

## Skill 适合保存什么

Skill 不是“更大的 Memory”。它应当在某类任务发生时提供可执行能力，例如：

- 触发条件：什么时候应该使用；
- 准确步骤：按什么顺序做；
- 权限与失败边界：什么时候停；
- 验证方法：怎样证明结果合格；
- 可选资源：模板、脚本和参考资料。

“用户偏好短回复”不是 Skill；“每次发布教程时执行构建、链接、凭据扫描和页面预览”是一套流程，适合成为 Skill。

## Session Search 什么时候更合适

如果问题是“上周关于登录错误我们最后决定了什么”，你需要的是历史原文，而不是把整段讨论永久放进 Memory。Hermes 的 `session_search` 会按需检索本地会话库中的真实消息。

选择原则：

- 每次都必须知道的少量事实 → Memory；
- 偶尔需要找回的具体讨论 → Session Search；
- 当前工作状态 → 交接文件；
- 反复执行的完整方法 → Skill。

## 先只读检查，不展示长期内容

在系统终端可以运行：

```bash
hermes memory status
```

这条命令显示外部 Memory provider 的配置状态。官方 CLI help 明确说明：即使没有外部 provider，内置 `MEMORY.md`/`USER.md` 仍保持活动。不要把 `hermes memory status` 误当成“列出所有记忆内容”的命令。

查看已安装且启用的 Skills：

```bash
hermes skills list --enabled-only
```

这只列出 Skill 名称、来源或状态，不应显示凭据。清单会因安装和 profile 不同而变化，本篇不提供固定输出。

## 动手练习：把八项信息放到正确位置

### 第一步：用受控会话创建分类表

在系统终端运行：

```bash
cd ~/hermes-first-task
hermes chat --toolsets file
```

进入会话后粘贴：

```text
请创建当前目录的 reuse-map.md，把下面八项分别判断为：
A. Memory / User Profile
B. Skill
C. Session Search / 保留会话
D. 当前会话或项目交接文件

每项必须写出：选择、理由、如果放错会造成什么问题。

1. 用户长期偏好中文回答，并希望先给结论。
2. 当前练习下一步是执行 task-brief.md，但尚未授权。
3. 一段 500 行的失败日志。
4. 每次发布教程都要执行构建、链接检查、凭据扫描和页面预览。
5. 上周某次会话里对 provider 429 错误的完整排查过程。
6. 当前练习目录是 ~/hermes-first-task。
7. 这个长期项目稳定使用 uv，不使用全局 pip 安装。
8. 三份活动样例的全部原文。

文件最后增加“写入前检查”：稳定性、复用频率、长度、敏感性、过期条件、是否已有权威来源。

限制：本次只创建 reuse-map.md；不要调用 memory 工具，不要创建、编辑或删除任何 Skill；不修改其他文件，不读取目录外内容，不联网。
```

成功模式是生成一份分类表，没有发生长期 Memory 或 Skill 写入。这个练习考察决策，而不是要求唯一措辞。

### 第二步：人工复核关键答案

至少检查以下判断：

- 第 1 项适合 User Profile，因为是稳定表达偏好；
- 第 2 项属于项目交接文件，因为很快会变化；
- 第 3、8 项应保留在原始文件或会话引用中，不应塞入 Memory；
- 第 4 项适合 Skill，因为是一套重复执行且可验收的流程；
- 第 5 项适合通过 Session Search 找回，必要时再从中提炼稳定经验；
- 第 6 项取决于目录是否长期稳定：本练习是临时目录，应放交接文件；
- 第 7 项适合 Memory，因为会持续影响后续命令选择。

如果 Hermes 把“当前 TODO”“完成记录”一律写入 Memory，要求它重新应用稳定性和过期条件，而不是把 Memory 当任务日志。

### 第三步：检查没有越界

退出会话后，在系统终端运行：

```bash
test -f reuse-map.md && echo "reuse-map.md exists"
```

然后再次运行：

```bash
hermes skills list --enabled-only
```

第二条只能帮助你观察 Skill 清单；它不能单独证明 Memory 未变化，也不能证明某个同名 Skill 内容未改。最可靠的边界证据仍是：任务提示明确禁止长期写入，并在会话中检查真实工具调用。如果看到 `memory` 或 `skill_manage` 写入请求，应拒绝。

## 写入长期信息前怎样确认

当你以后确实要保存时，先问：

- 这条信息七天后仍然有效吗？
- 它是否会影响多个未来会话？
- 能否缩成一句声明式事实？
- 是否包含秘密、私人原文或不应每次注入的内容？
- 它是否已经存在于项目规则或权威文件中？
- 如果是流程，是否有触发条件、步骤、失败处理和验证？

Hermes 支持为 Memory 与 Skill 写入开启审批。若你希望每次保存前审核，可对照官方 Persistent Memory 文档配置 `memory.write_approval` 与 `skills.write_approval`。这会改变长期行为，本篇不替你修改。

## 错误信息已经被保存怎么办

按这个顺序处理：

1. 先指出哪条事实错、正确内容是什么、适用范围是什么；
2. 要求 Hermes 定向 `replace` 或 `remove`，不要把整份 Memory 清空；
3. 若是 Skill，先查看完整内容或 diff，再定向修补；
4. 开启写入审批，防止未经确认的长期修改；
5. 开始新会话验证修正后的快照是否生效；
6. 若秘密被保存，不能只做本地删除，还要到服务端撤销或轮换。

`hermes memory reset` 会清空内置 Memory，属于破坏性操作，不是普通纠错手段，本篇不执行。

## 权限检查

- 本篇会访问：Memory provider 状态、已启用 Skill 清单和虚构分类题
- 可以批准：只读列出状态、创建 `reuse-map.md`
- 需要停下来确认：添加/替换/删除长期 Memory，创建/修改/删除 Skill，执行 `hermes memory reset`
- 不应输入的信息：API key、私钥、密码、完整私人聊天、长日志和原始敏感数据

## 为什么这样设计

跨会话复用有成本。Memory 每次进入新会话上下文，错误或过期内容会持续偏置模型；Skill 在相关任务中会影响操作步骤；会话历史虽然体积大，但只在恢复或搜索时按需使用。因此，分类标准不是“以后可能有用”，而是“未来以什么频率、什么形式、在什么风险下需要它”。

把权威事实保留在项目文件中也很重要。版本、TODO 和运行状态变化快，Agent 应重新读取来源，而不是相信几周前保存的摘要。

## 出错时按这个顺序查

1. 先确认发生的是当前会话回复，还是实际 Memory/Skill 工具写入。
2. 检查信息应该属于用户偏好、环境事实、流程还是临时状态。
3. 错误 Memory 用定向替换或删除；错误 Skill 先读内容或 diff 再修补。
4. 新开会话验证冻结快照是否更新，不要求当前会话中途刷新系统提示。
5. 需要更强控制时开启写入审批并审核 pending 项。
6. 对照 Persistent Memory 与 Skills System 官方文档确认当前命令与行为。

## 本篇作品

```text
~/hermes-first-task/reuse-map.md
```

它应包含八项分类、理由、放错位置的后果，以及一份写入前检查表。它是复用决策练习，不是长期知识库。

## 本篇验收

- [ ] `reuse-map.md` 已创建，八项都有分类和理由
- [ ] 没有写入 Memory，也没有创建或修改 Skill
- [ ] 能区分稳定事实、重复流程、历史对话和临时状态
- [ ] 知道 `hermes memory status` 主要显示外部 provider 状态，内置 Memory 仍可活动
- [ ] 知道 Memory 更新在新会话快照中生效
- [ ] 能说明错误长期信息的定向修正顺序
- [ ] 知道秘密泄露不能只靠删除 Memory 解决

## 下一篇

下一篇会完成核心主线：怎样从状态、配置、凭据、日志到官方文档逐层排错，怎样停止失控任务、检查更新，并用 checkpoint 恢复一次受控失败。

## 官方来源

- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Sessions](https://hermes-agent.nousresearch.com/docs/user-guide/sessions)
- [Skills CLI](https://hermes-agent.nousresearch.com/docs/skills/)
