/**
 * 统一的服务统计数据类型
 * 所有4个服务（牙周病、美容、种植牙、根管）使用相同的统计结构
 */

export interface ServiceStats {
  // 初诊数 (新患者首次就诊)
  consultation_count: number;

  // 复诊数 (回访患者)
  followup_count: number;

  // 已完成
  completed_count: number;

  // 本月初诊新增
  monthly_new_consultations: number;

  // 本月复诊预约数
  monthly_scheduled_followups: number;

  // 本月已完成数
  monthly_completed: number;

  // 服务特定指标（可选，每个服务不同）
  service_specific_metric?: {
    label: string;
    value: number | string;
    description: string;
  };
}

/**
 * 计算总预约数
 */
export function getTotalAppointments(stats: ServiceStats): number {
  return stats.consultation_count + stats.followup_count;
}
