# AI 推客快速开始指南

## 📌 概览

**AITuigke.jsx** 是一个完整的企业级销售线索跟进系统，集成：
- 🤖 AI 推荐评分与建议
- 👥 联系人图谱管理  
- 📊 跟进历史时间轴
- 📝 表单工作流管理
- 🎯 批量线索处理

---

## 🎯 核心功能模块

### 1️⃣ **线索目录抽屉** (DirectoryDrawer)
- 快速切换线索
- 分类展示：待跟进 / 已处理 / 暂存草稿
- 支持骨架屏加载动画

### 2️⃣ **公司信息展示** (CompanyInfoSection)
- 企业基础信息卡片
- AI 业务需求分析
- 风险提示与动态更新
- 手动备注功能（只增不删）

### 3️⃣ **历史跟进记录** (FollowUpHistorySection)
- 时间轴展示所有跟进动作
- 支持折叠/展开
- 操作类型分类（线索无效/退回/正常跟进）

### 4️⃣ **联系人图谱** (ContactsSection)
- 多人管理
- 一键复制联系方式
- AI 推荐破冰话术
- 联系人备注同步

### 5️⃣ **悬浮操作表单** (ActionSection)
- 填写跟进记录
- 标记线索无效
- 退回客户至公海
- 暂存为草稿

---

## 🚀 集成步骤

### Step 1: 导入模块
```javascript
// 在你的路由文件中
import AITuigkeApp from '@/modules/AITuigke';

// 配置路由或菜单
<Route path="/ai-tuigke" element={<AITuigkeApp />} />
```

### Step 2: 关键 Props 说明

该应用为**自包含组件**，无需传入 Props，使用内部状态管理。

```javascript
// AITuigkeApp 内部状态：
- leads：线索数组
- currentLeadId：当前选中线索ID
- isLoading：加载状态
- toastMessage：通知消息
```

### Step 3: 数据对接

修改 `initialLeads` 常量以连接真实数据源：

```javascript
// 调用你的后端 API
const fetchLeads = async () => {
  const response = await fetch('/api/leads');
  return response.json();
};

// 在组件中替换
const [leads, setLeads] = useState(initialLeads);
// 改为：
useEffect(() => {
  fetchLeads().then(setLeads);
}, []);
```

---

## 📊 数据结构

### Lead 对象格式
```javascript
{
  id: 'LD-2024-08997',
  name: '企业名称',
  status: 'pending' | 'completed' | 'draft',
  score: 99,  // AI评分 0-100
  time: '11:00',
  daysUncontacted: 3,
  source: '线索来源描述',
  companyNotes: [
    {
      id: 201,
      text: '备注内容',
      date: '2024-03-20 14:00'
    }
  ],
  history: [
    {
      id: 3,
      date: '2024-02-10 16:00',
      sales: '跟进人姓名',
      type: '线下拜访',
      contact: '联系人姓名',
      note: '跟进记录',
      tag: '标记'
    }
  ]
}
```

### Contact 对象格式
```javascript
{
  id: 1,
  name: '张一鸣',
  position: '销售副总裁',
  tags: ['推荐触达', '决策者'],
  phones: ['138-xxxx-8888'],
  wechat: 'zhang_sales_vp',
  email: 'zym@company.com',
  social: '抖音: xx (1.2w粉)',
  pitch: 'AI推荐话术',
  aiAdvice: 'AI跟进建议',
  notes: [
    {
      id: 101,
      text: '备注',
      date: '2024-03-25 10:30'
    }
  ]
}
```

---

## 🎨 样式定制

### Tailwind 颜色方案
| 元素 | 颜色 | Tailwind 类 |
|------|------|-----------|
| 主按钮 | 蓝色 | bg-blue-600 |
| 成功提示 | 绿色 | bg-emerald-50 |
| 警告提示 | 橙色 | bg-orange-500 |
| 错误提示 | 红色 | bg-red-600 |
| AI推荐 | 紫色 | from-indigo-50 |

### 快速修改配色
```javascript
// 在组件中搜索替换 Tailwind 类
'bg-blue-600' → 'bg-purple-600'  // 修改主题色
'text-emerald-700' → 'text-green-700'  // 修改成功色
```

---

## 🔧 常见问题解答

### Q1: 如何实现真实的数据保存？
**A**: 在每个 handleSave* 函数中添加 API 调用：
```javascript
const handleSaveNote = async () => {
  // 现有逻辑...
  await fetch('/api/notes', {
    method: 'POST',
    body: JSON.stringify({ leadId, note: newNoteText })
  });
};
```

### Q2: 如何与 CRM 主系统集成？
**A**: 通过状态提升或 Context：
```javascript
// 在上级组件中共享状态
<AITuigkeApp leads={globalLeads} onUpdate={updateGlobalLeads} />
```

### Q3: 如何禁用某些功能？
**A**: 添加权限判断：
```javascript
{userRole === 'admin' && (
  <button onClick={handleDelete}>删除</button>
)}
```

### Q4: 如何支持移动端适配？
**A**: 已内置 Tailwind 响应式设计，仅需调整：
```javascript
// 修改断点关键字
'sm:w-[540px]' → 'md:w-[540px]'  // 更大屏幕
'xl:col-span-7' → 'lg:col-span-6'  // 调整布局
```

---

## 📱 响应式设计支持

| 设备 | 宽度 | 表现 |
|------|------|------|
| 手机 | < 640px | 单列布局，侧边栏隐藏 |
| 平板 | 640-1024px | 两列布局 |
| 桌面 | > 1024px | 三栏完整布局 |

---

## ⚡ 性能优化技巧

### 1. 减少重新渲染
```javascript
// ✅ 使用 React.memo 包装列表项
const LeadItem = React.memo(({ lead }) => (...));
```

### 2. 虚拟化长列表
```javascript
// 当联系人超过 100+ 时，使用 react-window
import { FixedSizeList } from 'react-window';
```

### 3. 代码分割
```javascript
// 动态导入组件
const AITuigke = lazy(() => import('./modules/AITuigke'));
```

---

## 🐛 调试技巧

### 启用 React DevTools
```javascript
// 在浏览器 DevTools → React 标签下：
1. 选中组件
2. 查看 Props 和 State
3. 设置断点跟踪状态变化
```

### 检查性能
```javascript
// Chrome DevTools → Performance 标签：
1. 记录操作
2. 查找长任务 (> 50ms)
3. 优化关键路径
```

### 检查内存泄漏
```javascript
// Chrome DevTools → Memory 标签：
1. 获取堆快照
2. 分离对象（detached nodes）
3. 识别增大的数组
```

---

## 📚 技术栈

| 库 | 版本 | 用途 |
|----|------|------|
| React | 18.x | UI 框架 |
| Tailwind CSS | 3.x | 样式 |
| Lucide React | Latest | 图标 |
| Vite | 4.5.x | 构建工具 |

---

## 🔒 安全考虑

⚠️ **注意**：
- 复制功能使用 `document.execCommand()` (已过时但兼容性好)  
  → 建议将来迁移到 Clipboard API
- Toast 中的消息日志暴露用户操作  
  → 生产环境需添加敏感词过滤

```javascript
// 推荐改进
const secureCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Clipboard API error');
  }
};
```

---

## 📞 支持与反馈

遇到问题？提交 GitHub Issue 或联系开发团队。

**最后更新**: 2026-04-15  
**维护状态**: ✅ Active
