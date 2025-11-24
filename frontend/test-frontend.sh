#!/bin/bash

echo "=== 前端启动测试脚本 ==="
echo ""
echo "1. 检查服务器状态..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000

echo ""
echo "2. 获取 HTML 内容..."
curl -s http://localhost:3000 | grep -E "(script|root)" | head -10

echo ""
echo "3. 检查 main.tsx 是否可访问..."
curl -s -o /dev/null -w "main.tsx HTTP Status: %{http_code}\n" http://localhost:3000/src/main.tsx

echo ""
echo "4. 获取 main.tsx 前几行..."
curl -s http://localhost:3000/src/main.tsx | head -5

echo ""
echo "=== 测试完成 ==="
echo ""
echo "请在浏览器中:"
echo "1. 打开 http://localhost:3000"
echo "2. 按 Cmd+Shift+R 硬刷新"
echo "3. 按 F12 打开开发者工具"
echo "4. 查看 Console 标签页的输出"
