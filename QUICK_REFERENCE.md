# SnapStory Next.js - 快速参考卡

## 🚀 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置 API Key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# http://localhost:3000
```

## 📁 关键文件位置

| 用途 | 位置 | 说明 |
|------|------|------|
| 前端应用入口 | `app/page.tsx` | 主应用组件 |
| API 端点 | `app/api/gemini/*` | 5 个后端 API 路由 |
| 后端 Gemini 服务 | `app/lib/geminiService.ts` | 仅服务器端使用 |
| 前端 API 客户端 | `app/utils/apiClient.ts` | 安全的 API 调用 |
| 全局样式 | `app/globals.css` | Tailwind CSS |
| 环境变量 | `.env.local` | API Key 配置（不提交 Git） |

## 🔐 API Key 管理

**✅ 安全做法**
```bash
# 1. 创建 .env.local (仅本地)
GEMINI_API_KEY=your_key_here

# 2. 在服务器环境变量中设置 (生产)
# Vercel/Netlify/云服务器设置
```

**❌ 不安全做法**
```bash
# 不要在代码中硬编码
const API_KEY = "AIzaSy...";

# 不要提交到 Git
git add .env.local  # ❌ NO! 已在 .gitignore

# 不要在浏览器中使用
// fetch(...) 中使用 API_KEY  # ❌ NO!
```

## 📝 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 生产
npm run build            # 构建项目
npm start                # 启动生产服务器

# 检查
npm run lint             # 运行 ESLint

# 清理
npm run dev              # 删除 .next 目录
```

## 🔗 API 端点参考

### 物体识别
```bash
POST /api/gemini/identify
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,...",
  "theme": { "id": "...", "label": "..." }
}
```

### 文本转语音
```bash
POST /api/gemini/speech
Content-Type: application/json

{
  "text": "Hello world"
}
```

### 故事生成
```bash
POST /api/gemini/story
Content-Type: application/json

{
  "learnedWords": [{ "word": "apple", ... }],
  "theme": { ... },
  "kidProfile": { "ageGroup": "6-8", ... },
  "userPrompt": "optional prompt"
}
```

### 图片生成
```bash
POST /api/gemini/illustration
Content-Type: application/json

{
  "prompt": "A happy child...",
  "style": "storybook style",
  "characterVisual": "a girl"
}
```

### 单词查询
```bash
POST /api/gemini/lookup
Content-Type: application/json

{
  "word": "butterfly",
  "context": "The butterfly flew...",
  "ageGroup": "6"
}
```

## 🎯 前端使用 API

```typescript
import { apiClient } from '@/app/utils/apiClient';

// 所有调用都是安全的（通过后端）
const result = await apiClient.identifyObject(imageBase64, theme);
const audio = await apiClient.generateSpeech(text);
const story = await apiClient.generateStory(words, theme, profile);
const image = await apiClient.generateIllustration(prompt, style, visual);
const definition = await apiClient.lookupWord(word, context, ageGroup);
```

## 📊 项目统计

| 项目 | 数量 |
|------|------|
| API 端点 | 5 个 |
| React 组件 | 12 个 |
| 后端服务 | 1 个 (app/lib/geminiService.ts) |
| 工具函数 | 2 个 (apiClient, soundUtils) |
| 文档 | 4 个 (README, NEXTJS_MIGRATION, 等) |

## 🔍 验证设置

```bash
# 1. 检查 .env.local 存在
test -f .env.local && echo "✅ .env.local 存在" || echo "❌ 需要创建"

# 2. 检查 npm 依赖
npm ls @google/genai 2>/dev/null | head -1

# 3. 编译检查
npm run build

# 4. 运行检查
npm run dev &
sleep 5
curl http://localhost:3000 && echo "✅ 服务器运行中"
kill %1
```

## 🐛 故障排除

| 问题 | 解决方案 |
|------|--------|
| "Cannot find module '@google/genai'" | 运行 `npm install` |
| "GEMINI_API_KEY not set" | 检查 `.env.local` 文件 |
| API 请求 500 错误 | 检查 API Key 有效性，查看服务器日志 |
| 前端仍看到 API Key | 重启开发服务器，清除浏览器缓存 |

## 📚 相关文档

- 📖 [README.md](./README.md) - 项目概述
- 🔐 [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md) - 迁移详情
- ✅ [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - 文件映射
- 📊 [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - 总结报告
- 🧹 [CLEANUP.md](./CLEANUP.md) - 清理指南

## 🌐 部署清单

- [ ] `.env.local` 不在 Git 中
- [ ] `.gitignore` 包含 `.env.local`
- [ ] 在部署平台中设置 `GEMINI_API_KEY`
- [ ] `npm run build` 成功
- [ ] `npm run dev` 正常启动
- [ ] 所有功能都已测试

## 💡 最佳实践

✅ **安全**
- API Key 仅在服务器端
- 使用 `apiClient` 进行 API 调用
- 定期轮换 API Key

✅ **性能**
- 使用 Next.js 图片优化
- 启用缓存
- 异步处理 AI 调用

✅ **可维护性**
- 保持导入路径一致
- 使用 TypeScript
- 添加错误处理

---

**有任何问题？** 查看 [README.md](./README.md) 或 [NEXTJS_MIGRATION.md](./NEXTJS_MIGRATION.md)

**需要清理旧文件？** 参考 [CLEANUP.md](./CLEANUP.md)
