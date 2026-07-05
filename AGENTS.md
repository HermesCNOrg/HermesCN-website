# Project Agent Instructions

## Product Copy

- Keep user-facing copy simple and minimal. Avoid technical implementation terms such as tRPC, mutation, router, or API unless the user explicitly asks for technical detail.
- Do not add explanatory content or new entities unless they are necessary for the requested user flow.

## LLMs Documentation

- When adding, removing, or changing API routes, tRPC procedures, server actions, public data shapes, admin/manage surfaces, or agent-facing data access, update the dynamic `llms.txt` generation and related Markdown endpoints in the same change.
- Keep `/llms.txt` as a concise index. Put detailed API definitions, query behavior, and per-entity records in linked Markdown resources.

## Internationalization

- When adding a page, UI flow, form, navigation item, or user-facing copy, check whether the change needs multilingual or internationalized handling.
- Prefer existing localization patterns when present. If no localization system exists for the touched surface, keep copy simple and make the limitation explicit in the implementation or follow-up notes.
