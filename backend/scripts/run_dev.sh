#!/usr/bin/env bash
set -euo pipefail

# 启动后端开发服务器（Mock模式与LLM开关）
export ZHIJIAOYUN_MODE=mock
export AI_LLM_ENABLED=true

deno task start || deno run -A src/main.ts
