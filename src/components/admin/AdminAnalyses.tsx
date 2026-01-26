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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Analysis Plan</DialogTitle>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Business Idea</p>
                  <p className="font-medium text-sm">{selectedAnalysis.business_idea}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium text-sm">{selectedAnalysis.business_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="font-medium text-sm">{selectedAnalysis.budget_range}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <a 
                    href={`https://wa.me/88${selectedAnalysis.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm text-green-600 hover:underline"
                  >
                    {selectedAnalysis.whatsapp_number}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{selectedAnalysis.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium text-sm">{selectedAnalysis.is_paid ? "✅ Paid" : "Free"}</p>
                </div>
              </div>

              {/* Full Analysis Results */}
              {selectedAnalysis.results && (
                <div className="space-y-4">
                  {/* Business Reality */}
                  {selectedAnalysis.results.businessReality && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">১. Business Reality Check</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Type:</span> {selectedAnalysis.results.businessReality.type}</p>
                        <p><span className="text-muted-foreground">Beginner Friendly:</span> {selectedAnalysis.results.businessReality.beginnerFriendly}</p>
                        <p><span className="text-muted-foreground">Biggest Risk:</span> {selectedAnalysis.results.businessReality.biggestRisk}</p>
                      </div>
                    </div>
                  )}

                  {/* Product Decision */}
                  {selectedAnalysis.results.productDecision && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">২. Product / Service Decision</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Primary:</span> {selectedAnalysis.results.productDecision.primary}</p>
                        <p><span className="text-muted-foreground">Backup:</span> {selectedAnalysis.results.productDecision.backup}</p>
                        <p><span className="text-muted-foreground">Reasoning:</span> {selectedAnalysis.results.productDecision.reasoning}</p>
                      </div>
                    </div>
                  )}

                  {/* Source Guide */}
                  {selectedAnalysis.results.sourceGuide && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">৩. Product Source Guide</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Where:</span> {selectedAnalysis.results.sourceGuide.where}</p>
                        <p><span className="text-muted-foreground">Cost Breakdown:</span> {selectedAnalysis.results.sourceGuide.costBreakdown}</p>
                        <p><span className="text-muted-foreground">Common Mistake:</span> {selectedAnalysis.results.sourceGuide.commonMistake}</p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Plan */}
                  {selectedAnalysis.results.deliveryPlan && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">৪. Delivery & Payment Plan</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Method:</span> {selectedAnalysis.results.deliveryPlan.method}</p>
                        <p><span className="text-muted-foreground">Payment:</span> {selectedAnalysis.results.deliveryPlan.payment}</p>
                        <p><span className="text-muted-foreground">Risk Warning:</span> {selectedAnalysis.results.deliveryPlan.riskWarning}</p>
                      </div>
                    </div>
                  )}

                  {/* Website Decision */}
                  {selectedAnalysis.results.websiteDecision && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">৫. Website Decision</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Verdict:</span> <span className="font-semibold">{selectedAnalysis.results.websiteDecision.verdict}</span></p>
                        <p><span className="text-muted-foreground">Explanation:</span> {selectedAnalysis.results.websiteDecision.explanation}</p>
                        {selectedAnalysis.results.websiteDecision.websiteType && (
                          <p><span className="text-muted-foreground">Website Type:</span> {selectedAnalysis.results.websiteDecision.websiteType}</p>
                        )}
                        <p><span className="text-muted-foreground">Not To Build:</span> {selectedAnalysis.results.websiteDecision.notToBuild}</p>
                      </div>
                    </div>
                  )}

                  {/* Marketing Plan */}
                  {selectedAnalysis.results.marketingPlan && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">৬. Marketing Strategy</h3>
                      <div className="space-y-2 text-sm">
                        {selectedAnalysis.results.marketingPlan.first10Customers && (
                          <div>
                            <span className="text-muted-foreground">First 10 Customers:</span>
                            <ul className="list-disc list-inside ml-2 mt-1">
                              {selectedAnalysis.results.marketingPlan.first10Customers.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p><span className="text-muted-foreground">Where to Market:</span> {selectedAnalysis.results.marketingPlan.whereToMarket}</p>
                        <p><span className="text-muted-foreground">What to Say:</span> {selectedAnalysis.results.marketingPlan.whatToSay}</p>
                        <p><span className="text-muted-foreground">What Not to Do:</span> {selectedAnalysis.results.marketingPlan.whatNotToDo}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Plan */}
                  {selectedAnalysis.results.actionPlan && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-primary mb-3">৭. 14-Day Action Plan</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Day 1-3:</span> {selectedAnalysis.results.actionPlan.day1to3}</p>
                        <p><span className="text-muted-foreground">Day 4-7:</span> {selectedAnalysis.results.actionPlan.day4to7}</p>
                        <p><span className="text-muted-foreground">Day 8-14:</span> {selectedAnalysis.results.actionPlan.day8to14}</p>
                      </div>
                    </div>
                  )}

                  {/* Failure Warning */}
                  {selectedAnalysis.results.failureWarning && (
                    <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-4">
                      <h3 className="font-semibold text-destructive mb-3">৮. Failure Warning</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Where Fail Occurs:</span> {selectedAnalysis.results.failureWarning.whereFailOccurs}</p>
                        <p><span className="text-muted-foreground">Money Loss Mistake:</span> {selectedAnalysis.results.failureWarning.moneyLossMistake}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback Raw JSON */}
              {!selectedAnalysis.results && (
                <div className="text-center py-8 text-muted-foreground">
                  No analysis results available
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
