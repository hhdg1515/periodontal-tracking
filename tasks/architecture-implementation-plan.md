# 架构升级实施计划

## 目标
将现有的牙周病追踪系统升级为可扩展的多服务牙科平台，支持：
- 牙齿美容
- 拔牙
- 种植牙
- 未来更多服务

并为 Firebase 集成做好准备。

---

## 实施原则
遵循 Claude Rules：
1. ✅ 每个任务尽可能简单
2. ✅ 最小化代码改动
3. ✅ 逐步验证，不做大规模重构
4. ✅ 保持现有功能正常运行

---

## 阶段 1: 服务抽象层 (POC) - 第1周

### 任务 1.1: 创建服务接口定义
- [ ] 创建 `lib/services/base/storage.interface.ts`
  - 定义 `IStorageService` 接口
  - 定义基础 CRUD 方法
  - 定义文件操作方法

### 任务 1.2: 实现 LocalStorage 服务
- [ ] 创建 `lib/services/base/local.service.ts`
  - 实现 `IStorageService` 接口
  - 实现 get, list, create, update, delete 方法
  - 添加错误处理

### 任务 1.3: 创建服务工厂
- [ ] 创建 `lib/services/factory.ts`
  - 实现 ServiceFactory 类
  - 支持动态选择存储类型 (local/firebase)

### 任务 1.4: 试点迁移一个 Hook
- [ ] 选择 `use-patients.ts` 作为试点
- [ ] 重构为使用 ServiceFactory
- [ ] 测试功能是否正常
- [ ] 如果成功，继续；如果失败，调整方案

### 验收标准
- ✅ 患者列表页面功能正常
- ✅ 添加患者功能正常
- ✅ 数据仍存储在 localStorage
- ✅ 代码更清晰，易于切换数据源

---

## 阶段 2: 完整服务层迁移 - 第2-3周

### 任务 2.1: 迁移所有患者相关 Hooks
- [ ] 迁移 `use-patients.ts`
- [ ] 迁移 `use-patient.ts`
- [ ] 测试所有患者功能

### 任务 2.2: 迁移访问记录 Hooks
- [ ] 迁移 `use-visits.ts`
- [ ] 迁移 `use-visit.ts`
- [ ] 测试访问记录功能

### 任务 2.3: 迁移 X-ray Hooks
- [ ] 迁移 `use-xrays.ts`
- [ ] 迁移 `use-xray.ts`
- [ ] 测试 X-ray 上传和显示

### 任务 2.4: 迁移分析 Hooks
- [ ] 迁移 `use-analyses.ts`
- [ ] 迁移 `use-clinical-assessment.ts`
- [ ] 测试分析和评估功能

### 验收标准
- ✅ 所有现有功能正常工作
- ✅ 代码使用统一的服务层
- ✅ 易于切换到 Firebase

---

## 阶段 3: 模块化重组 - 第4-5周

### 任务 3.1: 创建模块配置系统
- [ ] 创建 `lib/config/modules.config.ts`
  - 定义模块配置接口
  - 添加牙周病模块配置
  - 添加美容、种植、拔牙模块配置 (disabled)

### 任务 3.2: 创建 modules 目录结构
```
modules/
├── shared/
│   ├── patients/
│   ├── visits/
│   └── images/
└── periodontal/
    ├── components/
    ├── hooks/
    ├── services/
    └── types/
```

### 任务 3.3: 移动牙周病相关代码
- [ ] 移动 `components/clinical/` → `modules/periodontal/components/`
- [ ] 移动 `components/comparison/` → `modules/periodontal/components/`
- [ ] 移动 `lib/types/clinical.ts` → `modules/periodontal/types/`
- [ ] 更新所有导入路径

### 任务 3.4: 移动共享代码
- [ ] 移动 `components/patients/` → `modules/shared/patients/components/`
- [ ] 移动 `lib/hooks/use-patients.ts` → `modules/shared/patients/hooks/`
- [ ] 更新所有导入路径

### 任务 3.5: 更新路由结构
- [ ] 重命名 `app/dashboard/compare/` → `app/dashboard/periodontal/compare/`
- [ ] 重命名 `app/dashboard/analyses/` → `app/dashboard/periodontal/analyses/`
- [ ] 更新所有链接

### 验收标准
- ✅ 项目结构清晰，模块化
- ✅ 所有功能正常工作
- ✅ 代码组织符合新架构

---

## 阶段 4: 动态导航和模块开关 - 第6周

### 任务 4.1: 实现动态导航
- [ ] 修改 `app/dashboard/layout.tsx`
- [ ] 根据 `modules.config.ts` 动态生成导航菜单
- [ ] 只显示启用的模块

### 任务 4.2: 添加模块设置页面
- [ ] 创建 `app/dashboard/settings/modules/page.tsx`
- [ ] 显示所有可用模块
- [ ] 允许启用/禁用模块 (保存到 localStorage)

### 任务 4.3: 实现模块守卫
- [ ] 创建 `lib/middleware/module-guard.ts`
- [ ] 如果访问未启用的模块，重定向到 dashboard

### 验收标准
- ✅ 导航菜单动态生成
- ✅ 可以通过设置启用/禁用模块
- ✅ 禁用的模块无法访问

---

## 阶段 5: Firebase 准备 (可选) - 第7-8周

### 任务 5.1: 添加 Firebase SDK
- [ ] 安装 Firebase 依赖: `npm install firebase`
- [ ] 创建 `lib/config/firebase.config.ts`
- [ ] 添加环境变量到 `.env.local`

### 任务 5.2: 实现 Firebase 服务
- [ ] 创建 `lib/services/base/firebase.service.ts`
- [ ] 实现 Firestore 数据操作
- [ ] 实现 Firebase Storage 文件操作
- [ ] 添加错误处理和重试逻辑

### 任务 5.3: 创建数据迁移工具
- [ ] 创建 `scripts/migrate-to-firebase.ts`
- [ ] 读取 localStorage 数据
- [ ] 写入 Firebase
- [ ] 验证数据完整性

### 任务 5.4: 添加服务切换开关
- [ ] 在设置页面添加"数据存储"选项
- [ ] Local / Firebase 切换
- [ ] 提示用户迁移数据

### 验收标准
- ✅ Firebase 服务实现完整
- ✅ 可以切换到 Firebase 存储
- ✅ 数据迁移工具可用
- ✅ 所有功能在 Firebase 模式下正常

---

## 阶段 6: 添加第一个新模块 (美容) - 第9-11周

### 任务 6.1: 设计美容模块数据模型
- [ ] 创建 `modules/cosmetic/types/`
  - CosmeticConsultation
  - CosmeticTreatmentPlan
  - BeforeAfterPhoto
  - TreatmentType (美白、贴面、正畸等)

### 任务 6.2: 创建美容模块服务
- [ ] 创建 `modules/cosmetic/services/`
  - consultation.service.ts
  - treatment.service.ts
  - photo.service.ts

### 任务 6.3: 创建美容模块组件
- [ ] 咨询列表
- [ ] 咨询表单
- [ ] Before/After 照片对比
- [ ] 治疗方案展示

### 任务 6.4: 创建美容模块路由
- [ ] `app/dashboard/cosmetic/consultations/`
- [ ] `app/dashboard/cosmetic/treatments/`
- [ ] `app/dashboard/cosmetic/before-after/`

### 任务 6.5: 更新模块配置
- [ ] 在 `modules.config.ts` 中启用美容模块
- [ ] 添加美容模块导航链接

### 验收标准
- ✅ 美容模块完全独立
- ✅ 不影响牙周病模块
- ✅ 可以记录咨询和治疗
- ✅ Before/After 照片对比功能

---

## 阶段 7: 优化和文档 - 第12周

### 任务 7.1: 性能优化
- [ ] 添加数据缓存
- [ ] 优化图片加载
- [ ] 代码分割 (按模块)

### 任务 7.2: 编写开发文档
- [ ] 创建 `docs/ARCHITECTURE.md`
- [ ] 创建 `docs/ADDING_NEW_MODULE.md`
- [ ] 创建 `docs/FIREBASE_SETUP.md`

### 任务 7.3: 添加测试
- [ ] 服务层单元测试
- [ ] 关键组件测试
- [ ] E2E 测试 (患者管理流程)

### 验收标准
- ✅ 应用性能良好
- ✅ 文档完整清晰
- ✅ 测试覆盖关键功能

---

## 未来计划 (3-6个月)

### 种植牙模块
- [ ] 设计种植案例管理
- [ ] CBCT 扫描集成
- [ ] 手术规划工具
- [ ] 进度追踪

### 拔牙模块
- [ ] 拔牙记录管理
- [ ] 术后护理清单
- [ ] 并发症追踪
- [ ] 复查提醒

### 高级功能
- [ ] 多语言支持 (i18n)
- [ ] 权限管理系统
- [ ] 多诊所支持
- [ ] 移动端应用
- [ ] 数据分析和报告

---

## 风险和缓解措施

### 风险 1: 重构破坏现有功能
**缓解**: 每次改动小且独立，充分测试

### 风险 2: 过度工程化
**缓解**: 遵循 YAGNI 原则，只实现当前需要的

### 风险 3: Firebase 成本
**缓解**: 使用 Firebase 免费层，监控使用量

### 风险 4: 数据迁移失败
**缓解**: 备份数据，提供回滚机制

---

## 成功指标

### 技术指标
- ✅ 代码模块化程度 > 80%
- ✅ 服务抽象层覆盖所有数据操作
- ✅ 可以在 30 分钟内添加新模块框架
- ✅ 可以在 1 小时内切换数据源

### 业务指标
- ✅ 支持至少 3 种牙科服务
- ✅ 现有功能零中断
- ✅ 为商业化做好准备

---

## 注意事项

1. **每个阶段都要验收** - 不要跳过测试
2. **保持简单** - 如果太复杂，简化方案
3. **增量开发** - 小步快跑，持续迭代
4. **文档同步** - 边开发边更新文档
5. **备份数据** - 任何重大改动前备份

---

## 下一步行动

### 今天
1. ✅ 阅读架构设计文档
2. ✅ 确认实施计划
3. ⏳ 开始阶段 1 任务 1.1

### 本周
- 完成服务抽象层 POC
- 验证概念可行性
- 决定是否继续

### 本月
- 完成服务层迁移
- 开始模块化重组

---

## 需要讨论的问题

1. **优先级**: 是否需要立即支持 Firebase，还是先专注于模块化？
2. **第一个新模块**: 应该先做美容、种植还是拔牙？
3. **时间表**: 是否有deadline或特殊要求？
4. **预算**: 是否有开发预算限制？

---

**准备好开始了吗？请确认这个计划，我们就开始实施！** 🚀
