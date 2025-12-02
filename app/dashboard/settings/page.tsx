"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, Palette, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import type { SupportedLanguage } from "@/lib/i18n/translations";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-gray-600">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("settings.account.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">{t("settings.account.clinicName")}</label>
            <p className="text-gray-600 mt-1">Periodontal Tracking Clinic</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">{t("settings.account.email")}</label>
            <p className="text-gray-600 mt-1">clinic@example.com</p>
          </div>
          <Button variant="outline" className="mt-4">
            {t("common.actions.editProfile")}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("settings.notifications.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t("settings.notifications.emailTitle")}</p>
                <p className="text-sm text-gray-600">{t("settings.notifications.emailDescription")}</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{t("settings.notifications.remindersTitle")}</p>
                <p className="text-sm text-gray-600">{t("settings.notifications.remindersDescription")}</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("settings.security.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {t("settings.security.description")}
          </p>
          <Button variant="outline">
            {t("common.actions.changePassword")}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("settings.appearance.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t("settings.appearance.themeLabel")}</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm">
                <option>{t("settings.appearance.light")}</option>
                <option disabled>{t("settings.appearance.dark")}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.languages.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {t("settings.languages.label")}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              value={language}
              onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
            >
              <option value="en">{t("common.languageNames.en")}</option>
              <option value="zh">{t("common.languageNames.zh")}</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {t("settings.languages.helper")}
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 mt-8">
        {t("settings.footer")}
      </p>
    </div>
  );
}
