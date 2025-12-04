# 可扩展牙科平台架构设计方案

## 当前状态分析

### 现有架构
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **状态管理**: Zustand (localStorage)
- **专注领域**: 牙周病追踪 (Periodontal Disease Tracking)
- **项目结构**:
  ```
  periodontal-tracking/
  ├── app/dashboard/
  │   ├── patients/      # 患者管理
  │   ├── compare/       # X光对比
  │   ├── analyses/      # 分析结果
  │   └── settings/      # 设置
  ├── components/
  │   ├── patients/      # 患者相关组件
  │   ├── visits/        # 访问记录组件
  │   ├── xrays/         # X光片组件
  │   ├── comparison/    # 对比组件
  │   └── clinical/      # 临床评估组件
  └── lib/
      ├── hooks/         # React hooks
      ├── types/         # TypeScript 类型
      ├── data/          # 数据和指南
      └── demo/          # Demo 数据
  ```

### 扩展需求
1. **新服务类型**: 牙齿美容、拔牙、种植牙
2. **后端集成**: Firebase (未来)
3. **可维护性**: 简单、清晰、易扩展

---

## 🎯 核心架构原则

### 1. 模块化 - Module-Based Architecture
每个牙科服务都是独立的模块，互不干扰

### 2. 服务抽象 - Service Abstraction
通过服务层隔离业务逻辑，便于切换数据源 (localStorage → Firebase)

### 3. 类型安全 - Type Safety
使用 TypeScript 确保跨模块的类型一致性

### 4. 最小改动 - Minimal Changes
遵循 Claude Rules: 简单、影响最少的代码

---

## 📐 推荐架构设计

### 方案 A: 多服务模块化架构 (推荐)

#### 1. 项目结构重组
```
dental-platform/                    # 重命名项目
├── app/
│   ├── dashboard/
│   │   ├── overview/              # 总览 (所有服务)
│   │   ├── patients/              # 患者管理 (共享)
│   │   │
│   │   ├── periodontal/           # 模块 1: 牙周病
│   │   │   ├── tracking/          # 追踪页面
│   │   │   ├── compare/           # 对比页面
│   │   │   └── analyses/          # 分析页面
│   │   │
│   │   ├── cosmetic/              # 模块 2: 牙齿美容
│   │   │   ├── treatments/        # 治疗类型
│   │   │   ├── before-after/      # 前后对比
│   │   │   └── plans/             # 美容方案
│   │   │
│   │   ├── implant/               # 模块 3: 种植牙
│   │   │   ├── cases/             # 病例管理
│   │   │   ├── planning/          # 手术规划
│   │   │   └── progress/          # 进度追踪
│   │   │
│   │   └── extraction/            # 模块 4: 拔牙
│   │       ├── records/           # 拔牙记录
│   │       └── followup/          # 术后追踪
│   │
│   └── settings/                  # 全局设置
│
├── modules/                        # 服务模块 (核心创新!)
│   ├── shared/                    # 共享模块
│   │   ├── patients/              # 患者管理
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/          # 数据服务层
│   │   │   └── types/
│   │   │
│   │   ├── visits/                # 访问记录
│   │   ├── images/                # 图片管理 (通用)
│   │   └── reports/               # 报告生成 (通用)
│   │
│   ├── periodontal/               # 牙周病模块
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── config.ts              # 模块配置
│   │
│   ├── cosmetic/                  # 美容模块
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── config.ts
│   │
│   ├── implant/                   # 种植模块
│   │   └── ...
│   │
│   └── extraction/                # 拔牙模块
│       └── ...
│
├── lib/
│   ├── services/                  # 数据服务抽象层 (关键!)
│   │   ├── base/                  # 基础服务
│   │   │   ├── storage.service.ts      # 存储服务接口
│   │   │   ├── firebase.service.ts     # Firebase 实现
│   │   │   └── local.service.ts        # LocalStorage 实现
│   │   │
│   │   ├── patient.service.ts     # 患者服务
│   │   ├── visit.service.ts       # 访问服务
│   │   ├── image.service.ts       # 图片服务
│   │   └── index.ts               # 服务工厂
│   │
│   ├── config/
│   │   ├── modules.config.ts      # 模块配置
│   │   └── services.config.ts     # 服务配置
│   │
│   └── types/
│       ├── common.ts              # 通用类型
│       ├── patient.ts             # 患者类型
│       └── module.ts              # 模块类型
│
└── components/ui/                 # UI 组件库 (共享)
```

---

### 2. 服务抽象层设计

#### 服务接口定义
```typescript
// lib/services/base/storage.service.ts

export interface IStorageService {
  // 基础 CRUD
  get<T>(collection: string, id: string): Promise<T | null>;
  list<T>(collection: string, filter?: Filter): Promise<T[]>;
  create<T>(collection: string, data: T): Promise<T>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;
  delete(collection: string, id: string): Promise<void>;

  // 文件操作
  uploadFile(path: string, file: File): Promise<string>;
  getFileUrl(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}
```

#### LocalStorage 实现
```typescript
// lib/services/base/local.service.ts

export class LocalStorageService implements IStorageService {
  async get<T>(collection: string, id: string): Promise<T | null> {
    const items = this.list<T>(collection);
    return items.find((item: any) => item.id === id) || null;
  }

  async list<T>(collection: string): Promise<T[]> {
    const key = `dental_${collection}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // ... 其他方法
}
```

#### Firebase 实现 (未来)
```typescript
// lib/services/base/firebase.service.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class FirebaseService implements IStorageService {
  private db: Firestore;
  private storage: Storage;

  constructor(config: FirebaseConfig) {
    const app = initializeApp(config);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  async get<T>(collection: string, id: string): Promise<T | null> {
    const docRef = doc(this.db, collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as T : null;
  }

  async list<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // ... 其他方法
}
```

#### 服务工厂
```typescript
// lib/services/index.ts

import { LocalStorageService } from './base/local.service';
import { FirebaseService } from './base/firebase.service';

type StorageType = 'local' | 'firebase';

export class ServiceFactory {
  private static instance: IStorageService;

  static getStorageService(type: StorageType = 'local'): IStorageService {
    if (!this.instance) {
      switch (type) {
        case 'firebase':
          this.instance = new FirebaseService(firebaseConfig);
          break;
        case 'local':
        default:
          this.instance = new LocalStorageService();
      }
    }
    return this.instance;
  }
}

// 使用示例
const storage = ServiceFactory.getStorageService('local'); // 或 'firebase'
```

---

### 3. 模块化设计

#### 模块配置
```typescript
// lib/config/modules.config.ts

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  path: string;
  enabled: boolean;
  features: string[];
}

export const MODULES: Record<string, ModuleConfig> = {
  periodontal: {
    id: 'periodontal',
    name: '牙周病追踪',
    icon: 'Activity',
    path: '/dashboard/periodontal',
    enabled: true,
    features: ['tracking', 'comparison', 'ai-analysis', 'reports'],
  },
  cosmetic: {
    id: 'cosmetic',
    name: '牙齿美容',
    icon: 'Sparkles',
    path: '/dashboard/cosmetic',
    enabled: false, // 可以通过设置启用/禁用
    features: ['before-after', 'treatment-plans', 'consultations'],
  },
  implant: {
    id: 'implant',
    name: '种植牙',
    icon: 'Wrench',
    path: '/dashboard/implant',
    enabled: false,
    features: ['planning', 'surgery-tracking', 'followup'],
  },
  extraction: {
    id: 'extraction',
    name: '拔牙',
    icon: 'AlertCircle',
    path: '/dashboard/extraction',
    enabled: false,
    features: ['records', 'post-op-care', 'complications'],
  },
};

export const getEnabledModules = () => {
  return Object.values(MODULES).filter(m => m.enabled);
};
```

#### 模块接口
```typescript
// lib/types/module.ts

export interface DentalModule {
  id: string;
  name: string;

  // 模块特定的数据类型
  entityTypes: string[];

  // 模块特定的组件
  components: {
    dashboard?: React.ComponentType;
    detailView?: React.ComponentType;
    form?: React.ComponentType;
  };

  // 模块特定的路由
  routes: Route[];

  // 模块特定的服务
  services?: Record<string, any>;
}
```

---

### 4. 患者记录设计 (跨模块共享)

#### 统一患者模型
```typescript
// lib/types/patient.ts

export interface Patient {
  id: string;
  clinic_id: string;
  patient_id: string;  // 诊所内部 ID

  // 基础信息
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email?: string;
  phone?: string;

  // 医疗历史
  medical_history?: MedicalHistory;

  // 跨模块服务记录
  services: {
    periodontal?: {
      visits: string[];        // visit IDs
      latest_status?: string;
      risk_level?: string;
    };
    cosmetic?: {
      treatments: string[];    // treatment IDs
      consultations: string[];
    };
    implant?: {
      cases: string[];         // case IDs
      active_cases: number;
    };
    extraction?: {
      records: string[];       // record IDs
      last_extraction?: string;
    };
  };

  created_at: string;
  updated_at: string;
}
```

#### 访问记录设计 (支持多种服务)
```typescript
// lib/types/visit.ts

export type ServiceType = 'periodontal' | 'cosmetic' | 'implant' | 'extraction';

export interface Visit {
  id: string;
  patient_id: string;
  clinic_id: string;

  // 访问基本信息
  visit_date: string;
  service_type: ServiceType;  // 关键: 标识服务类型
  visit_type: string;         // initial, followup, emergency, etc.

  // 服务特定数据 (使用联合类型)
  service_data:
    | PeriodontalVisitData
    | CosmeticVisitData
    | ImplantVisitData
    | ExtractionVisitData;

  // 通用数据
  notes?: string;
  attachments?: string[];

  created_at: string;
  updated_at: string;
}

// 牙周病访问数据
export interface PeriodontalVisitData {
  type: 'periodontal';
  xrays: string[];              // X-ray IDs
  clinical_assessment?: string; // assessment ID
  analysis_results?: string[];  // analysis IDs
}

// 美容访问数据
export interface CosmeticVisitData {
  type: 'cosmetic';
  photos: string[];             // before/after photos
  treatment_plan?: string;      // treatment plan ID
  procedures: string[];         // procedure IDs
}

// 种植访问数据
export interface ImplantVisitData {
  type: 'implant';
  case_id: string;              // implant case ID
  stage: 'consultation' | 'surgery' | 'healing' | 'restoration';
  images: string[];
  cbct_scans?: string[];
}

// 拔牙访问数据
export interface ExtractionVisitData {
  type: 'extraction';
  tooth_number: string;
  reason: string;
  complications?: string[];
  followup_needed: boolean;
}
```

---

### 5. Firebase 集成方案

#### Firestore 数据库结构
```
clinics/
  {clinic_id}/
    settings: {...}
    subscription: {...}

patients/
  {patient_id}/
    profile: {...}
    services/
      periodontal/
        visits/
          {visit_id}/
            xrays/
              {xray_id}: {...}
            assessments/
              {assessment_id}: {...}
      cosmetic/
        consultations/
          {consultation_id}: {...}
        treatments/
          {treatment_id}: {...}
      implant/
        cases/
          {case_id}: {...}

users/
  {user_id}/
    profile: {...}
    permissions: {...}
```

#### Firebase Storage 结构
```
clinics/{clinic_id}/
  patients/{patient_id}/
    periodontal/
      xrays/
        {visit_id}/
          {xray_id}.jpg
    cosmetic/
      photos/
        before/
          {photo_id}.jpg
        after/
          {photo_id}.jpg
    implant/
      scans/
        {case_id}/
          {scan_id}.dcm
```

#### 渐进式迁移策略
```typescript
// lib/config/services.config.ts

export const SERVICE_CONFIG = {
  storage: {
    type: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'local', // 'local' | 'firebase'
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    },
  },
};
```

---

### 6. 迁移路径

#### 阶段 1: 重构现有代码 (1-2周)
- [ ] 创建服务抽象层
- [ ] 将现有 hooks 迁移到使用服务层
- [ ] 重组项目结构 (移动文件到 modules/)
- [ ] 更新导入路径

#### 阶段 2: 添加模块配置 (1周)
- [ ] 实现模块配置系统
- [ ] 创建模块注册表
- [ ] 更新导航菜单 (动态生成)
- [ ] 添加模块开关功能

#### 阶段 3: 实现 Firebase 服务 (1-2周)
- [ ] 实现 FirebaseService
- [ ] 添加 Firebase SDK
- [ ] 创建迁移脚本 (localStorage → Firebase)
- [ ] 测试数据同步

#### 阶段 4: 添加新模块 (每个模块 2-3周)
- [ ] 实现美容模块
- [ ] 实现种植模块
- [ ] 实现拔牙模块

---

### 7. 代码示例

#### 使用服务层的 Hook
```typescript
// modules/shared/patients/hooks/use-patients.ts

import { ServiceFactory } from '@/lib/services';
import { useState, useEffect } from 'react';

export function usePatients(clinicId: string) {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      const storage = ServiceFactory.getStorageService();
      const data = await storage.list('patients', { clinic_id: clinicId });
      setPatients(data);
      setIsLoading(false);
    }

    fetchPatients();
  }, [clinicId]);

  return { patients, isLoading };
}
```

#### 模块特定组件
```typescript
// modules/periodontal/components/periodontal-dashboard.tsx

export function PeriodontalDashboard({ patientId }: Props) {
  const { patient } = usePatient(patientId);
  const { visits } = useVisits(patientId, 'periodontal');

  return (
    <div>
      <h2>牙周病追踪</h2>
      {/* 牙周病特定的 UI */}
    </div>
  );
}
```

```typescript
// modules/cosmetic/components/cosmetic-dashboard.tsx

export function CosmeticDashboard({ patientId }: Props) {
  const { patient } = usePatient(patientId);
  const { consultations } = useConsultations(patientId);

  return (
    <div>
      <h2>牙齿美容</h2>
      {/* 美容特定的 UI */}
    </div>
  );
}
```

#### 动态导航菜单
```typescript
// components/navigation/main-nav.tsx

import { getEnabledModules } from '@/lib/config/modules.config';

export function MainNav() {
  const modules = getEnabledModules();

  return (
    <nav>
      <Link href="/dashboard">总览</Link>
      <Link href="/dashboard/patients">患者</Link>

      {modules.map(module => (
        <Link key={module.id} href={module.path}>
          {module.name}
        </Link>
      ))}

      <Link href="/dashboard/settings">设置</Link>
    </nav>
  );
}
```

---

## 🎨 方案优势

### 1. 可扩展性
- ✅ 新增服务只需添加新模块，不影响现有代码
- ✅ 模块可以独立开发、测试、部署

### 2. 可维护性
- ✅ 每个模块职责清晰，代码隔离
- ✅ 共享逻辑抽取到 shared 模块

### 3. 灵活性
- ✅ 可以通过配置启用/禁用模块
- ✅ 轻松切换数据源 (localStorage ↔ Firebase)

### 4. 渐进式升级
- ✅ 不需要一次性重写所有代码
- ✅ 可以分阶段迁移

### 5. 简单性
- ✅ 遵循 KISS 原则
- ✅ 每个改动都很小，易于理解

---

## 🚀 实施建议

### 立即开始 (本周)
1. 创建服务抽象层 (lib/services/)
2. 实现 LocalStorageService
3. 将一个 hook 迁移到使用服务层 (验证概念)

### 短期 (1-2个月)
1. 完成所有 hooks 的服务层迁移
2. 重组项目结构到模块化
3. 实现模块配置系统

### 中期 (3-6个月)
1. 实现 Firebase 集成
2. 添加第一个新模块 (美容或种植)
3. 完善文档和开发指南

### 长期 (6-12个月)
1. 添加所有计划的模块
2. 优化性能和用户体验
3. 准备商业化

---

## 📊 对比其他方案

### 方案 B: Monolith (单体应用)
- ❌ 所有功能混在一起
- ❌ 难以维护和扩展
- ❌ 新功能会影响现有功能

### 方案 C: Microservices (微服务)
- ❌ 过于复杂 (MVP 阶段不需要)
- ❌ 部署和维护成本高
- ❌ 不符合"简单"原则

### 方案 A: 模块化单体 (推荐) ✅
- ✅ 模块化架构，但仍是单一应用
- ✅ 简单易懂，易于开发
- ✅ 可以根据需要拆分成微服务

---

## 🔑 关键决策

### 1. 数据存储策略
- **现阶段**: LocalStorage (简单，快速开发)
- **未来**: Firebase (云端，多设备同步)
- **迁移**: 通过服务抽象层无缝切换

### 2. 模块隔离策略
- **代码**: 物理隔离 (不同文件夹)
- **数据**: 逻辑隔离 (通过 service_type 字段)
- **UI**: 独立路由和组件

### 3. 共享逻辑策略
- **患者管理**: 完全共享
- **访问记录**: 共享结构，特定数据
- **报告生成**: 共享模板引擎，特定内容

---

## 📝 总结

这个架构设计方案能够：

1. **保持现有代码**基本不变 (牙周病模块)
2. **轻松添加**新的牙科服务模块
3. **无缝切换**从 LocalStorage 到 Firebase
4. **符合 Claude Rules**: 简单、最小改动、清晰

关键创新点:
- **服务抽象层**: 隔离数据访问逻辑
- **模块化设计**: 每个服务独立但共享基础设施
- **渐进式迁移**: 不需要一次性重写

下一步建议:
1. 先验证服务抽象层概念 (小范围试点)
2. 逐步重构现有代码
3. 添加第一个新模块 (验证架构)
4. 集成 Firebase (按需)
