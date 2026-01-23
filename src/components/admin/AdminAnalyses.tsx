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
  Crown,
  Phone,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Analysis {
  id: string;
  user_id: string;
  business_idea: string;
  business_type: string;
  budget_range: string;
  whatsapp_number: string;
  location: string | null;
  is_paid: boolean;
  created_at: string;
  results: any;
}

const AdminAnalyses = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err) {
      console.error("Error fetching analyses:", err);
      toast.error("Failed to load analyses");
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAnalyses(analyses.filter(a => a.id !== id));
      toast.success("Analysis deleted");
    } catch (err) {
      console.error("Error deleting analysis:", err);
      toast.error("Failed to delete analysis");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Business Idea",
      "Business Type",
      "Budget Range",
      "WhatsApp",
      "Location",
      "Is Paid",
      "Created At"
    ];

    const csvData = analyses.map(a => [
      a.id,
      `"${a.business_idea.replace(/"/g, '""')}"`,
      a.business_type,
      a.budget_range,
      a.whatsapp_number,
      a.location || "",
      a.is_paid ? "Yes" : "No",
      new Date(a.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analyses-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAnalyses = analyses.filter(a =>
    a.business_idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.whatsapp_number.includes(searchQuery) ||
    a.business_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <CardTitle>All Analyses ({analyses.length})</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Business Idea</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalyses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No analyses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(analysis.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {analysis.business_idea}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary rounded text-xs">
                        {analysis.business_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`https://wa.me/88${analysis.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-600 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {analysis.whatsapp_number}
                      </a>
                    </TableCell>
                    <TableCell>
                      {analysis.is_paid ? (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Crown className="h-4 w-4" /> Paid
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Free</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteAnalysis(analysis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Idea</p>
                  <p className="font-medium">{selectedAnalysis.business_idea}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Type</p>
                  <p className="font-medium">{selectedAnalysis.business_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Range</p>
                  <p className="font-medium">{selectedAnalysis.budget_range}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{selectedAnalysis.whatsapp_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedAnalysis.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedAnalysis.is_paid ? "Paid" : "Free"}</p>
                </div>
              </div>
              {selectedAnalysis.results && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Analysis Results (JSON)</p>
                  <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(selectedAnalysis.results, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminAnalyses;
