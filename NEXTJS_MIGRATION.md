# SnapStory - Next.js 前后端应用（API Key 安全版）

这个项目已经被改造成 **Next.js 前后端应用**，确保 Gemini API Key 安全地存放在后端，不会泄露给浏览器。

## 🔐 安全架构

### API Key 保护
- **Gemini API Key** 仅存储在服务器端环境变量中 (`GEMINI_API_KEY`)
- 前端**无法访问** API Key，所有 AI 调用都通过后端 API 路由转发
- 前端与后端通过 `/api/gemini/*` 路由进行通信

### 项目结构

```
/app
  /api                          # 后端 API 路由 (Server-side)
    /gemini
      /identify                 # 物体识别 API
      /speech                   # 文本转语音 API
      /story                    # 故事生成 API
      /illustration             # 图片生成 API
      /lookup                   # 单词查询 API
  
  /components                   # React 组件 (Client-side)
  /lib
    /geminiService.ts          # 后端 Gemini 服务 (仅在 API 路由中使用)
    /types.ts                  # 共享类型定义
  
  /utils
    /apiClient.ts              # 前端 API 客户端 (安全通信)
    /soundUtils.ts             # 音效工具
  
  /services
    /audioManager.ts           # 音频管理
  
  /page.tsx                     # 主应用页面
  /layout.tsx                   # 根布局
  /globals.css                  # 全局样式
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（已有模板）:

```bash
# .env.local
GEMINI_API_KEY=your_actual_api_key_here
```

**重要**: 
- `.env.local` 已在 `.gitignore` 中，不会被提交到 Git
- API Key 仅在服务器端可用，永远不会被暴露给客户端

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 构建生产版本

```bash
npm run build
npm start
```

## 🔄 API 调用流程

### 前端示例（安全）

```typescript
// app/components/CameraQuest.tsx
import { apiClient } from '@/app/utils/apiClient';

// 前端调用后端 API，API Key 完全隐藏
const result = await apiClient.identifyObject(imageBase64, theme);
```

### 后端示例（拥有 API Key）

```typescript
// app/api/gemini/identify/route.ts
import { identifyObject } from '@/app/lib/geminiService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { imageBase64, theme } = await request.json();
  
  // 在服务器端调用 Gemini，API Key 来自环境变量
  const result = await identifyObject(imageBase64, theme);
  
  // 返回结果给前端
  return NextResponse.json(result);
}
```

## 🛡️ 安全性检查清单

- ✅ Gemini API Key 存储在 `.env.local` (不提交到 Git)
- ✅ 前端通过 API 路由调用后端
- ✅ API Key 仅在服务器环境中可用
- ✅ `process.env.GEMINI_API_KEY` 在浏览器中返回 `undefined`
- ✅ 所有 AI 功能调用都经过后端验证

## 📚 API 端点

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/gemini/identify` | POST | 识别图片中的物体 |
| `/api/gemini/speech` | POST | 文本转语音 |
| `/api/gemini/story` | POST | 生成故事内容 |
| `/api/gemini/illustration` | POST | 生成故事插图 |
| `/api/gemini/lookup` | POST | 查询单词定义 |

## 🔧 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `GEMINI_API_KEY` | Gemini API 密钥（服务器端） | `AIzaSy...` |
| `NEXT_PUBLIC_API_URL` | API 基础 URL（可选） | `http://localhost:3000` |

**注意**: 只有前缀为 `NEXT_PUBLIC_` 的变量才会暴露给浏览器。`GEMINI_API_KEY` 没有这个前缀，所以它只能在服务器端使用。

## 📝 主要变更

相比原始 Vite 应用，这个 Next.js 版本的改变：

1. **后端 API 路由**: `/app/api/gemini/*` 处理所有 AI 调用
2. **API 客户端**: `/app/utils/apiClient.ts` 提供安全的前端 API 调用
3. **Server-Side 服务**: `/app/lib/geminiService.ts` 仅在后端 API 路由中使用
4. **导入路径**: 使用 `@/` 别名而不是相对路径
5. **环境变量**: 完全分离服务器端和客户端配置

## 🎯 使用流程

1. **用户在浏览器中上传图片**
   ```
   浏览器 → apiClient.identifyObject() → /api/gemini/identify
   ```

2. **后端 API 调用 Gemini**
   ```
   /api/gemini/identify → process.env.GEMINI_API_KEY → Gemini API
   ```

3. **结果返回到前端**
   ```
   Gemini API → /api/gemini/identify → apiClient → 浏览器
   ```

## ⚠️ 常见问题

**Q: 为什么我得不到 Gemini 响应？**
A: 检查 `.env.local` 中的 `GEMINI_API_KEY` 是否正确设置。

**Q: API Key 会被泄露吗？**
A: 不会。API Key 仅存储在服务器端，浏览器无法访问。所有客户端代码都使用 `/api/gemini/*` 端点。

**Q: 如何部署到生产环境？**
A: 在部署平台（Vercel、Heroku 等）的环境变量设置中配置 `GEMINI_API_KEY`。

## 📄 许可证

MIT

---

**现在您可以安全地运行 SnapStory，而不用担心 API Key 泄露！** 🎉
