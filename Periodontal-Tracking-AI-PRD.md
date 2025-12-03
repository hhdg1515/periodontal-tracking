# 牙周病进展追踪AI系统 - 产品需求文档 (PRD)
## Product: PerioTrack AI (暂定名)

**版本**: MVP v1.0  
**日期**: 2025年11月  
**目标**: 3-4个月完成可测试的MVP

---

## 1. 产品概述

### 1.1 产品定位
**一句话描述**: AI驱动的牙周病进展追踪系统，通过对比历史X光片，帮助牙医可视化展示病情变化，提高患者治疗接受率。

### 1.2 核心洞察

#### 问题场景（真实对话）：
```
场景1：患者不相信病情严重
━━━━━━━━━━━━━━━━━━━━━━━━
牙医："你的牙周病恶化了，需要深度清洁。"
患者："可是我感觉还好啊，没什么不舒服。"
牙医："这是X光片，你看这里..."
患者（看着X光片）："我看不懂啊，就是黑黑白白的。"
牙医："相信我，真的需要治疗。"
患者："我考虑一下吧。"
→ 患者走了，可能不会回来
→ 诊所失去$1500的深度清洁收入

场景2：医生也记不清上次情况
━━━━━━━━━━━━━━━━━━━━━━━━
患者："我上次来是6个月前，现在好点了吗？"
牙医（翻病历）："让我看看...嗯...你上次是3mm pocket..."
→ 花5分钟找历史记录
→ 手动对比X光片
→ 说不清楚到底变好还是变坏了
→ 患者困惑："所以我需不需要治疗？"

场景3：患者不理解为什么要持续治疗
━━━━━━━━━━━━━━━━━━━━━━━━
患者："我3个月前刚做过深度清洁，为什么还要来？"
牙医："牙周病需要持续维护..."
患者："上次花了$1500，现在又要花钱？"
→ 患者觉得被坑钱
→ 不愿意继续治疗
→ 一年后牙周病恶化，牙齿松动
```

#### 数据支撑痛点：
```
真实数据：
- 美国47.2%的成年人有牙周病
- 但只有20%的患者接受了适当治疗
- 原因：患者"没感觉"、"看不见"、"不相信"

诊所角度：
- 深度清洁（SRP）：$800-1500/quadrant
- 如果患者拒绝 = 诊所损失$3000-6000
- 治疗接受率每提高10% = 年收入增加$50k-100k

核心问题：
→ 牙周病是"隐形杀手"（早期无症状）
→ X光片患者看不懂
→ 医生说多少遍患者都不信
→ 需要"眼见为实"的证据
```

### 1.3 我们的解决方案

**AI自动对比X光片 + 可视化报告**

**工作流程**：
```
1. 患者复查（6个月后）
   ↓
2. 拍新的X光片
   ↓
3. AI自动对比历史X光片
   ↓
4. 生成可视化报告（3秒）：
   - Side-by-side对比图
   - 骨质流失区域高亮（红色）
   - 每颗牙的变化百分比
   - 趋势预测
   ↓
5. 牙医给患者看报告：
   "你看，这是6个月前，这是现在。
   红色区域是骨质流失的地方。
   如果不治疗，6个月后可能变成这样（预测图）"
   ↓
6. 患者："天哪，真的恶化了！那赶紧治疗吧。"
   ↓
7. 治疗接受率从30%提升到70%+ 🎉
```

### 1.4 核心价值主张

**对诊所**：
- 💰 **增加收入** - 治疗接受率提高40%+ = 年增收$50k-150k
- ⏱️ **节省时间** - 3秒生成报告 vs 5分钟手动对比
- 📈 **患者留存** - 可视化追踪让患者更愿意回来复查
- 🏆 **差异化** - "我们有AI追踪系统"成为营销卖点

**对患者**：
- 👀 **看得见** - 不再是"牙医说有问题就有问题"
- 📊 **有数据** - 具体数字：骨质流失2.3mm
- 🔮 **能预测** - 知道不治疗会怎样
- 💡 **更放心** - 科技背书，更相信诊所专业

### 1.5 目标客户

**一级目标**：
- 全科牙医诊所（有牙周病患者）
- 年患者量500-2000
- 已有数字X光设备
- 重视患者教育和沟通

**二级目标**：
- 牙周专科诊所
- 牙科连锁（DSO）

**非目标客户**：
- ❌ 没有数字X光的诊所（需要先升级设备）
- ❌ 只做美容牙科的诊所（没有牙周病患者）

### 1.6 你的独特优势（别人做不了！）

```
✅ 你有10年真实临床数据
   - 知道哪些pattern预示恶化
   - 知道什么样的变化是显著的
   - 知道不同种族/年龄的差异

✅ 你是牙医
   - 知道医生真正的痛点
   - 知道什么样的报告最有说服力
   - 能判断AI的准确性

✅ 你有测试环境
   - 自己的诊所就是pilot
   - 不需要说服其他诊所
   - 快速迭代

✅ 你知道商业模式
   - 知道诊所的收入结构
   - 知道如何定价
   - 知道如何销售
```

### 1.7 成功指标（MVP阶段）

**技术指标**：
- AI对比准确率 > 90%（vs 人工标注）
- 处理速度 < 5秒/case
- 假阳性率 < 5%（不能说没问题的有问题）

**业务指标**：
- 在你诊所测试50个患者
- 治疗接受率从baseline提高30%+
- 患者满意度 > 4.5/5
- 至少3个其他牙医愿意试用

---

## 2. 竞争分析

### 2.1 现有解决方案

#### 1. 手动对比X光片（最大"竞争对手"）
```
优势：
✅ 免费
✅ 医生控制

劣势：
❌ 耗时（5-10分钟）
❌ 主观（不同医生判断不同）
❌ 患者看不懂
❌ 无法量化
❌ 无法预测

我们的差异化：
→ 3秒自动对比
→ 客观、量化
→ 患者一看就懂
```

#### 2. Overjet / Pearl（牙科AI公司）
```
他们做什么：
- 全面的牙科影像AI
- 检测蛀牙、bone loss等
- 已融资几千万美元

劣势：
❌ 功能太泛（不专注牙周病）
❌ 价格高（$500-800/月）
❌ 不做进展追踪（只做单次检测）
❌ 报告太技术化（患者看不懂）

我们的差异化：
→ 专注牙周病进展追踪
→ 价格友好（$199-299/月）
→ 患者教育为核心
→ 提高治疗接受率（直接增加收入）
```

#### 3. Dentrix / Eaglesoft（牙科管理软件）
```
他们做什么：
- 完整的practice management
- 有X光片查看功能

劣势：
❌ 没有AI对比
❌ 没有可视化报告
❌ 需要手动操作

我们的差异化：
→ 可以集成到他们的软件里
→ 作为add-on功能
```

### 2.2 市场空白

**没有人专门做牙周病进展追踪 + 患者教育**
- Overjet做检测，不做追踪
- 软件公司做管理，不做AI
- 我们：追踪 + AI + 患者教育

**这是真正的蓝海！**

---

## 3. MVP功能范围

### ✅ Must Have（MVP核心）

#### 3.1 X光片上传和管理

**支持的X光类型**：
- Bitewing X-rays（最常用于牙周病检查）
- Periapical X-rays
- Panoramic X-rays（可选）

**上传方式**：
```
方式1：从现有软件导出（最常用）
- Dentrix
- Eaglesoft
- Open Dental
- 导出为JPEG/PNG

方式2：直接上传
- 拖拽文件
- 批量上传

方式3：扫描仪直接连接（Phase 2）
```

**数据组织**：
```
患者 → 多次就诊 → 每次就诊的X光片

例如：
John Doe (DOB: 1980-05-15)
├─ 2023-01-15 (初诊)
│  ├─ Right Bitewing
│  ├─ Left Bitewing
│  └─ Panoramic
├─ 2023-07-20 (6个月复查)
│  ├─ Right Bitewing
│  └─ Left Bitewing
└─ 2024-01-25 (12个月复查)
   ├─ Right Bitewing
   └─ Left Bitewing
```

---

#### 3.2 AI自动对比和分析（核心！）

**技术原理**（简化版）：
```
1. 图像预处理
   - 标准化亮度/对比度
   - 去噪
   - 对齐（不同时间拍的角度可能不同）

2. 牙齿分割
   - 识别每颗牙齿
   - 标记牙冠、牙根、bone level

3. Bone loss检测
   - 测量CEJ（牙骨质珐琅质交界处）到bone crest的距离
   - 对比历史数据
   - 计算变化量

4. 严重程度评估
   - 正常：< 2mm loss
   - 轻度：2-4mm
   - 中度：4-6mm
   - 重度：> 6mm

5. 趋势预测
   - 基于历史变化速度
   - 预测6个月/12个月后的情况
```

**AI输出数据**：
```json
{
  "patient_id": "JD-19800515",
  "comparison": {
    "baseline_date": "2023-01-15",
    "current_date": "2024-01-25",
    "duration_months": 12
  },
  "findings": [
    {
      "tooth_number": 18,
      "baseline_bone_loss": 2.1,  // mm
      "current_bone_loss": 3.4,
      "change": 1.3,  // 恶化
      "change_percentage": 62,
      "severity": "moderate",
      "trend": "worsening"
    },
    {
      "tooth_number": 19,
      "baseline_bone_loss": 1.5,
      "current_bone_loss": 1.4,
      "change": -0.1,  // 好转
      "severity": "mild",
      "trend": "stable"
    }
    // ... 其他牙齿
  ],
  "summary": {
    "total_teeth_analyzed": 28,
    "worsening_count": 8,
    "stable_count": 18,
    "improving_count": 2,
    "average_bone_loss_change": 0.8,  // mm
    "recommendation": "deep_cleaning_recommended"
  },
  "prediction_6_months": {
    "tooth_18_bone_loss": 4.0,  // 如果不治疗
    "risk_level": "high"
  }
}
```

---

#### 3.3 可视化报告生成（最重要！）

**报告类型1：医生版（详细）**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERIODONTAL PROGRESSION REPORT

Patient: John Doe (DOB: 05/15/1980)
Comparison: 01/15/2023 → 01/25/2024 (12 months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Status: WORSENING ⚠️
Average Bone Loss Increase: 0.8mm
Teeth with Progression: 8/28 (29%)

DETAILED FINDINGS BY QUADRANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Upper Right (Quadrant 1):
Tooth #18: 2.1mm → 3.4mm (+1.3mm) 🔴 MODERATE
Tooth #17: 1.8mm → 2.0mm (+0.2mm) 🟡 MILD
Tooth #16: 1.5mm → 1.6mm (+0.1mm) 🟢 STABLE

[Side-by-side X-ray images with annotations]

Upper Left (Quadrant 2):
...

RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priority 1: Deep cleaning (SRP) for teeth #18, #14, #31
Priority 2: Enhanced home care
Follow-up: 3 months

PREDICTION (IF UNTREATED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
In 6 months:
- Tooth #18: Predicted 4.0mm loss (SEVERE)
- Risk of tooth mobility
```

**报告类型2：患者版（简化、可视化）**
```
┌─────────────────────────────────────────┐
│   YOUR GUMS: A 12-MONTH COMPARISON      │
│                                         │
│   [照片：患者笑脸]                       │
│   John Doe                              │
└─────────────────────────────────────────┘

HOW ARE YOUR GUMS DOING?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[大图：笑脸变化]
12 months ago  →  Today  →  In 6 months (if untreated)
   😊              😐            😟

WHAT CHANGED?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[并排对比图，左边是12个月前，右边是现在]
← 12 months ago          Today →

[红色高亮区域]
⚠️ These areas show bone loss

THE NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8 out of 28 teeth are getting worse
Average bone loss: 0.8mm

[进度条可视化]
🟢 Healthy:     ████████░░ 20 teeth
🟡 Mild:        ████░░░░░░ 10 teeth
🔴 Concerning:  ████░░░░░░  8 teeth

WHAT DOES THIS MEAN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your gum disease is progressing. Without treatment:
• Bone around your teeth continues to disappear
• Teeth may become loose
• You may lose teeth

GOOD NEWS! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This can be stopped with treatment!

RECOMMENDED NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Deep cleaning (to remove bacteria)
2. Better home care (we'll teach you)
3. Come back in 3 months (track progress)

[大按钮] I want to save my teeth →

Questions? Let's talk about your options.
```

**关键设计原则**：
- 用颜色（红/黄/绿）不是数字
- 用emoji和简单语言
- 对比图放大（patients can't see small images）
- 预测未来（fear motivates action）
- 正面结尾（"can be stopped"）

---

#### 3.4 报告导出和分享

**格式**：
- PDF（最常用）
- 打印版
- Email直接发给患者
- 患者Portal查看（Phase 2）

**品牌定制**：
```
诊所可以自定义：
- Logo
- 颜色方案
- Contact信息
- 免责声明
```

---

#### 3.5 患者数据库

**信息存储**：
```
患者基本信息：
- 姓名、生日、联系方式
- Patient ID（诊所系统的ID）
- 首诊日期
- 风险因素（吸烟、糖尿病等）

X光历史：
- 每次就诊日期
- X光片文件
- AI分析结果
- 医生备注

治疗历史：
- 是否接受了建议的治疗
- 治疗类型（SRP, maintenance, surgery）
- 治疗后复查结果
```

---

### ⚠️ Should Have（Phase 2功能）

#### 3.6 高级分析
- 不同种族/年龄的进展速度对比
- 吸烟 vs 不吸烟的差异
- 治疗前后效果对比

#### 3.7 患者Self-Service Portal
- 患者登录查看自己的历史
- 下载报告
- 预约follow-up

#### 3.8 诊所分析Dashboard
- 整体患者牙周健康趋势
- 治疗接受率追踪
- Revenue impact分析

#### 3.9 多语言支持
- 中文、西班牙语等

---

### ❌ Won't Have（明确不做）

- ❌ 其他牙科AI（蛀牙检测等）→ 专注牙周病
- ❌ 完整的Practice Management System → 只做追踪
- ❌ 治疗计划软件 → 只做诊断辅助
- ❌ 3D CBCT分析 → MVP只做2D X-ray

---

## 4. 技术架构

### 4.1 技术栈

**前端**：
```
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui
- React-PDF（报告生成）
- Recharts（图表）
```

**后端**：
```
- Next.js API Routes
- Python FastAPI（AI模型服务）
- Supabase（数据库+认证）
```

**AI模型**：
```
选项A：使用现有模型（推荐MVP）
- Segment Anything Model（SAM）- Meta开源
- 用于牙齿分割
- 再用传统CV算法测量bone loss

选项B：训练自己的模型（Phase 2）
- U-Net或ResNet
- 需要1000+标注数据
- 更准确但需要时间

选项C：Claude Vision API（最快原型）
- 上传X光片问："Compare bone levels"
- 快速验证concept
- 不够准确，但可以测试用户反应
```

**图像处理**：
```
- OpenCV（图像预处理）
- scikit-image（分割、测量）
- PIL / Pillow（格式转换）
```

**数据库**：
```
PostgreSQL (Supabase)
- 患者信息
- X光片metadata
- AI分析结果

S3（图像存储）
- 原始X光片
- 处理后的标注图
```

**部署**：
```
- Vercel（前端）
- AWS Lambda / Railway（AI服务）
- Supabase（数据库）
```

### 4.2 数据库Schema

```sql
-- 诊所表
CREATE TABLE clinics (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subscription_tier VARCHAR(50),
  created_at TIMESTAMP
);

-- 患者表
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id),
  patient_id VARCHAR(100), -- 诊所自己的ID
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  email VARCHAR(255),
  phone VARCHAR(50),
  
  -- 风险因素
  is_smoker BOOLEAN,
  has_diabetes BOOLEAN,
  
  created_at TIMESTAMP
);

-- 就诊记录
CREATE TABLE visits (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  visit_date DATE,
  visit_type VARCHAR(50), -- initial, followup, post_treatment
  notes TEXT,
  created_at TIMESTAMP
);

-- X光片
CREATE TABLE xrays (
  id UUID PRIMARY KEY,
  visit_id UUID REFERENCES visits(id),
  xray_type VARCHAR(50), -- bitewing_right, bitewing_left, panoramic
  file_url TEXT, -- S3链接
  upload_date TIMESTAMP,
  
  -- AI分析状态
  analysis_status VARCHAR(50), -- pending, processing, completed, failed
  created_at TIMESTAMP
);

-- AI分析结果
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY,
  xray_id UUID REFERENCES xrays(id),
  
  -- 比较信息
  baseline_xray_id UUID REFERENCES xrays(id),
  comparison_months INTEGER,
  
  -- 整体结果
  total_teeth_analyzed INTEGER,
  worsening_count INTEGER,
  stable_count INTEGER,
  improving_count INTEGER,
  average_change DECIMAL(3,1), -- mm
  
  -- 详细结果（JSON）
  tooth_findings JSONB,
  /*
  [
    {
      "tooth_number": 18,
      "baseline_loss": 2.1,
      "current_loss": 3.4,
      "change": 1.3,
      "severity": "moderate",
      "trend": "worsening"
    },
    ...
  ]
  */
  
  -- 建议
  recommendation TEXT,
  risk_level VARCHAR(20), -- low, medium, high
  
  -- 预测
  prediction_6_months JSONB,
  
  analyzed_at TIMESTAMP,
  created_at TIMESTAMP
);

-- 报告
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_results(id),
  report_type VARCHAR(50), -- doctor, patient
  pdf_url TEXT,
  generated_at TIMESTAMP
);

-- 治疗追踪
CREATE TABLE treatments (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  recommended_date DATE,
  treatment_type VARCHAR(100), -- srp, maintenance, surgery
  status VARCHAR(50), -- recommended, accepted, declined, completed
  completed_date DATE,
  notes TEXT
);
```

### 4.3 AI Pipeline

```python
# 简化版AI流程

from PIL import Image
import cv2
import numpy as np
from segment_anything import sam_model_registry, SamPredictor

class PeriodontalAnalyzer:
    def __init__(self):
        # 加载SAM模型
        self.sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
        self.predictor = SamPredictor(self.sam)
    
    def analyze_progression(self, baseline_xray_path, current_xray_path):
        """
        对比两张X光片，返回bone loss变化
        """
        # 1. 加载图像
        baseline_img = cv2.imread(baseline_xray_path, cv2.IMREAD_GRAYSCALE)
        current_img = cv2.imread(current_xray_path, cv2.IMREAD_GRAYSCALE)
        
        # 2. 预处理（标准化、对齐）
        baseline_processed = self.preprocess(baseline_img)
        current_processed = self.preprocess(current_img)
        aligned_current = self.align_images(baseline_processed, current_processed)
        
        # 3. 分割牙齿
        baseline_teeth = self.segment_teeth(baseline_processed)
        current_teeth = self.segment_teeth(aligned_current)
        
        # 4. 测量bone level
        results = []
        for tooth_num in range(1, 33):  # 32颗牙
            if tooth_num in baseline_teeth and tooth_num in current_teeth:
                baseline_loss = self.measure_bone_loss(baseline_teeth[tooth_num])
                current_loss = self.measure_bone_loss(current_teeth[tooth_num])
                
                change = current_loss - baseline_loss
                severity = self.classify_severity(current_loss)
                
                results.append({
                    'tooth_number': tooth_num,
                    'baseline_loss': baseline_loss,
                    'current_loss': current_loss,
                    'change': change,
                    'severity': severity,
                    'trend': 'worsening' if change > 0.5 else 'stable'
                })
        
        # 5. 生成summary
        summary = self.generate_summary(results)
        
        # 6. 预测未来
        prediction = self.predict_future(results, months=6)
        
        return {
            'findings': results,
            'summary': summary,
            'prediction': prediction
        }
    
    def preprocess(self, img):
        """标准化图像"""
        # 对比度增强
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(img)
        
        # 去噪
        denoised = cv2.fastNlMeansDenoising(enhanced)
        
        return denoised
    
    def align_images(self, baseline, current):
        """对齐两张图像（处理拍摄角度差异）"""
        # 使用ORB特征匹配
        orb = cv2.ORB_create()
        kp1, des1 = orb.detectAndCompute(baseline, None)
        kp2, des2 = orb.detectAndCompute(current, None)
        
        # 匹配
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(des1, des2)
        
        # 计算变换矩阵
        src_pts = np.float32([kp1[m.queryIdx].pt for m in matches])
        dst_pts = np.float32([kp2[m.trainIdx].pt for m in matches])
        M, _ = cv2.findHomography(dst_pts, src_pts, cv2.RANSAC)
        
        # 应用变换
        h, w = baseline.shape
        aligned = cv2.warpPerspective(current, M, (w, h))
        
        return aligned
    
    def segment_teeth(self, img):
        """分割出每颗牙齿"""
        # 使用SAM或传统方法
        # 返回 {tooth_number: tooth_mask}
        pass
    
    def measure_bone_loss(self, tooth_mask):
        """测量bone loss（CEJ到bone crest的距离）"""
        # 1. 找到CEJ位置
        # 2. 找到bone crest位置
        # 3. 计算距离（pixel → mm换算）
        pass
    
    def classify_severity(self, bone_loss_mm):
        """分类严重程度"""
        if bone_loss_mm < 2:
            return 'healthy'
        elif bone_loss_mm < 4:
            return 'mild'
        elif bone_loss_mm < 6:
            return 'moderate'
        else:
            return 'severe'
    
    def predict_future(self, results, months):
        """预测未来bone loss"""
        # 简单线性预测
        predictions = []
        for tooth in results:
            rate = tooth['change'] / 12  # mm per month (假设12个月对比)
            future_loss = tooth['current_loss'] + (rate * months)
            predictions.append({
                'tooth_number': tooth['tooth_number'],
                'predicted_loss': round(future_loss, 1)
            })
        return predictions
```

---

## 5. 商业模式

### 5.1 定价策略

#### 模式A：订阅制（推荐）
```
Starter: $199/月
- 50次分析/月
- 基础报告模板
- Email支持
- 适合：小诊所（1-2牙医）

Professional: $399/月
- 200次分析/月
- 自定义报告模板
- 高级分析
- 电话支持
- 适合：中型诊所（3-5牙医）

Enterprise: $799/月
- 无限分析
- API访问
- 多地点支持
- 专属客户经理
- 适合：DSO、连锁诊所
```

#### 模式B：按次收费
```
$5-10/次分析
- 适合不常用的诊所
- 或作为补充（超出月度额度）
```

#### 模式C：混合模式（可能最好）
```
$299/月基础费 + $3/次超额
- 包含100次分析/月
- 超过部分$3/次
- 诊所用得越多，单价越低
```

### 5.2 ROI计算（给客户看的）

```
假设一个中型诊所：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

当前情况（没有PerioTrack）：
- 每月20个需要SRP的患者
- 治疗接受率：30%
- 接受治疗：6人
- 平均收费：$1500/人
- 月收入：$9,000

使用PerioTrack后：
- 治疗接受率提升到：70%
- 接受治疗：14人
- 月收入：$21,000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
增量收入：$12,000/月 = $144k/年

PerioTrack成本：$399/月 = $4,788/年

ROI = ($144k - $4.8k) / $4.8k = 2900%

投资回报周期：< 1个月
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

结论：每花$1，赚回$30！
```

### 5.3 收入预测（保守）

```
你自己的诊所（Month 1-3）：
- 免费使用（测试）
- 验证效果
- 收集case studies

Month 4-6：前10个客户
- 5个 × $199 = $995/月
- 5个 × $399 = $1,995/月
- 总计：$2,990/月

Month 7-12：扩展到50个客户
- 20个 × $199 = $3,980
- 25个 × $399 = $9,975
- 5个 × $799 = $3,995
- 总计：$17,950/月

Year 1收入：约$120k

Year 2目标：200个客户
- 平均客单价$350/月
- 年收入：$840k
```

---

## 6. Go-to-Market策略

### 6.1 Phase 1：自己诊所测试（Month 1-3）

**目标**：
- 证明concept
- 收集真实数据
- 优化产品

**具体步骤**：
```
Week 1-2：开发基础版本
- 能上传X光片
- 能做简单对比
- 能生成基础报告

Week 3-4：内部测试
- 选10个有历史X光片的牙周病患者
- 生成对比报告
- 给患者看，记录反应

Week 5-8：真实使用
- 所有牙周病复查患者都用
- 追踪治疗接受率变化
- 收集患者反馈

Week 9-12：数据分析
- 治疗接受率是否提升？
- 患者喜欢报告吗？
- 哪些功能最有用？
- 哪些需要改进？
```

**成功标准**：
- ✅ 治疗接受率提升30%+
- ✅ 至少5个患者主动说"这个报告很有用"
- ✅ 节省时间（生成报告<5分钟 vs 手动10分钟）

### 6.2 Phase 2：找5-10个beta客户（Month 4-6）

**理想beta客户**：
- 你认识的牙医朋友
- 小型诊所（容易说服）
- 技术友好
- 重视患者教育

**Pitch**：
```
"我在自己诊所用了3个月这个AI系统，
治疗接受率从35%提升到72%。

我们现在找5个诊所做beta测试：
✅ 前3个月半价（$99/月）
✅ 我们帮你培训员工
✅ 你的反馈帮助改进产品

你愿意试试吗？"
```

**Beta阶段目标**：
- 5-10个付费客户
- 收集case studies
- 优化onboarding流程
- 拿到推荐信

### 6.3 Phase 3：扩展（Month 7+）

#### 销售渠道：

**1. 内容营销**（最有效）
```
博客文章：
- "How to Double Your SRP Acceptance Rate"
- "Why Patients Say No to Periodontal Treatment"
- "The ROI of Patient Education Technology"

Case Study：
- "Dr. Smith increased SRP revenue by $150k/year"
- 包含before/after数据
- 患者证言

YouTube视频：
- 产品demo
- 患者反应实录
- 其他牙医testimonials
```

**2. 牙科会议**
```
- ADA Annual Meeting
- AAP（美国牙周病学会）会议
- 本地dental society meetings
- $2-5k booth费，但能见到很多牙医
```

**3. 合作伙伴**
```
- Dental equipment dealers
- Practice management consultants
- Dental DSOs
- 给20%推荐费
```

**4. 直接销售**
```
- LinkedIn找牙医
- 冷邮件（有case study）
- 电话销售
```

---

## 7. 开发计划（16周）

### Week 1-4: 基础MVP
```
核心功能：
- [ ] 患者管理
- [ ] X光片上传
- [ ] 基础图像对比（手动标注bone level）
- [ ] 简单报告生成

交付：能手动对比2张X光片，生成PDF
```

### Week 5-8: AI集成
```
- [ ] 图像预处理pipeline
- [ ] 简单AI模型（或用Claude Vision）
- [ ] 自动bone level测量
- [ ] 结果验证工具

交付：AI能自动分析，准确率>80%
```

### Week 9-12: 报告优化
```
- [ ] 患者友好报告设计
- [ ] 可视化对比图
- [ ] 品牌定制
- [ ] 导出和分享

交付：漂亮的患者报告，可以直接给患者看
```

### Week 13-16: 抛光和部署
```
- [ ] UI/UX优化
- [ ] 性能优化
- [ ] 安全加固
- [ ] 用户文档
- [ ] 部署到production

交付：可以给beta客户用的系统
```

---

## 8. 风险和挑战

### 8.1 技术风险

**风险1：AI准确率不够**
```
影响：致命（医生不信任）
概率：中

缓解措施：
✅ 先用简单算法（传统CV）
✅ 医生可以手动调整结果
✅ 明确：这是辅助工具，不是诊断工具
✅ 随着数据增加，持续改进
```

**风险2：不同X光设备差异大**
```
影响：高
概率：高

缓解措施：
✅ 支持主流X光格式
✅ 标准化预处理
✅ 允许校准（让医生标注几个样本）
```

**风险3：对齐困难**
```
影响：中
概率：中

缓解措施：
✅ 要求拍X光时尽量角度一致
✅ 提供拍摄指南
✅ 如果对齐失败，提示手动调整
```

### 8.2 产品风险

**风险1：治疗接受率没提升**
```
影响：致命
概率：低（你已经测试过）

缓解措施：
✅ 在自己诊所充分验证
✅ 培训客户如何使用报告说服患者
✅ 持续优化报告设计
```

**风险2：牙医觉得太复杂**
```
影响：高
概率：中

缓解措施：
✅ 极简UI
✅ 视频教程
✅ 现场培训
✅ 快速响应support
```

### 8.3 市场风险

**风险1：Overjet推出类似功能**
```
影响：高
概率：中

应对：
- 他们功能太多，我们专注牙周病
- 他们价格高，我们价格友好
- 我们有真实临床经验
- 快速迭代保持优势
```

**风险2：牙医不愿意改变workflow**
```
影响：中
概率：中

应对：
- 证明ROI（增加收入）
- 提供无缝集成
- 免费试用期
- 成功案例说服
```

### 8.4 法律风险

**风险1：是否需要FDA批准？**
```
当前判断：可能不需要
- 如果是"辅助工具"（医生最终决策）
- 不是"诊断设备"

但需要：
- 免责声明
- 咨询医疗器械律师
- 准备未来可能的FDA申请
```

**风险2：HIPAA合规**
```
影响：必须做到
概率：可控

措施：
✅ 数据加密
✅ Access控制
✅ Audit logging
✅ 签BAA协议
```

---

## 9. 成功指标

### 9.1 MVP阶段（自己诊所，3个月）
- ✅ 使用50次以上
- ✅ 治疗接受率提升30%+
- ✅ 至少3个患者主动分享报告
- ✅ AI准确率>85%（vs 你的人工标注）

### 9.2 Beta阶段（6个月）
- ✅ 5-10个付费beta客户
- ✅ 平均治疗接受率提升40%+
- ✅ NPS > 50
- ✅ Churn rate < 10%
- ✅ 至少3个愿意给testimonial

### 9.3 Year 1（12个月）
- 50个付费客户
- MRR: $15k
- 客户平均ROI > 1000%
- 被至少1个dental publication报道

---

## 10. 为什么这个最适合你

### 你 vs 其他创业者

| 优势 | 你 | 普通创业者 |
|-----|---|-----------|
| **行业知识** | ✅ 10年牙医经验 | ❌ 不懂牙科 |
| **数据** | ✅ 10年X光片数据 | ❌ 没有数据 |
| **测试环境** | ✅ 自己的诊所 | ❌ 需要找诊所 |
| **目标客户** | ✅ 认识很多牙医 | ❌ 不认识牙医 |
| **痛点理解** | ✅ 亲身体会 | ❌ 猜测 |
| **credibility** | ✅ 牙医信任牙医 | ❌ 没人信 |

**结论：这可能是最适合你的项目！**

---

## 11. 下一步行动（今天就能开始！）

### 今天（1小时）
```
1. 找出10个牙周病患者，看他们有没有历史X光片
   → 需要至少6个月前的片子

2. 挑3个最明显恶化的case
   → 这是你的demo案例

3. 用PowerPoint手动做一个"假"报告
   → 模拟AI生成的样子
   → 明天给患者看，记录反应
```

### 本周（5小时）
```
1. 给5个患者看手动报告
   → 问："这样的报告有帮助吗？"
   → 问："如果看到这个，你会更愿意治疗吗？"

2. 如果3个以上说"有帮助"
   → 继续！

3. 如果大家都说"没感觉"
   → 重新思考报告设计
```

### 下周（10小时）
```
1. 找一个freelance developer或用Claude Code
2. 做一个super simple原型：
   - 能上传2张X光片
   - 能并排显示
   - 能手动标记bone level
   - 能生成PDF报告

3. 在诊所真实使用1周
```

### 1个月后
```
如果：
✅ 患者反馈好
✅ 治疗接受率有提升
✅ 原型能用

那么：
→ 投入$10k-15k做proper MVP
→ 找5个beta客户
→ 正式launch
```

---

## 附录

### A. 参考资源
- [AAP Periodontal Disease Classification](https://www.perio.org/)
- [Bone Loss Measurement Standards](https://pubmed.ncbi.nlm.nih.gov/)
- [Patient Education Best Practices](https://www.ada.org/)

### B. 竞争对手完整列表
- Overjet
- Pearl
- Videa Health
- Denti.AI
- Diagnocat

### C. 牙周病术语
- **CEJ**: Cemento-Enamel Junction（牙骨质珐琅质交界处）
- **Bone Crest**: 牙槽骨顶端
- **Pocket Depth**: 牙周袋深度
- **SRP**: Scaling and Root Planing（深度清洁）
- **CAL**: Clinical Attachment Loss

---

**PRD结束**

这个产品有你独特的优势：
✅ 你有数据
✅ 你有测试环境
✅ 你懂行业
✅ 你认识客户

**最重要**：你今天就能开始验证！

不要等"完美时机"，现在就挑3个患者试试手动报告！🚀
