# 清理指南 - 删除旧的 Vite 文件

现在您已经有了新的 Next.js 版本，可以安全地删除旧的 Vite 相关文件。

## ⚠️ 注意

在删除前，确保：
- [ ] 您已经运行过 `npm install` (Next.js 版)
- [ ] `npm run dev` 可以正常启动
- [ ] 所有功能都在新版本中正常工作
- [ ] 您有代码备份（Git 仓库）

## 可以删除的文件

### 1. Vite 配置文件
```bash
rm vite.config.ts
rm tsconfig.node.json
```

### 2. 旧入口文件
```bash
rm index.html
rm index.tsx
```

### 3. 旧 App 文件
```bash
rm App.tsx
rm types.ts  # (已迁移到 app/lib/types.ts)
```

### 4. 旧的根目录源文件
```bash
rm metadata.json  # (不需要了)
```

### 5. 旧的目录结构（如果保留了重复的）
```bash
# 如果有根目录下的 components、services、utils 目录副本，可以删除
rm -rf components  # (已复制到 app/components/)
rm -rf services    # (已复制到 app/services/)
rm -rf utils       # (已复制到 app/utils/)
```

## 一键清理脚本

如果您想自动清理，运行这个脚本：

```bash
#!/bin/bash
echo "⚠️  即将删除所有旧的 Vite 文件..."
echo "确保您已有备份！按 Ctrl+C 取消"
sleep 3

# 删除 Vite 配置
rm -f vite.config.ts tsconfig.node.json

# 删除旧入口文件
rm -f index.html index.tsx App.tsx types.ts metadata.json

# 删除旧的源目录（谨慎！）
# 取消下面注释后再运行
# rm -rf components services utils

echo "✅ 清理完成！"
echo ""
echo "剩余的根目录文件："
ls -la | grep -E "^\." | head -5
```

## 验证清理

清理后，您的项目应该看起来像这样：

```
SnapStory666/
├── app/                          # Next.js 应用（保留）
│   ├── api/
│   ├── components/
│   ├── lib/
│   ├── utils/
│   ├── services/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── public/                       # 公共文件（如有）
├── package.json                  # ✅ 已更新
├── tsconfig.json                 # ✅ 已更新
├── next.config.js                # ✅ 新建
├── .env.local                    # ✅ 新建（不在 Git 中）
├── .gitignore                    # ✅ 已更新
├── README.md                     # ✅ 已更新
├── NEXTJS_MIGRATION.md           # ✅ 新建
├── MIGRATION_CHECKLIST.md        # ✅ 新建
├── MIGRATION_SUMMARY.md          # ✅ 新建
├── CLEANUP.md                    # 本文件
│
├── ❌ index.html                 # 删除
├── ❌ index.tsx                  # 删除
├── ❌ App.tsx                     # 删除
├── ❌ types.ts                    # 删除
├── ❌ vite.config.ts              # 删除
├── ❌ tsconfig.node.json          # 删除
└── ❌ metadata.json               # 删除
```

## 删除后的验证

运行以下命令确保一切正常：

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中访问 http://localhost:3000
```

## 恢复

如果您误删了重要文件，可以从 Git 历史恢复：

```bash
# 查看删除的文件
git status

# 恢复单个文件
git checkout -- <filename>

# 恢复所有文件
git reset --hard HEAD
```

## Git 历史清理（可选）

如果您想完全清理 Git 历史，删除所有旧的 Vite 文件记录：

```bash
# ⚠️ 这是不可逆的操作！
# 不推荐，除非您知道自己在做什么

# 仅删除特定文件的历史
git filter-branch --tree-filter 'rm -f vite.config.ts index.html index.tsx App.tsx types.ts' HEAD

# 或者使用 git-filter-repo（推荐）
pip install git-filter-repo
git filter-repo --path vite.config.ts --path index.html --path index.tsx --path App.tsx --path types.ts
```

---

**清理完成！您现在有一个干净的 Next.js 项目。** ✨
