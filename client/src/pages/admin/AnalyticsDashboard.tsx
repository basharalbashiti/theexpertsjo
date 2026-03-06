import { useState, useEffect } from "react";
import { useAdminLang } from "@/hooks/useAdminLang";
import { Eye, Users, FileText, TrendingDown, Activity, Globe, Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react";

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  avgPagesPerSession: number;
  bounceRate: number;
  topPages: { path: string; views: number; uniqueVisitors: number }[];
  topReferrers: { referrer: string; visits: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  dailyViews: { date: string; views: number }[];
}

const periods = [
  { key: "today", labelEn: "Today", labelAr: "اليوم" },
  { key: "7d", labelEn: "7 Days", labelAr: "7 أيام" },
  { key: "30d", labelEn: "30 Days", labelAr: "30 يوم" },
  { key: "90d", labelEn: "90 Days", labelAr: "90 يوم" },
];

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
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: colors[idx % colors.length] }}
              />
            </div>
          </div>
        );
      })}
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

  return (
    <div className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"} data-testid="analytics-dashboard">
      <div className={`flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <Activity size={14} className="animate-pulse" />
            <span>{realtime} {t("analytics_online_now")}</span>
          </div>
          <button
            onClick={() => { fetchStats(); fetchRealtime(); }}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            data-testid="button-analytics-refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              data-testid={`button-analytics-period-${p.key}`}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === p.key
                  ? "bg-primary text-white"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Eye size={20} />, label: t("analytics_total_views"), value: stats.totalViews.toLocaleString(), color: "text-blue-600 bg-blue-50" },
              { icon: <Users size={20} />, label: t("analytics_unique_visitors"), value: stats.uniqueVisitors.toLocaleString(), color: "text-green-600 bg-green-50" },
              { icon: <FileText size={20} />, label: t("analytics_avg_pages"), value: stats.avgPagesPerSession.toString(), color: "text-purple-600 bg-purple-50" },
              { icon: <TrendingDown size={20} />, label: t("analytics_bounce_rate"), value: `${stats.bounceRate}%`, color: "text-orange-600 bg-orange-50" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 p-5" data-testid={`card-analytics-${i}`}>
                <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_daily_views")}</h3>
            <SimpleLineChart data={stats.dailyViews} height={250} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_top_pages")}</h3>
              {stats.topPages.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">{isRtl ? "لا توجد بيانات" : "No data yet"}</p>
              ) : (
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
              {stats.topReferrers.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">{isRtl ? "لا توجد بيانات" : "No data yet"}</p>
              ) : (
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
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_devices")}</h3>
              {stats.deviceBreakdown.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">{isRtl ? "لا توجد بيانات" : "No data yet"}</p>
              ) : (
                <PercentBar
                  items={stats.deviceBreakdown.map(d => ({
                    label: `${d.device.charAt(0).toUpperCase() + d.device.slice(1)}`,
                    value: d.count,
                  }))}
                  colors={["#3b82f6", "#22c55e", "#f59e0b"]}
                />
              )}
              <div className="flex gap-6 mt-4 pt-4 border-t border-neutral-100">
                {stats.deviceBreakdown.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                    {deviceIcons[d.device] || <Monitor size={16} />}
                    <span>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t("analytics_browsers")}</h3>
              {stats.browserBreakdown.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">{isRtl ? "لا توجد بيانات" : "No data yet"}</p>
              ) : (
                <PercentBar
                  items={stats.browserBreakdown.map(b => ({
                    label: b.browser,
                    value: b.count,
                  }))}
                  colors={["#b8860b", "#3b82f6", "#ef4444", "#22c55e", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899"]}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-neutral-400 text-center py-10">{isRtl ? "فشل تحميل البيانات" : "Failed to load data"}</p>
      )}
    </div>
  );
}
