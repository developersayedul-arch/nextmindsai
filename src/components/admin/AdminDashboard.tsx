import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Target, 
  Eye, 
  TrendingUp, 
  Crown,
  Phone,
  Calendar
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalAnalyses: number;
  paidAnalyses: number;
  totalLeads: number;
  completedLeads: number;
  totalVisitors: number;
  totalPageViews: number;
  todayVisitors: number;
  todayAnalyses: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Fetch all stats in parallel
      const [
        analysesRes,
        paidAnalysesRes,
        leadsRes,
        completedLeadsRes,
        visitorsRes,
        pageViewsRes,
        todayVisitorsRes,
        todayAnalysesRes
      ] = await Promise.all([
        supabase.from("analyses").select("id", { count: "exact", head: true }),
        supabase.from("analyses").select("id", { count: "exact", head: true }).eq("is_paid", true),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("is_completed", true),
        supabase.from("visitors").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("id", { count: "exact", head: true }),
        supabase.from("visitors").select("id", { count: "exact", head: true }).gte("created_at", todayISO),
        supabase.from("analyses").select("id", { count: "exact", head: true }).gte("created_at", todayISO)
      ]);

      setStats({
        totalAnalyses: analysesRes.count || 0,
        paidAnalyses: paidAnalysesRes.count || 0,
        totalLeads: leadsRes.count || 0,
        completedLeads: completedLeadsRes.count || 0,
        totalVisitors: visitorsRes.count || 0,
        totalPageViews: pageViewsRes.count || 0,
        todayVisitors: todayVisitorsRes.count || 0,
        todayAnalyses: todayAnalysesRes.count || 0
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "মোট এনালাইসিস",
      value: stats.totalAnalyses,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "পেইড এনালাইসিস",
      value: stats.paidAnalyses,
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "মোট লিড",
      value: stats.totalLeads,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "সম্পূর্ণ লিড",
      value: stats.completedLeads,
      icon: Phone,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "মোট ভিজিটর",
      value: stats.totalVisitors,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "পেজ ভিউ",
      value: stats.totalPageViews,
      icon: Eye,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "আজকের ভিজিটর",
      value: stats.todayVisitors,
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      title: "আজকের এনালাইসিস",
      value: stats.todayAnalyses,
      icon: TrendingUp,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    }
  ];

  const conversionRate = stats.totalLeads > 0 
    ? ((stats.completedLeads / stats.totalLeads) * 100).toFixed(1)
    : "0";

  const paidRate = stats.totalAnalyses > 0
    ? ((stats.paidAnalyses / stats.totalAnalyses) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">কনভার্সন মেট্রিক্স</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">লিড থেকে এনালাইসিস রেট</span>
              <span className="text-lg font-bold text-primary">{conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">পেইড এনালাইসিস রেট</span>
              <span className="text-lg font-bold text-warning">{paidRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">গড় পেজ/ভিজিটর</span>
              <span className="text-lg font-bold">
                {stats.totalVisitors > 0 
                  ? (stats.totalPageViews / stats.totalVisitors).toFixed(1) 
                  : "0"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">সারসংক্ষেপ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="text-muted-foreground">মোট রেভিনিউ পোটেনশিয়াল:</span>{" "}
              <span className="font-semibold">৳{stats.paidAnalyses * 99}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">অসম্পূর্ণ লিড:</span>{" "}
              <span className="font-semibold text-orange-500">
                {stats.totalLeads - stats.completedLeads}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">ফ্রি এনালাইসিস:</span>{" "}
              <span className="font-semibold">
                {stats.totalAnalyses - stats.paidAnalyses}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
