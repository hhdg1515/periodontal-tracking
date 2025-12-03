"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { VisitList } from "@/components/visits/visit-list";
import { AddVisitDialog } from "@/components/visits/add-visit-dialog";
import { usePatient } from "@/lib/hooks/use-patients";
import { useVisits } from "@/lib/hooks/use-visits";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  getDemoConsultationsByPatientId,
  getDemoTreatmentPlansByPatientId,
} from "@/lib/demo/cosmetic-mock-data";
import { getDemoImplantCasesByPatientId } from "@/lib/demo/implant-mock-data";
import { getDemoEndodonticCasesByPatientId } from "@/lib/demo/endodontic-mock-data";
import {
  STATUS_COLORS as COSMETIC_STATUS_COLORS,
  STATUS_LABELS as COSMETIC_STATUS_LABELS,
  TREATMENT_TYPE_LABELS,
} from "@/lib/types/cosmetic";
import {
  STAGE_LABELS,
  STATUS_COLORS as IMPLANT_STATUS_COLORS,
  STATUS_LABELS as IMPLANT_STATUS_LABELS,
  TYPE_LABELS,
} from "@/lib/types/implant";
import {
  STATUS_LABELS as ENDODONTIC_STATUS_LABELS,
  STATUS_COLORS as ENDODONTIC_STATUS_COLORS,
  PULP_STATUS_LABELS,
  PERIAPICAL_LABELS,
} from "@/lib/types/endodontic";

const formatDisplayDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, "PPP");
};

const PATIENT_TABS = ["overview", "periodontal", "cosmetic", "implant", "endodontic"] as const;
type PatientTab = (typeof PATIENT_TABS)[number];

const isPatientTab = (value: string | null): value is PatientTab =>
  !!value && PATIENT_TABS.includes(value as PatientTab);

const resolveTab = (value: string | null): PatientTab =>
  isPatientTab(value) ? (value as PatientTab) : PATIENT_TABS[0];

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const { patient: patientData } = usePatient(patientId);
  const { visits } = useVisits(patientId);
  const totalVisits = visits.length;
  const totalXrays = visits.reduce(
    (total, visit) => total + (visit.xrays?.length || 0),
    0
  );
  const totalReports = visits.reduce(
    (total, visit) => total + (visit.analysis_results?.length || 0),
    0
  );

  const [activeTab, setActiveTab] = useState<PatientTab>(() =>
    resolveTab(searchParams?.get("tab"))
  );
  const contextParam = searchParams?.get("context");

  useEffect(() => {
    const nextTab = resolveTab(searchParams?.get("tab"));
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (value: string) => {
    if (!isPatientTab(value)) return;
    setActiveTab(value);
    const params = new URLSearchParams(searchParams?.toString());
    if (value === PATIENT_TABS[0]) {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const cosmeticConsultations = useMemo(
    () => getDemoConsultationsByPatientId(patientId),
    [patientId]
  );
  const cosmeticTreatments = useMemo(
    () => getDemoTreatmentPlansByPatientId(patientId),
    [patientId]
  );
  const implantCases = useMemo(
    () => getDemoImplantCasesByPatientId(patientId),
    [patientId]
  );
  const activeImplantCases = useMemo(
    () => implantCases.filter((caseItem) => caseItem.status === "in_progress"),
    [implantCases]
  );
  const endodonticCases = useMemo(
    () => getDemoEndodonticCasesByPatientId(patientId),
    [patientId]
  );

  // Use fetched patient data or fallback
  const patient = patientData || {
    id: patientId,
    patient_id: "P-12345",
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1980-05-15",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    is_smoker: false,
    has_diabetes: false,
  };

  const serviceHighlights = useMemo(
    () => [
      {
        id: "periodontal",
        title: t("patientDetail.services.cards.periodontal.title"),
        value: totalVisits,
        helper: t("patientDetail.services.cards.periodontal.subtitle", {
          count: totalXrays,
        }),
        icon: Activity,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
      },
      {
        id: "cosmetic",
        title: t("patientDetail.services.cards.cosmetic.title"),
        value: cosmeticConsultations.length,
        helper: t("patientDetail.services.cards.cosmetic.subtitle", {
          count: cosmeticTreatments.length,
        }),
        icon: Sparkles,
        iconColor: "text-pink-500",
        iconBg: "bg-pink-50",
      },
      {
        id: "implant",
        title: t("patientDetail.services.cards.implant.title"),
        value: implantCases.length,
        helper: t("patientDetail.services.cards.implant.subtitle", {
          count: activeImplantCases.length,
        }),
        icon: ShieldCheck,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50",
      },
    ],
    [
      activeImplantCases.length,
      cosmeticConsultations.length,
      cosmeticTreatments.length,
      implantCases.length,
      t,
      totalVisits,
      totalXrays,
    ]
  );

  const contextInfo = useMemo(() => {
    if (contextParam === "cosmetic") {
      return {
        title: t("patientDetail.contextBanner.cosmetic.title"),
        description: t("patientDetail.contextBanner.cosmetic.description"),
        cta: t("patientDetail.contextBanner.cosmetic.cta"),
        href: "/dashboard/cosmetic",
        badge: t("patientDetail.contextBanner.cosmetic.badge"),
        badgeClass: "bg-pink-100 text-pink-600",
        accent: "bg-pink-50",
      };
    }
    if (contextParam === "implant") {
      return {
        title: t("patientDetail.contextBanner.implant.title"),
        description: t("patientDetail.contextBanner.implant.description"),
        cta: t("patientDetail.contextBanner.implant.cta"),
        href: "/dashboard/implant",
        badge: t("patientDetail.contextBanner.implant.badge"),
        badgeClass: "bg-purple-100 text-purple-600",
        accent: "bg-purple-50",
      };
    }
    if (contextParam === "endodontic") {
      return {
        title: t("patientDetail.contextBanner.endodontic.title"),
        description: t("patientDetail.contextBanner.endodontic.description"),
        cta: t("patientDetail.contextBanner.endodontic.cta"),
        href: "/dashboard/endodontic",
        badge: t("patientDetail.contextBanner.endodontic.badge"),
        badgeClass: "bg-orange-100 text-orange-600",
        accent: "bg-orange-50",
      };
    }
    return null;
  }, [contextParam, t]);

  return (
    <div>
      <Link href="/dashboard/patients">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.actions.backToPatients")}
        </Button>
      </Link>

      {contextInfo && (
        <div
          className={`mb-6 rounded-2xl p-4 ${contextInfo.accent} flex flex-col gap-3 md:flex-row md:items-center md:justify-between`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={contextInfo.badgeClass}>
                {contextInfo.badge}
              </Badge>
              <span className="text-sm font-semibold text-gray-700">{contextInfo.title}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{contextInfo.description}</p>
          </div>
          <Link href={contextInfo.href} className="w-full md:w-auto">
            <Button variant="secondary" className="w-full md:w-auto">
              {contextInfo.cta}
            </Button>
          </Link>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl">
                {patient.first_name} {patient.last_name}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                {t("patientDetail.patientId")}: {patient.patient_id}
              </p>
            </div>
            <Button variant="outline">{t("common.actions.editPatient")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">{t("patientDetail.personalInfo")}</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex">
                  <dt className="w-32 text-gray-600">
                    {t("patientDetail.fields.dateOfBirth")}:
                  </dt>
                  <dd className="font-medium">{patient.date_of_birth}</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-600">
                    {t("patientDetail.fields.email")}:
                  </dt>
                  <dd className="font-medium">
                    {patient.email || t("common.notAvailable")}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-600">
                    {t("patientDetail.fields.phone")}:
                  </dt>
                  <dd className="font-medium">
                    {patient.phone || t("common.notAvailable")}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("patientDetail.riskFactors")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      patient.is_smoker ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>
                    {t("patientDetail.fields.smoker")}:{" "}
                    {patient.is_smoker ? t("common.yes") : t("common.no")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      patient.has_diabetes ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></span>
                  <span>
                    {t("patientDetail.fields.diabetes")}:{" "}
                    {patient.has_diabetes ? t("common.yes") : t("common.no")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t("patientDetail.stats.visits")}</p>
                <p className="text-2xl font-bold">{totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Upload className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t("patientDetail.stats.xrays")}</p>
                <p className="text-2xl font-bold">{totalXrays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t("patientDetail.stats.reports")}</p>
                <p className="text-2xl font-bold">{totalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full flex-wrap gap-2">
          <TabsTrigger value="overview" className="flex-1">
            {t("patientDetail.services.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="periodontal" className="flex-1">
            {t("patientDetail.services.tabs.periodontal")}
          </TabsTrigger>
          <TabsTrigger value="cosmetic" className="flex-1">
            {t("patientDetail.services.tabs.cosmetic")}
          </TabsTrigger>
          <TabsTrigger value="implant" className="flex-1">
            {t("patientDetail.services.tabs.implant")}
          </TabsTrigger>
          <TabsTrigger value="endodontic" className="flex-1">
            {t("patientDetail.services.tabs.endodontic")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t("patientDetail.services.overview.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("patientDetail.services.overview.description")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {serviceHighlights.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={service.id}
                      className="flex items-start gap-4 rounded-2xl border p-4"
                    >
                      <div className={`rounded-full p-3 ${service.iconBg}`}>
                        <Icon className={`h-6 w-6 ${service.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{service.title}</p>
                        <p className="text-3xl font-semibold mt-1">{service.value}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {service.helper}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periodontal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("patientDetail.visitHistory")}</CardTitle>
                <Button onClick={() => setIsAddVisitOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("common.actions.addVisit")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <VisitList patientId={patientId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cosmetic">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("patientDetail.services.cosmetic.consultationsTitle")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("patientDetail.services.cosmetic.consultationsDescription")}
                </p>
              </CardHeader>
              <CardContent>
                {cosmeticConsultations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    {t("patientDetail.services.cosmetic.consultationsEmpty")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cosmeticConsultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="rounded-lg border p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-2">
                          <p className="font-semibold">{consultation.desired_outcome}</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.smile_analysis}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDisplayDate(consultation.consultation_date)} •{" "}
                            {consultation.estimated_duration ||
                              t("common.notAvailable")}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {consultation.recommended_treatments.map((treatment) => (
                              <Badge key={treatment} variant="secondary">
                                {TREATMENT_TYPE_LABELS[treatment]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`w-fit self-start md:self-auto bg-${
                            COSMETIC_STATUS_COLORS[consultation.status]
                          }-100 text-${COSMETIC_STATUS_COLORS[consultation.status]}-700`}
                        >
                          {COSMETIC_STATUS_LABELS[consultation.status]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("patientDetail.services.cosmetic.treatmentsTitle")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("patientDetail.services.cosmetic.treatmentsDescription")}
                </p>
              </CardHeader>
              <CardContent>
                {cosmeticTreatments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    {t("patientDetail.services.cosmetic.treatmentsEmpty")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cosmeticTreatments.map((plan) => (
                      <div key={plan.id} className="rounded-lg border p-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{plan.treatment_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan.description}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`bg-${COSMETIC_STATUS_COLORS[plan.status]}-100 text-${COSMETIC_STATUS_COLORS[plan.status]}-700`}
                          >
                            {COSMETIC_STATUS_LABELS[plan.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-2 rounded-full bg-pink-500 transition-all"
                              style={{ width: `${plan.progress_percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {plan.progress_percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {plan.total_visits} visits •{" "}
                          {formatDisplayDate(plan.expected_completion) ||
                            t("common.notAvailable")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="implant">
          <Card>
            <CardHeader>
              <CardTitle>{t("patientDetail.services.implant.casesTitle")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("patientDetail.services.implant.aiHint")}
              </p>
            </CardHeader>
            <CardContent>
              {implantCases.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">
                  {t("patientDetail.services.implant.casesEmpty")}
                </p>
              ) : (
                <div className="space-y-4">
                  {implantCases.map((caseItem) => (
                    <div key={caseItem.id} className="rounded-lg border p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {TYPE_LABELS[caseItem.case_type]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {STAGE_LABELS[caseItem.current_stage]}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`bg-${IMPLANT_STATUS_COLORS[caseItem.status]}-100 text-${IMPLANT_STATUS_COLORS[caseItem.status]}-700`}
                        >
                          {IMPLANT_STATUS_LABELS[caseItem.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{caseItem.implant_count} implants</span>
                        {caseItem.expected_completion && (
                          <span>
                            {formatDisplayDate(caseItem.expected_completion)}
                          </span>
                        )}
                        {caseItem.surgeon_name && <span>{caseItem.surgeon_name}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-2 rounded-full bg-purple-500 transition-all"
                            style={{ width: `${caseItem.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {caseItem.progress_percentage}%
                        </span>
                      </div>
                      {caseItem.notes && (
                        <p className="text-sm text-muted-foreground">{caseItem.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endodontic">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t("patientDetail.services.endodontic.casesTitle")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("patientDetail.services.endodontic.casesDescription")}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {endodonticCases.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  {t("patientDetail.services.endodontic.casesEmpty")}
                </p>
              ) : (
                <div className="space-y-5">
                  {endodonticCases.map((endoCase) => (
                    <div key={endoCase.id} className="rounded-xl border p-4 space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{endoCase.diagnosis}</p>
                          <p className="text-sm text-muted-foreground">
                            牙位 {endoCase.tooth} · {PULP_STATUS_LABELS[endoCase.pulp_status]}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`bg-${ENDODONTIC_STATUS_COLORS[endoCase.status]}-100 text-${ENDODONTIC_STATUS_COLORS[endoCase.status]}-700`}
                        >
                          {ENDODONTIC_STATUS_LABELS[endoCase.status]}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div>
                          <span className="text-gray-500">根管数：</span>
                          <span className="font-medium text-gray-900">{endoCase.canals}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">根尖状况：</span>
                          <span className="font-medium text-gray-900">
                            {PERIAPICAL_LABELS[endoCase.periapical_status]}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">最近就诊：</span>
                          <span className="font-medium text-gray-900">
                            {endoCase.last_visit
                              ? format(new Date(endoCase.last_visit), "PPP")
                              : t("common.notAvailable")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">下次预约：</span>
                          <span className="font-medium text-gray-900">
                            {endoCase.next_visit
                              ? format(new Date(endoCase.next_visit), "PPp")
                              : t("common.notAvailable")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-2 rounded-full bg-orange-500 transition-all"
                            style={{ width: `${endoCase.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {endoCase.progress_percentage}%
                        </span>
                      </div>

                      {endoCase.ai_flags && endoCase.ai_flags.length > 0 && (
                        <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm text-orange-900 space-y-1">
                          <p className="font-semibold text-xs uppercase tracking-wide text-orange-600">
                            {t("patientDetail.services.endodontic.aiHint")}
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            {endoCase.ai_flags.map((flag, idx) => (
                              <li key={idx}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="space-y-2">
                        {endoCase.visits.slice(0, 3).map((visit) => (
                          <div
                            key={visit.id}
                            className="flex flex-wrap items-center justify-between text-sm rounded-md bg-gray-50 px-3 py-2"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{visit.procedure}</p>
                              <p className="text-xs text-muted-foreground">{visit.notes}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(visit.visit_date), "PP")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddVisitDialog
        patientId={patientId}
        open={isAddVisitOpen}
        onOpenChange={setIsAddVisitOpen}
      />
    </div>
  );
}
