import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, 
  Trash2, 
  Download, 
  Search, 
  CheckCircle,
  XCircle,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  session_id: string | null;
  whatsapp_number: string | null;
  business_idea: string | null;
  business_type: string | null;
  budget_range: string | null;
  location: string | null;
  form_step: string | null;
  is_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setLeads(leads.filter(l => l.id !== id));
      toast.success("Lead deleted");
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error("Failed to delete lead");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "WhatsApp",
      "Business Idea",
      "Business Type",
      "Budget Range",
      "Location",
      "Form Step",
      "Completed",
      "Created At"
    ];

    const csvData = leads.map(l => [
      l.id,
      l.whatsapp_number || "",
      `"${(l.business_idea || "").replace(/"/g, '""')}"`,
      l.business_type || "",
      l.budget_range || "",
      l.location || "",
      l.form_step || "",
      l.is_completed ? "Yes" : "No",
      new Date(l.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.whatsapp_number || "").includes(searchQuery) ||
      (l.business_idea || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "completed" && l.is_completed) ||
      (filter === "incomplete" && !l.is_completed);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle>সব লিড ({leads.length})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                সব
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                সম্পূর্ণ
              </Button>
              <Button
                variant={filter === "incomplete" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("incomplete")}
              >
                অসম্পূর্ণ
              </Button>
            </div>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              এক্সপোর্ট
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>বিজনেস আইডিয়া</TableHead>
                <TableHead>ফর্ম স্টেপ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    কোনো লিড পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell>
                      {lead.whatsapp_number ? (
                        <a 
                          href={`https://wa.me/88${lead.whatsapp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-500 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {lead.whatsapp_number}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {lead.business_idea || "-"}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary rounded text-xs">
                        {lead.form_step || "শুরু"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lead.is_completed ? (
                        <span className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-4 w-4" /> সম্পূর্ণ
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-500">
                          <XCircle className="h-4 w-4" /> অসম্পূর্ণ
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteLead(lead.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeads;
