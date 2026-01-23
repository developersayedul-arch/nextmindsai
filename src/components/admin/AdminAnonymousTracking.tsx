import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users,
  Eye,
  Phone,
  Loader2,
  Trash2,
  Search,
  UserPlus,
  TrendingUp,
  AlertCircle,
  FileText,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface AnonymousAnalysis {
  id: string;
  session_id: string;
  visitor_id: string | null;
  business_type: string | null;
  business_idea: string | null;
  budget_range: string | null;
  location: string | null;
  whatsapp_number: string | null;
  form_step: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
  converted_to_user: boolean;
  converted_user_id: string | null;
}

const AdminAnonymousTracking = () => {
  const [analyses, setAnalyses] = useState<AnonymousAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("anonymous_analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses((data as AnonymousAnalysis[]) || []);
    } catch (err) {
      console.error("Error fetching anonymous analyses:", err);
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!confirm("এই ট্র্যাকিং ডেটা ডিলিট করতে চান?")) return;

    try {
      const { error } = await supabase
        .from("anonymous_analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("ডেটা ডিলিট হয়েছে");
      fetchAnalyses();
    } catch (err) {
      console.error("Error deleting analysis:", err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const getStepBadge = (step: string | null) => {
    const steps: Record<string, { label: string; color: string }> = {
      started: { label: "শুরু", color: "bg-gray-500" },
      business_type: { label: "বিজনেস টাইপ", color: "bg-blue-500" },
      business_idea: { label: "আইডিয়া", color: "bg-purple-500" },
      budget: { label: "বাজেট", color: "bg-orange-500" },
      location: { label: "লোকেশন", color: "bg-cyan-500" },
      whatsapp: { label: "WhatsApp", color: "bg-green-500" },
      completed: { label: "সম্পন্ন", color: "bg-emerald-500" }
    };
    const stepInfo = steps[step || "started"] || steps.started;
    return <Badge className={stepInfo.color}>{stepInfo.label}</Badge>;
  };

  const filteredAnalyses = analyses.filter(a => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      a.business_idea?.toLowerCase().includes(query) ||
      a.whatsapp_number?.toLowerCase().includes(query) ||
      a.location?.toLowerCase().includes(query) ||
      a.business_type?.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: analyses.length,
    withWhatsApp: analyses.filter(a => a.whatsapp_number).length,
    converted: analyses.filter(a => a.converted_to_user).length,
    withIdea: analyses.filter(a => a.business_idea).length,
    todayCount: analyses.filter(a => {
      const today = new Date();
      const created = new Date(a.created_at);
      return created.toDateString() === today.toDateString();
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">মোট ট্র্যাক</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Phone className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withWhatsApp}</p>
                <p className="text-xs text-muted-foreground">WhatsApp পাওয়া</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withIdea}</p>
                <p className="text-xs text-muted-foreground">আইডিয়া পাওয়া</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserPlus className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-xs text-muted-foreground">ইউজার হয়েছে</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
                <p className="text-xs text-muted-foreground">আজকে</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="আইডিয়া, WhatsApp, লোকেশন দিয়ে সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert for hot leads */}
      {stats.withWhatsApp > 0 && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-green-500" />
              <p className="font-medium">
                {stats.withWhatsApp}টি ভিজিটর থেকে WhatsApp নম্বর পাওয়া গেছে - ফলো আপ করুন!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">অ্যানোনিমাস ট্র্যাকিং ({filteredAnalyses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>ফর্ম স্টেপ</TableHead>
                <TableHead>বিজনেস টাইপ</TableHead>
                <TableHead>আইডিয়া</TableHead>
                <TableHead>বাজেট</TableHead>
                <TableHead>লোকেশন</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalyses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    কোনো ট্র্যাকিং ডেটা পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(analysis.created_at), "dd MMM, HH:mm", { locale: bn })}
                    </TableCell>
                    <TableCell>{getStepBadge(analysis.form_step)}</TableCell>
                    <TableCell className="text-sm">{analysis.business_type || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {analysis.business_idea || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{analysis.budget_range || "-"}</TableCell>
                    <TableCell className="text-sm">
                      {analysis.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {analysis.location}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {analysis.whatsapp_number ? (
                        <a
                          href={`https://wa.me/88${analysis.whatsapp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-500 hover:underline text-sm"
                        >
                          <Phone className="h-3 w-3" />
                          {analysis.whatsapp_number}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {analysis.converted_to_user ? (
                        <Badge className="bg-emerald-500">কনভার্টেড</Badge>
                      ) : (
                        <Badge variant="outline">অ্যানোনিমাস</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteAnalysis(analysis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnonymousTracking;