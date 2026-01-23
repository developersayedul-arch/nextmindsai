import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Phone,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface Payment {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  payment_method: string;
  sender_number: string | null;
  status: string;
  notes: string | null;
  analysis_id: string | null;
  created_at: string;
  verified_at: string | null;
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<"all" | "bkash" | "nagad" | "rocket">("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments((data as Payment[]) || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("পেমেন্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const updateData: Record<string, unknown> = { ...updates };
      
      // If verifying, set verified_at
      if (updates.status === "verified") {
        updateData.verified_at = new Date().toISOString();
        
        // Also activate associated subscription
        const payment = payments.find(p => p.id === id);
        if (payment) {
          await supabase
            .from("subscriptions")
            .update({ is_active: true })
            .eq("payment_id", id);
        }
      }

      const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("পেমেন্ট আপডেট হয়েছে");
      fetchPayments();
      setEditPayment(null);
    } catch (err) {
      console.error("Error updating payment:", err);
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const deletePayment = async (id: string) => {
    if (!confirm("পেমেন্ট ডিলিট করতে চান?")) return;

    try {
      const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("পেমেন্ট ডিলিট হয়েছে");
      fetchPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const quickVerify = async (id: string) => {
    await updatePayment(id, { status: "verified" });
  };

  const quickReject = async (id: string) => {
    await updatePayment(id, { status: "rejected" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">ভেরিফাইড</Badge>;
      case "rejected":
        return <Badge variant="destructive">বাতিল</Badge>;
      default:
        return <Badge variant="secondary" className="bg-orange-500/20 text-orange-500">পেন্ডিং</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      bkash: "bg-pink-500",
      nagad: "bg-orange-500",
      rocket: "bg-purple-500"
    };
    return <Badge className={colors[method] || "bg-gray-500"}>{method}</Badge>;
  };

  const filteredPayments = payments.filter(p => {
    if (filter !== "all" && p.status !== filter) return false;
    if (methodFilter !== "all" && p.payment_method !== methodFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.transaction_id.toLowerCase().includes(query) ||
        p.sender_number?.toLowerCase().includes(query) ||
        p.notes?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === "pending").length,
    verified: payments.filter(p => p.status === "verified").length,
    rejected: payments.filter(p => p.status === "rejected").length,
    totalAmount: payments.filter(p => p.status === "verified").reduce((sum, p) => sum + p.amount, 0),
    bkash: payments.filter(p => p.payment_method === "bkash").length,
    nagad: payments.filter(p => p.payment_method === "nagad").length,
    rocket: payments.filter(p => p.payment_method === "rocket").length
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">মোট পেমেন্ট</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">পেন্ডিং</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">ভেরিফাইড</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">বাতিল</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">৳{stats.totalAmount}</p>
                <p className="text-xs text-muted-foreground">মোট আয়</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                bKash: {stats.bkash}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Nagad: {stats.nagad}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Rocket: {stats.rocket}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Transaction ID বা নম্বর দিয়ে সার্চ করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "verified", "rejected"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "সব" : f === "pending" ? "পেন্ডিং" : f === "verified" ? "ভেরিফাইড" : "বাতিল"}
                </Button>
              ))}
            </div>
            <Select value={methodFilter} onValueChange={(v: typeof methodFilter) => setMethodFilter(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="মেথড" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব মেথড</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Alert */}
      {stats.pending > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <p className="font-medium">
                {stats.pending}টি পেমেন্ট ভেরিফিকেশনের অপেক্ষায় আছে
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">পেমেন্ট লিস্ট ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>মেথড</TableHead>
                <TableHead>সেন্ডার নম্বর</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>নোট</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    কোনো পেমেন্ট পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className={payment.status === "pending" ? "bg-orange-500/5" : ""}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {format(new Date(payment.created_at), "dd MMM yyyy, HH:mm", { locale: bn })}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{payment.transaction_id}</code>
                    </TableCell>
                    <TableCell className="font-medium">৳{payment.amount}</TableCell>
                    <TableCell>{getMethodBadge(payment.payment_method)}</TableCell>
                    <TableCell>
                      {payment.sender_number && (
                        <a
                          href={`https://wa.me/88${payment.sender_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-500 hover:underline text-sm"
                        >
                          <Phone className="h-3 w-3" />
                          {payment.sender_number}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                      {payment.notes}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {payment.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                              onClick={() => quickVerify(payment.id)}
                              title="ভেরিফাই করুন"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => quickReject(payment.id)}
                              title="বাতিল করুন"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditPayment(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deletePayment(payment.id)}
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editPayment} onOpenChange={() => setEditPayment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>পেমেন্ট এডিট করুন</DialogTitle>
          </DialogHeader>
          {editPayment && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction ID</Label>
                  <Input value={editPayment.transaction_id} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input value={`৳${editPayment.amount}`} disabled />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>পেমেন্ট মেথড</Label>
                  <Select 
                    value={editPayment.payment_method}
                    onValueChange={(v) => setEditPayment({ ...editPayment, payment_method: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="rocket">Rocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>স্ট্যাটাস</Label>
                  <Select 
                    value={editPayment.status}
                    onValueChange={(v) => setEditPayment({ ...editPayment, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">পেন্ডিং</SelectItem>
                      <SelectItem value="verified">ভেরিফাইড</SelectItem>
                      <SelectItem value="rejected">বাতিল</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>সেন্ডার নম্বর</Label>
                <Input
                  value={editPayment.sender_number || ""}
                  onChange={(e) => setEditPayment({ ...editPayment, sender_number: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>নোট</Label>
                <Textarea
                  placeholder="পেমেন্ট সম্পর্কে নোট..."
                  value={editPayment.notes || ""}
                  onChange={(e) => setEditPayment({ ...editPayment, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => updatePayment(editPayment.id, {
                    payment_method: editPayment.payment_method,
                    status: editPayment.status,
                    sender_number: editPayment.sender_number,
                    notes: editPayment.notes
                  })}
                  className="flex-1"
                >
                  সেভ করুন
                </Button>
                {editPayment.status === "pending" && (
                  <Button 
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => updatePayment(editPayment.id, { status: "verified" })}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    ভেরিফাই
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;