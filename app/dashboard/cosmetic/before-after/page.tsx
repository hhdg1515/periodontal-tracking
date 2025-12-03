'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Image as ImageIcon, CheckCircle, Calendar } from 'lucide-react';
import { DEMO_BEFORE_AFTER, DEMO_TREATMENT_PLANS } from '@/lib/demo/cosmetic-mock-data';

export default function BeforeAfterPage() {
  const [selectedComparison, setSelectedComparison] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-green-500" />
            Before / After 效果对比
          </h1>
          <p className="text-muted-foreground mt-1">
            展示治疗前后的对比效果，提升患者信心
          </p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <ImageIcon className="mr-2 h-4 w-4" />
          上传对比照片
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总对比数</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_BEFORE_AFTER.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成治疗</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {DEMO_TREATMENT_PLANS.filter(p => p.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月新增</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">可用于展示</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_BEFORE_AFTER.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gallery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gallery">对比画廊</TabsTrigger>
          <TabsTrigger value="slideshow">幻灯片模式</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          {/* Gallery Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {DEMO_BEFORE_AFTER.map(comparison => (
              <Card
                key={comparison.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedComparison(comparison)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {DEMO_TREATMENT_PLANS.find(p => p.id === comparison.treatment_plan_id)?.patient_name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {comparison.angle === 'front' ? '正面' :
                       comparison.angle === 'side' ? '侧面' :
                       comparison.angle === 'smile' ? '笑容' : '特写'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Before / After Images */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">Before</p>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-red-200">
                        <img
                          src={comparison.before_photo}
                          alt="Before"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {new Date(comparison.before_date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">After</p>
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-green-200">
                        <img
                          src={comparison.after_photo}
                          alt="After"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {new Date(comparison.after_date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {comparison.description && (
                    <p className="text-sm text-muted-foreground">{comparison.description}</p>
                  )}

                  {/* Improvements */}
                  {comparison.visible_improvements && comparison.visible_improvements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">显著改善：</p>
                      <div className="flex flex-wrap gap-2">
                        {comparison.visible_improvements.map((improvement: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment Info */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      治疗项目：
                      {DEMO_TREATMENT_PLANS.find(p => p.id === comparison.treatment_plan_id)?.treatment_name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add more comparisons placeholder */}
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                还没有更多对比照片？完成更多治疗后上传效果对比
              </p>
              <Button variant="outline">
                查看进行中的治疗
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slideshow">
          {/* Interactive Slider View */}
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">幻灯片模式</h3>
              <p className="text-muted-foreground mb-4">
                使用交互式滑块对比治疗前后效果
              </p>
              <Button className="bg-green-500 hover:bg-green-600">
                启动幻灯片演示
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal (if selected) */}
      {selectedComparison && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedComparison(null)}
        >
          <Card className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {DEMO_TREATMENT_PLANS.find(p => p.id === selectedComparison.treatment_plan_id)?.patient_name}
                  - 效果对比详情
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedComparison(null)}
                >
                  关闭
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Large comparison */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-center">治疗前</p>
                  <div className="aspect-video rounded-lg overflow-hidden border-4 border-red-200">
                    <img
                      src={selectedComparison.before_photo}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {new Date(selectedComparison.before_date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium text-center">治疗后</p>
                  <div className="aspect-video rounded-lg overflow-hidden border-4 border-green-200">
                    <img
                      src={selectedComparison.after_photo}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-muted-foreground">
                    {new Date(selectedComparison.after_date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 pt-4 border-t">
                {selectedComparison.description && (
                  <p className="text-base">{selectedComparison.description}</p>
                )}

                {selectedComparison.visible_improvements && (
                  <div>
                    <p className="font-medium mb-3">显著改善：</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedComparison.visible_improvements.map((improvement: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">下载对比图</Button>
                <Button variant="outline">分享给患者</Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  用于营销展示
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
