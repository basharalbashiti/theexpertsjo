import { useState, useEffect } from "react";
import { useAdminLang } from "@/hooks/useAdminLang";
import { Eye, Users, FileText, TrendingDown, Activity, Globe, Monitor, Smartphone, Tablet, RefreshCw, Clock, MapPin, LogIn, LogOut, UserPlus, UserCheck, Megaphone } from "lucide-react";

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  avgPagesPerSession: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; views: number; uniqueVisitors: number }[];
  topReferrers: { referrer: string; visits: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  osBreakdown: { os: string; count: number }[];
  dailyViews: { date: string; views: number }[];
  countryBreakdown: { country: string; count: number }[];
  landingPages: { path: string; count: number }[];
  exitPages: { path: string; count: number }[];
  newVsReturning: { new: number; returning: number };
  peakHours: { hour: number; views: number }[];
  screenResolutions: { resolution: string; count: number }[];
  languageBreakdown: { language: string; count: number }[];
  utmCampaigns: { source: string; medium: string; campaign: string; visits: number }[];
}

const periods = [
  { key: "today", labelEn: "Today", labelAr: "اليوم" },
  { key: "7d", labelEn: "7 Days", labelAr: "7 أيام" },
  { key: "30d", labelEn: "30 Days", labelAr: "30 يوم" },
  { key: "90d", labelEn: "90 Days", labelAr: "90 يوم" },
];

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function SimpleLineChart({ data, height = 200 }: { data: { date: string; views: number }[]; height?: number }) {
  if (data.length === 0) return <div className="h-[200px] flex items-center justify-center text-neutral-400">No data</div>;
  const maxViews = Math.max(...data.map(d => d.views), 1);
  const padding = 40;
  const chartWidth = 100;
  const chartHeight = height;
  const innerWidth = chartWidth - padding;
  const innerHeight = chartHeight - padding * 2;
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * innerWidth;
    const y = chartHeight - padding - (d.views / maxViews) * innerHeight;
    return { x, y, ...d };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
  const yLabels = [0, Math.round(maxViews / 2), maxViews];
  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8860b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b8860b" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {yLabels.map((val, i) => {
        const y = chartHeight - padding - (val / maxViews) * innerHeight;
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={chartWidth} y2={y} stroke="#e5e5e5" strokeWidth="0.2" />
            <text x={padding - 2} y={y + 1} textAnchor="end" fontSize="3" fill="#999">{val}</text>
          </g>
        );
      })}
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#b8860b" strokeWidth="0.6" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.8" fill="#b8860b" />
      ))}
      {data.length <= 14 && points.map((p, i) => (
        <text key={`label-${i}`} x={p.x} y={chartHeight - padding + 6} textAnchor="middle" fontSize="2.5" fill="#999">
          {p.date.slice(5)}
        </text>
      ))}
    </svg>
  );
}

function PeakHoursChart({ data, height = 160 }: { data: { hour: number; views: number }[]; height?: number }) {
  const allHours = Array.from({ length: 24 }, (_, i) => {
    const found = data.find(d => d.hour === i);
    return { hour: i, views: found ? found.views : 0 };
  });
  const maxViews = Math.max(...allHours.map(d => d.views), 1);
  const barWidth = 100 / 24;
  const padding = 20;
  const chartHeight = height;
  const innerHeight = chartHeight - padding * 2;

  return (
    <svg viewBox={`0 0 100 ${chartHeight}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      {allHours.map((h, i) => {
        const barH = (h.views / maxViews) * innerHeight;
        const x = i * barWidth + barWidth * 0.15;
        const w = barWidth * 0.7;
        const y = chartHeight - padding - barH;
        const opacity = h.views / maxViews;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={barH} rx="0.5" fill="#b8860b" opacity={0.3 + opacity * 0.7} />
            {i % 3 === 0 && (
              <text x={x + w / 2} y={chartHeight - padding + 6} textAnchor="middle" fontSize="2.5" fill="#999">
                {`${h.hour}:00`}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PercentBar({ items, colors }: { items: { label: string; value: number }[]; colors: string[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-700 font-medium">{item.label}</span>
              <span className="text-neutral-500">{pct}% ({item.value})</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: colors[idx % colors.length] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ newVal, returningVal, isRtl }: { newVal: number; returningVal: number; isRtl: boolean }) {
  const total = newVal + returningVal || 1;
  const newPct = (newVal / total) * 100;
  const circumference = 2 * Math.PI * 40;
  const newStroke = (newPct / 100) * circumference;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="10"
          strokeDasharray={`${newStroke} ${circumference}`} strokeDashoffset={circumference / 4} strokeLinecap="round" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="10"
          strokeDasharray={`${circumference - newStroke} ${newStroke}`} strokeDashoffset={circumference / 4 - newStroke} strokeLinecap="round" />
        <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{total}</text>
        <text x="50" y="60" textAnchor="middle" fontSize="6" fill="#999">{isRtl ? "إجمالي" : "total"}</text>
      </svg>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div>
            <p className="text-sm font-medium text-neutral-700">{isRtl ? "جدد" : "New"}</p>
            <p className="text-lg font-bold text-neutral-900">{newVal} <span className="text-sm font-normal text-neutral-500">({Math.round(newPct)}%)</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <div>
            <p className="text-sm font-medium text-neutral-700">{isRtl ? "عائدون" : "Returning"}</p>
            <p className="text-lg font-bold text-neutral-900">{returningVal} <span className="text-sm font-normal text-neutral-500">({Math.round(100 - newPct)}%)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageList({ pages, pageLabels, isRtl, noDataText }: { pages: { path: string; count: number }[]; pageLabels: Record<string, string>; isRtl: boolean; noDataText: string }) {
  if (pages.length === 0) return <p className="text-neutral-400 text-sm py-4">{noDataText}</p>;
  return (
    <div className="space-y-2">
      {pages.map((p, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
          <span className="text-sm font-medium text-neutral-700 truncate max-w-[65%]">{pageLabels[p.path] || p.path}</span>
          <span className="text-sm text-neutral-500">{p.count}</span>
        </div>
      ))}
    </div>
  );
}

const deviceIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor size={16} />,
  mobile: <Smartphone size={16} />,
  tablet: <Tablet size={16} />,
};

export default function AnalyticsDashboard() {
  const { t, isRtl } = useAdminLang();
  const [period, setPeriod] = useState("7d");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [realtime, setRealtime] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch(`/api/analytics/stats?period=${period}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchRealtime = () => {
    fetch("/api/analytics/realtime", { credentials: "include" })
      .then(r => r.json())
      .then(data => setRealtime(data.visitors))
      .catch(() => {});
  };

  useEffect(() => { fetchStats(); }, [period]);
  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, []);

  const pageLabels: Record<string, string> = {
    "/": isRtl ? "الرئيسية" : "Home",
    "/about": isRtl ? "من نحن" : "About",
    "/products": isRtl ? "المنتجات" : "Products",
    "/contact": isRtl ? "تواصل معنا" : "Contact",
    "/partners": isRtl ? "الشركاء" : "Partners",
    "/catalog": isRtl ? "الكتالوج" : "Catalog",
  };

  const noData = isRtl ? "لا توجد بيانات" : "No data yet";

  return (
    <div className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"} data-testid="analytics-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <Activity size={14} className="animate-pulse" />
            <span>{realtime} {t("analytics_online_now")}</span>
          </div>
          <button onClick={() => { fetchStats(); fetchRealtime(); }} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors" data-testid="button-analytics-refresh">
            <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
          {periods.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} data-testid={`button-analytics-period-${p.key}`}
              className={`px-4 py-2 text-sm font-medium transition-colors ${period === p.key ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-50"}`}>
              {isRtl ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { icon: <Eye size={20} />, label: t("analytics_total_views"), value: stats.totalViews.toLocaleString(), color: "text-blue-600 bg-blue-50" },
              { icon: <Users size={20} />, label: t("analytics_unique_visitors"), value: stats.uniqueVisitors.toLocaleString(), color: "text-green-600 bg-green-50" },
              { icon: <FileText size={20} />, label: t("analytics_avg_pages"), value: stats.avgPagesPerSession.toString(), color: "text-purple-600 bg-purple-50" },
              { icon: <TrendingDown size={20} />, label: t("analytics_bounce_rate"), value: `${stats.bounceRate}%`, color: "text-orange-600 bg-orange-50" },
              { icon: <Clock size={20} />, label: t("analytics_avg_duration"), value: formatDuration(stats.avgSessionDuration), color: "text-cyan-600 bg-cyan-50" },
              { icon: <UserPlus size={20} />, label: t("analytics_new_visitors"), value: stats.newVsReturning.new.toLocaleString(), color: "text-emerald-600 bg-emerald-50" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4" data-testid={`card-analytics-${i}`}>
                <div className={`inline-flex p-2 rounded-lg ${card.color} mb-2`}>{card.icon}</div>
                <p className="text-xl font-bold text-neutral-900">{card.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_daily_views")}</h3>
            <SimpleLineChart data={stats.dailyViews} height={250} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-neutral-400" /> {t("analytics_countries")}</h3>
              {stats.countryBreakdown.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <PercentBar
                  items={stats.countryBreakdown.map(c => ({ label: c.country, value: c.count }))}
                  colors={["#b8860b", "#3b82f6", "#22c55e", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#14b8a6", "#6366f1"]}
                />
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_new_vs_returning")}</h3>
              <DonutChart newVal={stats.newVsReturning.new} returningVal={stats.newVsReturning.returning} isRtl={isRtl} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_top_pages")}</h3>
              {stats.topPages.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <div className="space-y-3">
                  {stats.topPages.map((page, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0" data-testid={`row-analytics-page-${i}`}>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-neutral-400 shrink-0" />
                        <span className="text-sm font-medium text-neutral-700">{pageLabels[page.path] || page.path}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span>{page.views} {isRtl ? "مشاهدة" : "views"}</span>
                        <span className="text-neutral-300">|</span>
                        <span>{page.uniqueVisitors} {isRtl ? "زائر" : "visitors"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_top_referrers")}</h3>
              {stats.topReferrers.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <div className="space-y-3">
                  {stats.topReferrers.map((ref, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0" data-testid={`row-analytics-referrer-${i}`}>
                      <span className="text-sm font-medium text-neutral-700 truncate max-w-[60%]">{ref.referrer}</span>
                      <span className="text-sm text-neutral-500">{ref.visits} {isRtl ? "زيارة" : "visits"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2"><LogIn size={18} className="text-neutral-400" /> {t("analytics_landing_pages")}</h3>
              <PageList pages={stats.landingPages} pageLabels={pageLabels} isRtl={isRtl} noDataText={noData} />
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2"><LogOut size={18} className="text-neutral-400" /> {t("analytics_exit_pages")}</h3>
              <PageList pages={stats.exitPages} pageLabels={pageLabels} isRtl={isRtl} noDataText={noData} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-neutral-400" /> {t("analytics_peak_hours")}</h3>
            <PeakHoursChart data={stats.peakHours} height={180} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_devices")}</h3>
              {stats.deviceBreakdown.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <>
                  <PercentBar items={stats.deviceBreakdown.map(d => ({ label: d.device.charAt(0).toUpperCase() + d.device.slice(1), value: d.count }))} colors={["#3b82f6", "#22c55e", "#f59e0b"]} />
                  <div className="flex gap-6 mt-4 pt-4 border-t border-neutral-100">
                    {stats.deviceBreakdown.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                        {deviceIcons[d.device] || <Monitor size={16} />}
                        <span>{d.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_browsers")}</h3>
              {stats.browserBreakdown.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <PercentBar items={stats.browserBreakdown.map(b => ({ label: b.browser, value: b.count }))} colors={["#b8860b", "#3b82f6", "#ef4444", "#22c55e", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899"]} />
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_os")}</h3>
              {stats.osBreakdown.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <PercentBar items={stats.osBreakdown.map(o => ({ label: o.os, value: o.count }))} colors={["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_screen_resolutions")}</h3>
              {stats.screenResolutions.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <div className="space-y-2">
                  {stats.screenResolutions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">{s.resolution}</span>
                      </div>
                      <span className="text-sm text-neutral-500">{s.count} {isRtl ? "زائر" : "visitors"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_language")}</h3>
              {stats.languageBreakdown.length === 0 ? <p className="text-neutral-400 text-sm py-4">{noData}</p> : (
                <PercentBar items={stats.languageBreakdown.map(l => ({ label: l.language, value: l.count }))} colors={["#b8860b", "#3b82f6", "#22c55e", "#ef4444"]} />
              )}
            </div>
          </div>

          {stats.utmCampaigns.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Megaphone size={18} className="text-neutral-400" /> {t("analytics_utm_campaigns")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className={`py-2 font-medium text-neutral-500 ${isRtl ? "text-right" : "text-left"}`}>{isRtl ? "المصدر" : "Source"}</th>
                      <th className={`py-2 font-medium text-neutral-500 ${isRtl ? "text-right" : "text-left"}`}>{isRtl ? "الوسيلة" : "Medium"}</th>
                      <th className={`py-2 font-medium text-neutral-500 ${isRtl ? "text-right" : "text-left"}`}>{isRtl ? "الحملة" : "Campaign"}</th>
                      <th className={`py-2 font-medium text-neutral-500 ${isRtl ? "text-left" : "text-right"}`}>{isRtl ? "الزيارات" : "Visits"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.utmCampaigns.map((u, i) => (
                      <tr key={i} className="border-b border-neutral-100 last:border-0">
                        <td className="py-2 text-neutral-700">{u.source || "-"}</td>
                        <td className="py-2 text-neutral-600">{u.medium || "-"}</td>
                        <td className="py-2 text-neutral-600">{u.campaign || "-"}</td>
                        <td className={`py-2 font-medium text-neutral-900 ${isRtl ? "text-left" : "text-right"}`}>{u.visits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-neutral-400 text-center py-10">{isRtl ? "فشل تحميل البيانات" : "Failed to load data"}</p>
      )}
    </div>
  );
}
