"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Sparkles, Wrench, Syringe, Users, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DEMO_IMPLANT_CASES, DEMO_IMPLANT_STATS } from "@/lib/demo/implant-mock-data";
import { DEMO_CONSULTATIONS, DEMO_TREATMENT_PLANS, DEMO_COSMETIC_STATS } from "@/lib/demo/cosmetic-mock-data";
import { DEMO_ENDODONTIC_STATS } from "@/lib/demo/endodontic-mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">综合管理面板</h1>
        <p className="text-muted-foreground mt-1">所有牙科服务的总览</p>
      </div>

      {/* Service Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Periodontal Tracking */}
        <Link href="/dashboard/periodontal">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Activity className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">进行中</Badge>
              </div>
              <CardTitle className="mt-4">牙周病追踪</CardTitle>
              <CardDescription>智能分析与追踪</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总患者</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">本月分析</span>
                  <span className="font-medium">--</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Cosmetic Dentistry */}
        <Link href="/dashboard/cosmetic">
          <Card className="border-pink-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Sparkles className="h-8 w-8 text-pink-500" />
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  {DEMO_COSMETIC_STATS.active_treatments} 活跃
                </Badge>
              </div>
              <CardTitle className="mt-4">牙齿美容</CardTitle>
              <CardDescription>美容咨询与治疗</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总咨询</span>
                  <span className="font-medium">{DEMO_COSMETIC_STATS.total_consultations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">已完成</span>
                  <span className="font-medium">{DEMO_COSMETIC_STATS.completed_treatments}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dental Implants */}
        <Link href="/dashboard/implant">
          <Card className="border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Wrench className="h-8 w-8 text-purple-500" />
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {DEMO_IMPLANT_STATS.active_cases} 活跃
                </Badge>
              </div>
              <CardTitle className="mt-4">种植牙管理</CardTitle>
              <CardDescription>种植案例追踪</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总案例</span>
                  <span className="font-medium">{DEMO_IMPLANT_STATS.total_cases}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">成功率</span>
                  <span className="font-medium">{DEMO_IMPLANT_STATS.success_rate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Endodontic Treatment */}
        <Link href="/dashboard/endodontic">
          <Card className="border-orange-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Syringe className="h-8 w-8 text-orange-500" />
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {DEMO_ENDODONTIC_STATS.active_cases} 活跃
                </Badge>
              </div>
              <CardTitle className="mt-4">根管治疗</CardTitle>
              <CardDescription>根管病例管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">总案例</span>
                  <span className="font-medium">{DEMO_ENDODONTIC_STATS.total_cases}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">复诊/随访</span>
                  <span className="font-medium">{DEMO_ENDODONTIC_STATS.follow_up_cases}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Cosmetic Consultations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  最近美容咨询
                </CardTitle>
                <CardDescription>最新的美容咨询记录</CardDescription>
              </div>
              <Link href="/dashboard/cosmetic/consultations">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_CONSULTATIONS.slice(0, 3).map(consultation => (
                <div key={consultation.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{consultation.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{consultation.desired_outcome}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(consultation.consultation_date).toLocaleDateString('zh-CN')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Implant Cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-purple-500" />
                  种植牙进行中
                </CardTitle>
                <CardDescription>当前活跃的种植项目</CardDescription>
              </div>
              <Link href="/dashboard/implant/cases">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEMO_IMPLANT_CASES.filter(c => c.status === 'in_progress').slice(0, 3).map(implantCase => (
                <div key={implantCase.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{implantCase.patient_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {implantCase.implant_count} 颗种植体
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      {implantCase.progress_percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            整体统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">美容咨询</p>
              <p className="text-2xl font-bold text-pink-600">{DEMO_COSMETIC_STATS.total_consultations}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">种植案例</p>
              <p className="text-2xl font-bold text-purple-600">{DEMO_IMPLANT_STATS.total_cases}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">总种植体</p>
              <p className="text-2xl font-bold text-indigo-600">{DEMO_IMPLANT_STATS.total_implants}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">种植成功率</p>
              <p className="text-2xl font-bold text-green-600">{DEMO_IMPLANT_STATS.success_rate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
