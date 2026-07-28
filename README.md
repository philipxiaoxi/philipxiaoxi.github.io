# 杰西的自习室

个人技术博客：一个全栈开发者的技术自习与实战分享。

- 站点：https://philipxiaoxi.github.io
- 框架：[Astro](https://astro.build/) Blog 模版（极简 Bear 风）
- 部署：GitHub Pages（GitHub Actions）

## 本地开发

需要 Node.js ≥ 22.12。

```sh
npm install
npm run dev
```

浏览器打开 `http://localhost:4321`。

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建到 `./dist/` |
| `npm run preview` | 预览构建结果 |

## 写文章

在 `src/content/blog/` 下新建 Markdown（或 MDX）文件，frontmatter 示例：

```md
---
title: '文章标题'
description: '一句话摘要'
pubDate: 'Jul 28 2026'
# updatedDate: 'Jul 29 2026'
# heroImage: './assets/cover.jpg'
---

正文从这里开始。
```

站点标题、描述、导航与社交链接集中在 `src/consts.ts`。

## 部署到 GitHub Pages

1. 将本仓库推送到 **`philipxiaoxi/philipxiaoxi.github.io`**（用户站根路径，无需 `base`）。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 推送到 `main` 后，工作流 `.github/workflows/deploy.yml` 会自动构建并发布。

本地可先验证构建：

```sh
npm run build && npm run preview
```

## 项目结构（简要）

```text
src/
  components/     # BaseHead、Header、Footer、图标等
  content/blog/   # 文章（Markdown / MDX）
  layouts/        # BaseLayout 页面壳、BlogPost 文章布局
  pages/          # 路由页面
  styles/         # 全局样式
  consts.ts       # 站点常量
```

## 许可

内容版权归作者所有。基于 [Astro Blog starter](https://github.com/withastro/astro/tree/main/examples/blog) 与 [Bear Blog](https://github.com/HermanMartinus/bearblog/) 风格。
