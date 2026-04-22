# 🚀 CRM 原型 - 快速参考卡

## 即刻可用！✅

```
🌐 访问地址: http://127.0.0.1:3000/
✅ 开发服务器: 运行中
✅ 所有依赖: 已安装
✅ 热模块更新: 已启用
```

---

## 📱 应用演示

### 三个主要模块

| 模块 | 功能 | 快捷键 |
|------|------|--------|
| **线索管理** | 客户线索CRUD、搜索、分配 | 点击左侧菜单 |
| **AI推客** | 智能客户分析、推荐话术 | 点击左侧菜单 |
| **销售画像** | 业绩分析、统计表格 | 点击左侧菜单 |

### 角色切换

- 👔 **主管视角**: 看全部数据 + 管理功能
- 👨‍💼 **销售视角**: 看个人数据

在顶部头部选择角色即可切换。

---

## 🛠 开发常用命令

```bash
# 启动开发环境（已运行 ✅）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 安装新依赖
npm install <package-name>

# 检查依赖漏洞
npm audit
```

---

## 📝 修改样式

**最快的方式**: 编辑 `className` 中的 Tailwind 类名

```jsx
// 例如：修改按钮样式
<button className="px-4 py-2 bg-blue-600 text-white rounded-full">
  点击
</button>

// 改为：
<button className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700">
  点击
</button>
```

保存后自动刷新 ✨

---

## 🎨 常用 Tailwind 类名速查

### 颜色
```
bg-blue-50/100/200/.../900  (背景)
text-blue-50/100/.../900    (文字)
border-blue-50/.../900      (边框)
```

### 间距
```
p-1/2/3/4/6/8    (内间距)
m-1/2/3/4/6/8    (外间距)
gap-1/2/3/4/6/8  (间隔)
```

### 布局
```
flex           (弹性布局)
grid           (网格布局)
flex-col       (垂直方向)
justify-*      (水平对齐)
items-*        (垂直对齐)
```

### 尺寸
```
w-full, w-1/2, w-screen
h-full, h-screen
rounded-lg, rounded-full
```

---

## 🎯 快速图标查询

### 最常用的图标

```jsx
import { 
  Plus,           // 新增
  Edit,           // 编辑
  Trash2,         // 删除
  Search,         // 搜索
  Download,       // 下载
  Upload,         // 上传
  ChevronDown,    // 下箭头
  ChevronUp,      // 上箭头
  Building2,      // 公司
  Users,          // 用户
  TrendingUp,     // 上升
} from 'lucide-react';
```

查看全部: https://lucide.dev/icons

---

## 🔧 文件编辑位置

### 需要修改什么？

| 需求 | 文件位置 |
|------|----------|
| 修改线索模块 | `src/modules/LeadsModule.jsx` |
| 修改AI推客 | `src/modules/PitchModule.jsx` |
| 修改销售画像 | `src/modules/ProfileModule.jsx` |
| 修改导航栏 | `src/components/SystemSidebar.jsx` |
| 修改头部 | `src/components/SystemHeader.jsx` |
| 添加全局样式 | `src/index.css` |
| 配置主题色 | `tailwind.config.js` |

---

## 🐛 遇到问题？

### 常见问题速解

| 问题 | 解决方案 |
|------|----------|
| 样式不生效 | 清除浏览器缓存 (Ctrl+Shift+Delete) |
| 图标不显示 | 重启开发服务器 (npm run dev) |
| 页面不更新 | 检查文件是否保存，硬刷新 (Ctrl+Shift+R) |
| 端口被占用 | 修改 `vite.config.js` 中的 port |
| 依赖冲突 | 删除 node_modules，重新 npm install |

---

## 📚 学习资源

### 官方文档
- [React 18](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite](https://vitejs.dev)

### 视频教程（推荐）
- Tailwind CSS 完整速成课
- React Hooks 详解
- Vite 快速上手

---

## 🎊 现在就开始！

1. ✅ 打开浏览器: http://127.0.0.1:3000/
2. ✅ 查看应用界面
3. ✅ 打开 VSCode 编辑代码
4. ✅ 修改后自动更新

---

## 📞 项目文档

| 文档 | 适合场景 |
|------|---------|
| **README.md** | 快速了解项目 |
| **SETUP_GUIDE.md** | 学习如何开发 |
| **DEPENDENCIES_REPORT.md** | 了解依赖详情 |
| **PROJECT_STATUS.md** | 查看项目进度 |
| **TECHNICAL_VERIFICATION.md** | 技术验证报告 |

---

## ⚡ 快速启动命令

```bash
# 一键启动（已完成 ✅）
cd "/Users/connor/Desktop/靠铺/CRM/AI 原型/CRM原型" && npm run dev

# 应用地址
http://127.0.0.1:3000/
```

---

**🎯 你的开发环境已完全准备好，立即开始编码！** 🚀
