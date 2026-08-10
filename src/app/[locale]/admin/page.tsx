"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const growth = [
  { month: "Jan", value: 180000 },
  { month: "Feb", value: 195000 },
  { month: "Mar", value: 208000 },
  { month: "Apr", value: 219000 },
  { month: "May", value: 233000 },
  { month: "Jun", value: 248621 },
];

const subjects = [
  { name: "Poetry", value: 320 },
  { name: "History", value: 260 },
  { name: "Criticism", value: 210 },
  { name: "Linguistics", value: 150 },
  { name: "Archives", value: 95 },
];

const kpis = [
  { key: "totalResources", value: "248,621", trend: "+12.8%" },
  { key: "digitalResources", value: "196,340", trend: "+9.4%" },
  { key: "activeUsers", value: "8,214", trend: "+4.1%" },
  { key: "downloads", value: "1.2M", trend: "+21.6%" },
];

export default function AdminPage() {
  const t = useTranslations("Admin");

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Admin Dashboard</h1>
        <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
          {t("previewNote")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.key} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">{t(k.key)}</div>
            <div className="mt-1 font-heading text-2xl font-semibold">{k.value}</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">↑ {k.trend}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-semibold">{t("collectionGrowth")}</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#c9a24b" fill="#c9a24b33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-semibold">{t("popularSubjects")}</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#c9a24b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold">{t("kanbanTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The digitization workflow now runs on real data with a dedicated dashboard.
        </p>
        <Link
          href="/manage/digitization"
          className="mt-4 inline-block rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight"
        >
          Open Digitization Workflow →
        </Link>
      </div>
    </main>
  );
}
