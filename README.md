<div align="center">
<img width="1200" height="475" alt="SnapStory" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SnapStory - Next.js 前后端应用（安全 API Key 版）

一个交互式儿童故事阅读学习应用，使用 **Next.js** 架构，完全保护您的 Gemini API Key。

## 🔐 安全特性

✅ **Gemini API Key 完全保护** - 仅存储在后端，浏览器无法访问  
✅ **前后端分离** - 所有 AI 调用都通过后端 API 路由转发  
✅ **环境变量隔离** - `GEMINI_API_KEY` 永远不会暴露给客户端  

## 📋 前置要求

- Node.js 16+ 
- npm 或 yarn
- Gemini API Key (从 [Google AI Studio](https://ai.google.dev/) 获取)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

编辑 `.env.local` 文件：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**⚠️ 重要**:
- `.env.local` 已在 `.gitignore` 中，不会提交到 Git
- 只有 `NEXT_PUBLIC_` 前缀的变量才会暴露给浏览器
- `GEMINI_API_KEY` 仅在服务器端可用

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 生产构建

```bash
npm run build
npm start
```

## 📚 了解更多

详细的架构说明和安全实现细节，请查看 [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md)

### 关键文件说明

- **`app/api/gemini/*`** - 后端 API 路由（拥有 API Key）
- **`app/utils/apiClient.ts`** - 前端 API 客户端（安全通信）
- **`app/lib/geminiService.ts`** - Gemini 服务（仅服务器端）
- **`.env.local`** - 环境变量配置（不提交 Git）

## 🌟 功能特性

- 📸 **Camera Quest** - 通过拍照或上传图片学习单词
- 📖 **Story Generation** - AI 根据学习单词生成故事
- 🎨 **Illustration** - 每个故事页面生成对应插图
- 🔊 **Text-to-Speech** - 故事朗读
- 📚 **Story Library** - 保存和重温学过的故事
- 🎯 **Interactive Quiz** - 故事阅读后的词汇测验

## 🛡️ 安全架构

```
┌─────────────┐
│   Browser   │  (无法访问 API Key)
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│  Next.js API Routes      │  (/api/gemini/*)
│  (服务器端)              │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Gemini API             │  (使用 process.env.GEMINI_API_KEY)
│   (Google)               │
└──────────────────────────┘
```

## 📝 部署指南

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在项目设置中添加环境变量:
   - `GEMINI_API_KEY`: 你的 API Key

### 其他平台

在你的部署平台的环境变量设置中配置 `GEMINI_API_KEY`。

## 🐛 故障排除

**问题**: "Cannot find module '@google/genai'"  
**解决**: 运行 `npm install`

**问题**: "GEMINI_API_KEY is not set"  
**解决**: 检查 `.env.local` 文件是否存在且配置正确

**问题**: API 请求失败  
**解决**: 确保 API Key 有效，并检查浏览器控制台和服务器日志

## 📄 原项目迁移

这个项目从 Vite 迁移到 Next.js，完全重新架构以确保 API Key 安全。详见 [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md)。

## 📄 许可证

MIT

---

**保护您的 API Key，安全运行 SnapStory！** 🎉