# CRM 统一工作台

一个基于 React + Tailwind CSS + Lucide Icons 的企业级 CRM 管理系统。

## 📦 依赖清单

### 核心依赖
- **React** (^18.2.0) - UI 框架
- **React DOM** (^18.2.0) - React 渲染库
- **Lucide React** (^0.263.1) - 图标库

### 构建工具
- **Vite** (^4.4.0) - 极速前端构建工具
- **@vitejs/plugin-react** (^4.0.0) - Vite React 插件

### 样式框架
- **Tailwind CSS** (^3.3.0) - 原子化 CSS 框架
- **PostCSS** (^8.4.0) - CSS 转换工具
- **Autoprefixer** (^10.4.0) - 自动添加浏览器前缀

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

或使用 yarn:

```bash
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将自动打开浏览器，访问 `http://127.0.0.1:3000`

### 3. 构建生产版本

```bash
npm run build
```

生产文件将生成在 `dist/` 目录

### 4. 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
CRM原型/
├── src/
│   ├── components/          # 通用组件
│   │   ├── SystemSidebar.jsx    # 左侧导航栏
│   │   ├── SystemHeader.jsx     # 顶部头部
│   │   └── Toast.jsx            # 消息提示
│   ├── modules/             # 功能模块
│   │   ├── LeadsModule.jsx      # 线索管理
│   │   ├── PitchModule.jsx      # AI 推客
│   │   └── ProfileModule.jsx    # 销售画像
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 应用入口
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # npm 配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
└── .gitignore               # Git 忽略文件
```

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
