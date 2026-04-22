# CRM 原型 - 快速设置指南

## 🎯 快速开始（3 步）

### 第一步: 检查 Node.js 环境
```bash
node --version    # 应该是 v14 或更高版本
npm --version     # 应该是 v6 或更高版本
```

### 第二步: 安装依赖
```bash
cd "/Users/connor/Desktop/靠铺/CRM/AI 原型/CRM原型"
npm install
```

### 第三步: 启动开发服务器
```bash
npm run dev
```

浏览器会自动打开 http://127.0.0.1:3000

---

## 📦 依赖概览

### 必需库（已安装）

| 库名 | 版本 | 用途 |
|------|------|------|
| `react` | 18.2.0 | UI 框架 |
| `react-dom` | 18.2.0 | DOM 渲染 |
| `lucide-react` | 0.263.1 | 图标库 |
| `tailwindcss` | 3.3.0 | 样式框架 |
| `vite` | 4.5.14 | 构建工具 |

### 开发工具（已安装）
- `@vitejs/plugin-react` - React 热更新
- `postcss` - CSS 后处理
- `autoprefixer` - 浏览器前缀

---

## 🎨 UI 框架说明

### Tailwind CSS - 样式系统

**优点:**
- 原子化设计，无需写 CSS
- 响应式类名内置（`md:`, `lg:` 等）
- 内置暗黑模式支持
- 性能优化（只打包用到的样式）

**常用类名示例:**
```jsx
<div className="flex items-center justify-between p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
  {/* flex: 弹性布局 */}
  {/* items-center: 垂直居中 */}
  {/* justify-between: 水平分散 */}
  {/* p-6: 内间距 */}
  {/* bg-white: 白色背景 */}
  {/* rounded-lg: 圆角 */}
  {/* border border-slate-200: 边框 */}
  {/* shadow-sm: 阴影 */}
</div>
```

### Lucide Icons - 图标库

**优点:**
- 精美 SVG 图标
- 可自定义颜色和大小
- 一致的设计风格
- 完全可配置

**使用示例:**
```jsx
import { Building2, Search, Plus } from 'lucide-react';

<Building2 size={24} className="text-blue-600" />
<Search size={16} className="text-slate-400" />
<Plus size={18} className="text-white" />
```

---

## 📁 项目结构说明

### src/components - 共享组件
存放在多个模块中都能用到的组件

```
components/
├── SystemSidebar.jsx   # 左侧导航栏（模块切换）
├── SystemHeader.jsx    # 顶部头部（搜索、用户菜单）
└── Toast.jsx          # 消息提示组件（全局通知）
```

### src/modules - 功能模块
每个模块代表应用的一个主要功能区域

```
modules/
├── LeadsModule.jsx     # 线索管理（客户线索CRUD）
├── PitchModule.jsx     # AI推客（智能客户分析）
└── ProfileModule.jsx   # 销售画像（业绩分析）
```

### src/App.jsx - 主应用
路由分发和全局状态管理

```
App.jsx
├── 状态管理（activeModule, userRole）
├── 模块路由
└── 全局 Toast 消息
```

---

## 🚀 常见开发任务

### 任务 1: 修改样式
只需修改 `className` 中的 Tailwind 类名，保存后自动热更新

```jsx
// 修改前
<button className="px-4 py-2 bg-blue-600 text-white rounded-full">
  点击
</button>

// 修改后
<button className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700">
  点击
</button>
```

### 任务 2: 添加新图标
1. 在 Lucide 官网查找图标: https://lucide.dev/
2. 在文件顶部导入

```jsx
import { StarIcon, HeartIcon, ShareIcon } from 'lucide-react';

// 使用
<StarIcon size={20} className="text-yellow-500" />
```

### 任务 3: 修改颜色方案
编辑 `src/index.css` 或使用 Tailwind 内置颜色

```jsx
// 使用预设颜色
<div className="bg-blue-50 text-blue-700 border-blue-200">
  蓝色方案
</div>

// 自定义
<div style={{ color: '#FF6B6B' }}>
  自定义颜色
</div>
```

---

## 🎮 交互演示

### 查看应用功能

1. **左侧导航栏** - 点击不同模块切换功能
2. **顶部头部** - 选择不同的用户角色（主管/销售）
3. **消息提示** - 操作后会看到成功/失败的 Toast
4. **响应式** - 缩小浏览器窗口看移动端效果

### 测试用户角色

- **主管视角**: 看到全部数据和管理功能
- **销售视角**: 只能看到自己的数据

---

## 📚 学习资源

### Tailwind CSS
- 官方文档: https://tailwindcss.com/docs
- 类名参考: https://tailwindcss.com/docs/margin
- 配置指南: https://tailwindcss.com/docs/configuration

### Lucide Icons
- 官方网站: https://lucide.dev/
- 图标搜索: https://lucide.dev/icons
- React 用法: https://lucide.dev/guide/packages/lucide-react

### React 18
- 官方文档: https://react.dev/
- Hooks 指南: https://react.dev/reference/react

### Vite
- 官方文档: https://vitejs.dev/
- 配置参考: https://vitejs.dev/config/

---

## 🔧 常见问题排查

### 问题 1: 样式不生效
**症状**: 修改 className 后没有变化
**解决**:
1. 检查 classroom 是否拼写正确
2. 清除浏览器缓存（Ctrl+Shift+Delete）
3. 重启开发服务器

### 问题 2: 图标不显示
**症状**: 图标位置显示空白
**解决**:
1. 确认导入语句正确
2. 检查图标名称是否存在
3. 硬刷新浏览器（Ctrl+Shift+R）

### 问题 3: 热更新不工作
**症状**: 修改代码后页面没有刷新
**解决**:
1. 检查文件是否成功保存
2. 查看终端是否有错误信息
3. 重启开发服务器：`npm run dev`

### 问题 4: 端口 3000 已被占用
**症状**: 启动时报错 "Port 3000 is already in use"
**解决**:
```bash
# 方式 1: 改用其他端口
# 编辑 vite.config.js，改变 port 值

# 方式 2: 杀死占用进程 (macOS/Linux)
lsof -i :3000
kill -9 <PID>

# 方式 2: 杀死占用进程 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🎯 下一步任务

### 第 1 阶段: 熟悉现有代码
- [ ] 审查 `src/App.jsx` 的全局架构
- [ ] 理解 `SystemSidebar.jsx` 的模块切换逻辑
- [ ] 查看各模块的文件结构

### 第 2 阶段: 实现基础功能
- [ ] 完成线索详情页面
- [ ] 添加搜索和过滤功能
- [ ] 实现批量操作

### 第 3 阶段: 数据可视化
- [ ] 安装 `recharts`
- [ ] 创建统计图表
- [ ] 实现销售漏斗展示

### 第 4 阶段: 后端对接
- [ ] 安装 `axios`
- [ ] 实现 API 调用
- [ ] 添加数据同步

---

## 📞 调试技巧

### 1. React Developer Tools
安装浏览器扩展，查看组件树和状态

### 2. 控制台日志
```jsx
console.log('调试信息:', data);
console.table(array);  // 表格显示
```

### 3. Vite 快速启动命令
```bash
npm run dev -- --open          # 自动打开浏览器
npm run build -- --mode test   # 测试模式构建
```

---

## ✅ 开发检查清单

在提交代码前，确保：

- [ ] 所有功能都已测试
- [ ] 没有控制台错误
- [ ] 响应式在手机/平板正常
- [ ] 代码遵循项目规范
- [ ] 更新了相关文档

---

**准备好开发了吗？** 开启终端，运行 `npm run dev`！🚀
