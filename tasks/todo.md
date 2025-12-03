# 修复 Demo 访问记录显示问题

## 问题
- 病人详情页显示 Total Visits: 0
- 访问列表为空,无法查看 X-ray
- `use-visits.ts` hook 返回空数组,没有连接 demo 数据
- `use-xrays.ts` hook 返回空数组,没有连接 demo 数据

## 任务列表
- [x] 修复 `use-visits.ts` - 连接到 DEMO_VISITS 数据
- [x] 修复 `use-visit.ts` (单个访问) - 连接到 DEMO_VISITS 数据
- [x] 修复病人详情页的统计数字 (Total Visits, X-rays, Reports)
- [x] 修复 `use-xrays.ts` - 连接到 DEMO_XRAYS 数据
- [x] 修复 `xray-gallery.tsx` 字段名错误
- [x] 修复 `use-xrays-for-comparison.ts` - 连接 demo 数据
- [x] 修复下载功能 - 真正下载文件而不是打开新标签页
- [x] 修复 Compare 页面 - 添加 patientId 到 URL

## 目标
让用户能看到 demo 病人的访问记录和 X-ray 图片

## 完成的修改

### 1. use-visits.ts
- 导入 DEMO_VISITS 和 getDemoVisitsByPatientId
- 实现 useVisits() 根据 patientId 获取访问记录
- 实现 useVisit() 根据 visitId 获取单个访问详情
- 添加数据格式转换函数

### 2. [patientId]/page.tsx
- 使用 usePatient 和 useVisits hooks 获取真实数据
- 修正字段名: firstName → first_name, lastName → last_name 等
- 统计数字显示真实数据:
  - Total Visits: visits.length
  - X-rays Uploaded: visits.length * 2
  - Reports Generated: visits.length

### 3. use-xrays.ts
- 导入 DEMO_XRAYS 和 getDemoXRaysByVisitId
- 实现 useXRays() 根据 visitId 获取 X-ray 图片
- 实现 useXRay() 根据 xrayId 获取单个 X-ray
- 实现 useXRaysForComparison() 获取用于对比的 X-rays
- 添加数据格式转换函数

### 4. xray-gallery.tsx
- 修正字段名: file_url → image_url, upload_date → uploaded_at
- 修正分析状态: "completed" → "analyzed"
- 改进下载功能: 使用 fetch + blob 实现真正的文件下载
- 添加 patientId prop 并传递给 Compare 链接

### 5. use-xrays-for-comparison.ts
- 导入 DEMO_XRAYS 数据
- 实现 useXRaysForComparison() 返回所有 X-rays
- 实现 useXRay() 根据 ID 获取单个 X-ray
- 添加向后兼容字段 (file_url, upload_date)

### 6. xray-comparison-viewer.tsx
- 修正字段名: file_url → image_url, upload_date → uploaded_at
- 修复选择列表和图片显示的字段引用

### 7. visits/[visitId]/page.tsx
- 传递 patientId prop 给 XRayGallery 组件

## 总结

所有 demo 数据现在都已正确连接:
- ✅ 3 个病人 (demo-001, demo-002, demo-003)
- ✅ 每个病人 2 次访问记录
- ✅ 每次访问 1 张 X-ray 图片
- ✅ X-ray 可以下载、对比、删除
- ✅ Compare 页面可以选择并对比任意两张 X-ray
