#!/bin/bash

# SnapStory Next.js 快速设置脚本

echo "🚀 SnapStory - Next.js 安全版 快速设置"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 需要 Node.js。请从 https://nodejs.org 下载安装"
    exit 1
fi

echo "✅ Node.js 已检测: $(node --version)"
echo ""

# 安装依赖
echo "📦 安装 npm 依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"
echo ""

# 检查 .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local 文件不存在，复制模板..."
    cp .env.local.example .env.local 2>/dev/null || echo "GEMINI_API_KEY=" > .env.local
fi

echo "📝 请编辑 .env.local 文件，设置您的 GEMINI_API_KEY"
echo ""
echo "您可以从以下链接获取 API Key:"
echo "  https://ai.google.dev/"
echo ""

# 选择是否启动开发服务器
read -p "是否现在启动开发服务器? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🎯 启动开发服务器..."
    echo "访问: http://localhost:3000"
    echo ""
    npm run dev
fi
