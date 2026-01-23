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
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { toast } from "sonner";

interface Visitor {
  id: string;
  session_id: string;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  landing_page: string | null;
  created_at: string;
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setVisitors(data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      toast.error("Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  const deleteVisitor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visitor record?")) return;

    try {
      const { error } = await supabase
        .from("visitors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setVisitors(visitors.filter(v => v.id !== id));
      toast.success("Visitor deleted");
    } catch (err) {
      console.error("Error deleting visitor:", err);
      toast.error("Failed to delete visitor");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Session ID",
      "Device",
      "Browser",
      "OS",
      "Referrer",
      "Landing Page",
      "Created At"
    ];

    const csvData = visitors.map(v => [
      v.id,
      v.session_id,
      v.device_type || "",
      v.browser || "",
      v.os || "",
      v.referrer || "",
      v.landing_page || "",
      new Date(v.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredVisitors = visitors.filter(v =>
    (v.browser || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.os || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.landing_page || "").toLowerCase().includes(searchQuery.toLowerCase())
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

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Calculate device stats
  const deviceStats = visitors.reduce((acc, v) => {
    const device = v.device_type || "desktop";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const browserStats = visitors.reduce((acc, v) => {
    const browser = v.browser || "unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xl font-bold">{deviceStats.desktop || 0}</p>
                <p className="text-xs text-muted-foreground">Desktop</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xl font-bold">{deviceStats.mobile || 0}</p>
                <p className="text-xs text-muted-foreground">Mobile</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tablet className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xl font-bold">{deviceStats.tablet || 0}</p>
                <p className="text-xs text-muted-foreground">Tablet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-xl font-bold">{Object.keys(browserStats).length}</p>
              <p className="text-xs text-muted-foreground">Browsers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>Recent Visitors ({visitors.length})</CardTitle>
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
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Landing Page</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No visitors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(visitor.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.device_type)}
                          <span className="capitalize">{visitor.device_type || "desktop"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{visitor.browser || "-"}</TableCell>
                      <TableCell>{visitor.os || "-"}</TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {visitor.landing_page || "/"}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {visitor.referrer ? (
                          <a 
                            href={visitor.referrer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {new URL(visitor.referrer).hostname}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Direct</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteVisitor(visitor.id)}
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
    </div>
  );
};

export default AdminVisitors;
