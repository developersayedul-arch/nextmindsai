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
  Shield,
  Plus,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  failure_reason: string | null;
  created_at: string;
}

interface WhitelistEntry {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const AdminSecurity = () => {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attemptsRes, whitelistRes] = await Promise.all([
        supabase
          .from("admin_login_attempts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
        supabase
          .from("admin_whitelist")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (attemptsRes.error) throw attemptsRes.error;
      if (whitelistRes.error) throw whitelistRes.error;

      setAttempts(attemptsRes.data || []);
      setWhitelist(whitelistRes.data || []);
    } catch (err) {
      console.error("Error fetching security data:", err);
      toast.error("Failed to load security data");
    } finally {
      setLoading(false);
    }
  };

  const addToWhitelist = async () => {
    if (!newEmail.trim()) return;

    setIsAddingEmail(true);
    try {
      const { error } = await supabase
        .from("admin_whitelist")
        .insert({ email: newEmail.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast.error("This email is already in the whitelist");
        } else {
          throw error;
        }
      } else {
        toast.success("Email added to whitelist");
        setNewEmail("");
        setDialogOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Error adding to whitelist:", err);
      toast.error("Failed to add email");
    } finally {
      setIsAddingEmail(false);
    }
  };

  const removeFromWhitelist = async (id: string) => {
    if (!confirm("Are you sure you want to remove this email?")) return;

    try {
      const { error } = await supabase
        .from("admin_whitelist")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setWhitelist(whitelist.filter(w => w.id !== id));
      toast.success("Email removed from whitelist");
    } catch (err) {
      console.error("Error removing from whitelist:", err);
      toast.error("Failed to remove email");
    }
  };

  const deleteAttempt = async (id: string) => {
    try {
      const { error } = await supabase
        .from("admin_login_attempts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAttempts(attempts.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting attempt:", err);
      toast.error("Failed to delete");
    }
  };

  const clearOldAttempts = async () => {
    if (!confirm("Delete all login attempts older than 7 days?")) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { error } = await supabase
        .from("admin_login_attempts")
        .delete()
        .lt("created_at", sevenDaysAgo.toISOString());

      if (error) throw error;
      toast.success("Old attempts cleared");
      fetchData();
    } catch (err) {
      console.error("Error clearing attempts:", err);
      toast.error("Failed to clear attempts");
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Email", "Success", "Device", "Browser", "OS", "Failure Reason"];
    const csvData = attempts.map(a => [
      new Date(a.created_at).toLocaleString(),
      a.email,
      a.success ? "Yes" : "No",
      a.device_type || "",
      a.browser || "",
      a.os || "",
      a.failure_reason || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `login-attempts-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAttempts = attempts.filter(a => {
    const matchesSearch = a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === "all" ||
      (filter === "success" && a.success) ||
      (filter === "failed" && !a.success);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Stats
  const totalAttempts = attempts.length;
  const successfulAttempts = attempts.filter(a => a.success).length;
  const failedAttempts = attempts.filter(a => !a.success).length;
  const uniqueEmails = new Set(attempts.map(a => a.email)).size;

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">{successfulAttempts}</p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-500">{failedAttempts}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{uniqueEmails}</p>
            <p className="text-xs text-muted-foreground">Unique Emails</p>
          </CardContent>
        </Card>
      </div>

      {/* Whitelist Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Email Whitelist ({whitelist.length})
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Email to Whitelist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="whitelistEmail">Email Address</Label>
                    <Input
                      id="whitelistEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={addToWhitelist} 
                    className="w-full"
                    disabled={isAddingEmail || !newEmail.trim()}
                  >
                    {isAddingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Add to Whitelist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {whitelist.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No emails in whitelist. All admin emails can login.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {whitelist.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-lg"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{entry.email}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeFromWhitelist(entry.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Attempts */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <CardTitle>Login Attempts</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search email..."
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
                  All
                </Button>
                <Button
                  variant={filter === "success" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("success")}
                >
                  Success
                </Button>
                <Button
                  variant={filter === "failed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("failed")}
                >
                  Failed
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={clearOldAttempts}>
                Clear Old
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4" />
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
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No login attempts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(attempt.created_at)}
                      </TableCell>
                      <TableCell>{attempt.email}</TableCell>
                      <TableCell>
                        {attempt.success ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" /> Success
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-4 w-4" /> Failed
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {attempt.browser || "-"} / {attempt.os || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-muted-foreground">
                        {attempt.failure_reason || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteAttempt(attempt.id)}
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

export default AdminSecurity;
