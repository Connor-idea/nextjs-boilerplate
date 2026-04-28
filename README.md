# CRM 统一工作台

一个基于 React + Tailwind CSS + Lucide Icons 的企业级 CRM 管理系统。

## 📦 依赖清单

### 核心依赖
- **React** (^18.2.0)
- **React DOM** (^18.2.0)
- **Lucide React** (^0.263.1)
- **xlsx** (^0.18.5) - Excel 导入导出
- **@vercel/analytics** - Vercel 访问数据分析
- **@vercel/speed-insights** - Vercel 性能监控

### 构建工具
- **Vite** (^4.4.0)
- **@vitejs/plugin-react** (^4.0.0)
- **Tailwind CSS** (^3.3.0)
- **PostCSS** (^8.4.0)
- **Autoprefixer** (^10.4.0)

## 🚀 快速开始

```bash
npm install
npm run dev          # 开发服务器，保存即刷新，访问 http://127.0.0.1:3000
npm run build        # 构建生产版本
npm run deploy       # 构建 + 自动提交并推送到 GitHub（触发 Vercel 自动部署）
npm run watch        # 监听 src/ 文件变动，自动提交推送
```

## 📁 项目结构

```
CRM原型/
├── src/
│   ├── components/
│   │   ├── SystemSidebar.jsx    # 左侧导航栏（支持多级可折叠菜单）
│   │   ├── SystemHeader.jsx     # 顶部头部
│   │   └── Toast.jsx            # 全局消息提示
│   ├── modules/
│   │   ├── LeadsModule.jsx          # 线索管理
│   │   ├── AITuigke.jsx             # AI 推客
│   │   ├── ProfileModule.jsx        # 销售画像
│   │   ├── AIAssignPage.jsx         # AI 智能分配
│   │   ├── SupplierReconciliation.jsx  # 财务管理 – 供应商结算
│   │   └── Placeholder.jsx          # 开发中占位页
│   ├── constants/
│   │   └── salesData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── auto-push.mjs            # 监听 src/ 自动提交推送脚本
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── vercel.json
```

## 📊 已实现功能模块

| 模块 | 状态 | 说明 |
|---|---|---|
| 线索管理 | ✅ 完成 | 列表/详情/导入/AI分配 |
| AI 推客 | ✅ 完成 | 智能话术推荐 |
| 销售画像 | ✅ 完成 | 销售人员画像分析 |
| AI 智能分配 | ✅ 完成 | 线索自动分配 |
| 财务–供应商结算 | ✅ 完成 | 对账单列表/详情/筛选/分页 |
| 其他财务子模块 | 🚧 开发中 | 系统服务费/员工对账单等 |
| 客户管理 | 🚧 开发中 | - |
| 渠道管理 | 🚧 开发中 | - |
| 个人中心 | 🚧 开发中 | - |

## 🔄 自动部署

项目已配置 GitHub + Vercel 自动流水线：
1. `npm run deploy` 或 `git push origin main`
2. Vercel 自动识别推送并重新部署
3. 部署完成后即可访问线上地址

## 🎨 UI 特性

- **Tailwind CSS**: 完整的原子化样式系统
- **Lucide Icons**: 50+ 精美图标
- **响应式设计**: 完全适配各种屏幕尺寸
- **Dark Mode Ready**: 可扩展为深色模式
- **平滑动画**: 使用 Tailwind 原生动画

## 📋 功能模块

### 1. 线索管理 (LeadsModule)
- 线索列表展示
- 批量导入功能
- 名片 OCR 识别
- 快速搜索和过滤

### 2. AI 推客 (PitchModule)
- 企业需求分析
- AI 推荐话术
- 跟进记录时间轴
- 公司信息补充

### 3. 销售画像 (ProfileModule)
- 团队业绩分析
- 个人客户统计
- 业绩漏斗展示
- 趋势对比分析

## 🛠️ 常见命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm install` | 安装依赖 |

## 🌐 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 📝 许可证

私有项目

## 👨‍💻 开发者

创建于 2024 年 4 月
