import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DailyStats {
  date: string;
  leads: number;
  analyses: number;
  visitors: number;
}

const AdminAnalyticsCharts = () => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch leads by date
      const { data: leadsData } = await supabase
        .from("leads")
        .select("created_at, is_completed")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Fetch analyses by date
      const { data: analysesData } = await supabase
        .from("analyses")
        .select("created_at, is_paid")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Fetch visitors by date
      const { data: visitorsData } = await supabase
        .from("visitors")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Process daily stats
      const dateMap = new Map<string, DailyStats>();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        dateMap.set(dateStr, { date: dateStr, leads: 0, analyses: 0, visitors: 0 });
      }

      leadsData?.forEach((lead) => {
        const dateStr = lead.created_at.split("T")[0];
        if (dateMap.has(dateStr)) {
          dateMap.get(dateStr)!.leads++;
        }
      });

      analysesData?.forEach((analysis) => {
        const dateStr = analysis.created_at.split("T")[0];
        if (dateMap.has(dateStr)) {
          dateMap.get(dateStr)!.analyses++;
        }
      });

      visitorsData?.forEach((visitor) => {
        const dateStr = visitor.created_at.split("T")[0];
        if (dateMap.has(dateStr)) {
          dateMap.get(dateStr)!.visitors++;
        }
      });

      const stats = Array.from(dateMap.values()).map((s) => ({
        ...s,
        date: new Date(s.date).toLocaleDateString("bn-BD", { month: "short", day: "numeric" })
      }));
      setDailyStats(stats);

      // Conversion funnel data
      const totalVisitors = visitorsData?.length || 0;
      const totalLeads = leadsData?.length || 0;
      const completedLeads = leadsData?.filter((l) => l.is_completed)?.length || 0;
      const totalAnalyses = analysesData?.length || 0;
      const paidAnalyses = analysesData?.filter((a) => a.is_paid)?.length || 0;

      setConversionData([
        { name: "ভিজিটর", value: totalVisitors, fill: "hsl(var(--primary))" },
        { name: "লিড", value: totalLeads, fill: "hsl(38 95% 55%)" },
        { name: "সম্পূর্ণ লিড", value: completedLeads, fill: "hsl(160 60% 40%)" },
        { name: "এনালাইসিস", value: totalAnalyses, fill: "hsl(200 70% 50%)" },
        { name: "পেইড", value: paidAnalyses, fill: "hsl(280 60% 50%)" }
      ]);

      // Source distribution (mock for now based on form steps)
      const formSteps = new Map<string, number>();
      leadsData?.forEach((lead: any) => {
        const step = (lead as any).form_step || "started";
        formSteps.set(step, (formSteps.get(step) || 0) + 1);
      });

      setSourceData([
        { name: "শুরু", value: formSteps.get("started") || 0 },
        { name: "WhatsApp দিয়েছে", value: formSteps.get("whatsapp_entered") || 0 },
        { name: "আইডিয়া দিয়েছে", value: formSteps.get("idea_entered") || 0 },
        { name: "সাবমিট করেছে", value: formSteps.get("submitting") || 0 },
        { name: "পপআপ থেকে", value: formSteps.get("popup_captured") || 0 }
      ]);

    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["hsl(var(--primary))", "hsl(38 95% 55%)", "hsl(160 60% 40%)", "hsl(200 70% 50%)", "hsl(280 60% 50%)"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">গত ৩০ দিনের ট্রেন্ড</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="ভিজিটর"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(38 95% 55%)" 
                  strokeWidth={2}
                  name="লিড"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="analyses" 
                  stroke="hsl(160 60% 40%)" 
                  strokeWidth={2}
                  name="এনালাইসিস"
                  dot={false}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">কনভার্সন ফানেল</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs fill-muted-foreground" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80}
                    className="text-xs fill-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">লিড সোর্স</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData.filter(s => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">কনভার্সন রেট সামারি</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conversionData.length > 1 && (
              <>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {conversionData[0].value > 0 
                      ? ((conversionData[1].value / conversionData[0].value) * 100).toFixed(1)
                      : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground">ভিজিটর → লিড</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">
                    {conversionData[1].value > 0 
                      ? ((conversionData[2].value / conversionData[1].value) * 100).toFixed(1)
                      : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground">লিড → সম্পূর্ণ</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">
                    {conversionData[2].value > 0 
                      ? ((conversionData[3].value / conversionData[2].value) * 100).toFixed(1)
                      : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground">সম্পূর্ণ → এনালাইসিস</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">
                    {conversionData[3].value > 0 
                      ? ((conversionData[4].value / conversionData[3].value) * 100).toFixed(1)
                      : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground">এনালাইসিস → পেইড</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsCharts;
