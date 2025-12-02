"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AnalysesPage() {
  const { t } = useLanguage();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("analyses.title")}
        </h1>
        <p className="text-gray-600">
          {t("analyses.subtitle")}
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t("analyses.empty.title")}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {t("analyses.empty.description")}
          </p>
          <p className="text-sm text-gray-500">
            {t("analyses.empty.action")}
          </p>
        </CardContent>
      </Card>

      {/* Coming Soon: Analytics Section */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("analyses.cards.total.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">{t("analyses.cards.total.subtitle")}</p>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("analyses.cards.patients.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">{t("analyses.cards.patients.subtitle")}</p>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t("analyses.cards.reports.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">0</div>
            <p className="text-xs text-gray-500 mt-1">{t("analyses.cards.reports.subtitle")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
