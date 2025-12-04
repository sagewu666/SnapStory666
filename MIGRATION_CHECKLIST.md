# SnapStory Next.js 迁移 - 文件结构映射

## 原始 Vite 结构 → 新 Next.js 结构

### 前端组件迁移

| 原位置 | 新位置 | 状态 |
|--------|--------|------|
| `components/` | `app/components/` | ✅ 已复制并更新导入 |
| `services/audioManager.ts` | `app/services/audioManager.ts` | ✅ 已复制 |
| `utils/soundUtils.ts` | `app/utils/soundUtils.ts` | ✅ 已复制 |

### 后端服务迁移

| 原位置 | 新位置 | 说明 |
|--------|--------|------|
| `services/geminiService.ts` | `app/lib/geminiService.ts` | ✅ 后端专用，仅在 API 路由中使用 |
| 无 | `app/api/gemini/identify/route.ts` | ✅ 新建，物体识别 API |
| 无 | `app/api/gemini/speech/route.ts` | ✅ 新建，语音生成 API |
| 无 | `app/api/gemini/story/route.ts` | ✅ 新建，故事生成 API |
| 无 | `app/api/gemini/illustration/route.ts` | ✅ 新建，插图生成 API |
| 无 | `app/api/gemini/lookup/route.ts` | ✅ 新建，单词查询 API |

### 类型定义迁移

| 原位置 | 新位置 | 说明 |
|--------|--------|------|
| `types.ts` | `app/lib/types.ts` | ✅ 共享类型定义（仅包含必要类型） |

### 工具函数迁移

| 原位置 | 新位置 | 说明 |
|--------|--------|------|
| 无 | `app/utils/apiClient.ts` | ✅ 新建，前端 API 客户端 |

### 配置文件更新

| 文件 | 原状态 | 新状态 | 说明 |
|------|--------|--------|------|
| `package.json` | Vite 配置 | Next.js 配置 | ✅ 已更新依赖和脚本 |
| `tsconfig.json` | Vite | Next.js | ✅ 已更新 |
| `.env.local` | 不存在 | ✅ 已创建 | 存储 `GEMINI_API_KEY` |
| `.gitignore` | 基础 | 扩展 | ✅ 已更新，包含 Next.js 规则 |
| 无 | 无 | `next.config.js` | ✅ 新建 |
| 无 | 无 | `app/layout.tsx` | ✅ 新建，根布局 |
| 无 | 无 | `app/page.tsx` | ✅ 新建，主应用页面 |
| 无 | 无 | `app/globals.css` | ✅ 新建，全局样式 |

## 导入路径变更

### 共享导入更新

所有组件中的导入已更新：

```typescript
// 原始 (Vite)
import { LearnedWord, Theme } from '../types';
import { audioManager } from '../services/audioManager';
import { playClick } from '../utils/soundUtils';

// 新 (Next.js)
import { LearnedWord, Theme } from '@/app/lib/types';
import { audioManager } from '@/app/services/audioManager';
import { playClick } from '@/app/utils/soundUtils';
```

### Gemini 服务调用更新

```typescript
// 原始 (直接使用 - 不安全)
import { identifyObject, generateSpeech } from '../services/geminiService';
const result = await identifyObject(imageBase64, theme);

// 新 (通过 API 客户端 - 安全)
import { apiClient } from '@/app/utils/apiClient';
const result = await apiClient.identifyObject(imageBase64, theme);
```

## 文件检查清单

### 已删除/弃用的文件

- ~~`vite.config.ts`~~ → 不需要，使用 Next.js
- ~~`index.tsx`~~ → 迁移到 `app/page.tsx`
- ~~`index.html`~~ → Next.js 自动处理
- ~~`App.tsx`~~ → 迁移到 `app/page.tsx`
- ~~`services/geminiService.ts`~~ (原位置) → 移至 `app/lib/geminiService.ts`

**注意**: 原始文件仍在项目中以供参考，可以删除以清理代码库。

### 新增文件

```
app/
├── api/
│   └── gemini/
│       ├── identify/route.ts
│       ├── speech/route.ts
│       ├── story/route.ts
│       ├── illustration/route.ts
│       └── lookup/route.ts
├── lib/
│   ├── geminiService.ts      (后端专用)
│   └── types.ts              (共享)
├── utils/
│   ├── apiClient.ts          (新增，前端安全通信)
│   └── soundUtils.ts
├── services/
│   └── audioManager.ts
├── components/
│   ├── CameraQuest.tsx        (更新导入)
│   ├── StoryBook.tsx          (更新导入)
│   ├── ... (其他组件)
├── globals.css               (新增)
├── layout.tsx                (新增，根布局)
└── page.tsx                  (新增，主应用)

next.config.js               (新增)
.env.local                   (新增)
NEXTJS_MIGRATION.md          (新增，文档)
```

## 安全性改进

### 🔐 API Key 保护

**前**: 
- API Key 可能暴露在前端代码中
- 所有调用直接使用 Gemini API

**后**:
- API Key 仅存储在 `.env.local` (服务器端)
- 前端通过 `/api/gemini/*` 路由调用
- API Key 完全隐藏，不可泄露

### 🔒 通信流程

```
浏览器                   Next.js 服务器           Gemini API
  │                           │                       │
  ├─ 请求 /api/gemini/identify ─┤                     │
  │                           ├─ 读取 process.env.GEMINI_API_KEY
  │                           │                       │
  │                           ├─ 调用 identifyObject ──┤
  │                           │                       │
  │                           │<─── 返回结果 ──────────┤
  │<─ 返回 JSON 响应 ──────────┤
```

## 部署检查清单

在部署前，确保：

- [ ] `.env.local` 文件**不在** Git 仓库中 (已在 `.gitignore`)
- [ ] 在部署平台中设置环境变量 `GEMINI_API_KEY`
- [ ] `package.json` 中的依赖都已安装
- [ ] `npm run build` 成功（无错误）
- [ ] `npm run dev` 可以正常启动

## 常见问题

**Q: 为什么要从 Vite 迁移到 Next.js？**  
A: Next.js 提供更好的后端支持，允许我们安全地存储和使用 API Key。

**Q: 原始的 Vite 文件还在吗？**  
A: 是的，可以参考，但不再使用。建议删除以避免混淆。

**Q: 如何完全清理项目？**  
A: 删除以下文件/目录：
```bash
rm -rf vite.config.ts index.html index.tsx App.tsx services/ utils/ components/ types.ts
```

---

**迁移完成！您现在有一个安全的 Next.js 前后端应用。** ✅
