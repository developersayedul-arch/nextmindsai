import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Users,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  Video,
  MessageCircle,
  ExternalLink,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface MentorshipSession {
  id: string;
  user_id: string | null;
  mentor_name: string;
  session_type: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  whatsapp_number: string;
  business_idea: string | null;
  topics: string[] | null;
  notes: string | null;
  meeting_link: string | null;
  price: number;
  payment_status: string;
  created_at: string;
}

const sessionTypes = [
  { value: "business-idea", label: "বিজনেস আইডিয়া ভ্যালিডেশন", price: 499 },
  { value: "marketing", label: "মার্কেটিং স্ট্র্যাটেজি", price: 699 },
  { value: "scaling", label: "বিজনেস স্কেলিং", price: 999 },
  { value: "full-consultation", label: "সম্পূর্ণ বিজনেস প্ল্যান", price: 1499 },
  { value: "tech-guidance", label: "টেক ও ওয়েবসাইট গাইডেন্স", price: 599 }
];

const AdminMentorship = () => {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSession, setEditSession] = useState<MentorshipSession | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed">("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("mentorship_sessions")
        .select("*")
        .order("session_date", { ascending: true });

      if (error) throw error;
      setSessions((data as MentorshipSession[]) || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      toast.error("সেশন লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (id: string, updates: Partial<MentorshipSession>) => {
    try {
      const { error } = await supabase
        .from("mentorship_sessions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success("সেশন আপডেট হয়েছে");
      fetchSessions();
      setEditSession(null);
    } catch (err) {
      console.error("Error updating session:", err);
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm("সেশন ডিলিট করতে চান?")) return;

    try {
      const { error } = await supabase
        .from("mentorship_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("সেশন ডিলিট হয়েছে");
      fetchSessions();
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">নিশ্চিত</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">সম্পন্ন</Badge>;
      case "cancelled":
        return <Badge variant="destructive">বাতিল</Badge>;
      default:
        return <Badge variant="secondary">পেন্ডিং</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">পেইড</Badge>;
      case "verified":
        return <Badge className="bg-blue-500">ভেরিফাইড</Badge>;
      default:
        return <Badge variant="outline">আনপেইড</Badge>;
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const stats = {
    total: sessions.length,
    pending: sessions.filter(s => s.status === "pending").length,
    confirmed: sessions.filter(s => s.status === "confirmed").length,
    completed: sessions.filter(s => s.status === "completed").length,
    revenue: sessions.filter(s => s.payment_status === "paid").reduce((sum, s) => sum + s.price, 0)
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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">মোট সেশন</p>
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
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-xs text-muted-foreground">নিশ্চিত</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Video className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">সম্পন্ন</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <span className="text-purple-500 font-bold">৳</span>
              </div>
              <div>
                <p className="text-2xl font-bold">৳{stats.revenue}</p>
                <p className="text-xs text-muted-foreground">রেভিনিউ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "confirmed", "completed"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "সব" : f === "pending" ? "পেন্ডিং" : f === "confirmed" ? "নিশ্চিত" : "সম্পন্ন"}
          </Button>
        ))}
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">মেন্টরশিপ সেশন ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ ও সময়</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>সেশন টাইপ</TableHead>
                <TableHead>দাম</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>পেমেন্ট</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    কোনো সেশন পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(session.session_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={`https://wa.me/88${session.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-green-500 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {session.whatsapp_number}
                      </a>
                    </TableCell>
                    <TableCell>
                      {sessionTypes.find(t => t.value === session.session_type)?.label || session.session_type}
                    </TableCell>
                    <TableCell>৳{session.price}</TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>{getPaymentBadge(session.payment_status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {session.meeting_link && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(session.meeting_link!, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteSession(session.id)}
                        >
                          <XCircle className="h-4 w-4" />
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
      <Dialog open={!!editSession} onOpenChange={() => setEditSession(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>সেশন এডিট করুন</DialogTitle>
          </DialogHeader>
          {editSession && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>স্ট্যাটাস</Label>
                <Select 
                  value={editSession.status}
                  onValueChange={(v) => setEditSession({ ...editSession, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">পেন্ডিং</SelectItem>
                    <SelectItem value="confirmed">নিশ্চিত</SelectItem>
                    <SelectItem value="completed">সম্পন্ন</SelectItem>
                    <SelectItem value="cancelled">বাতিল</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>পেমেন্ট স্ট্যাটাস</Label>
                <Select 
                  value={editSession.payment_status}
                  onValueChange={(v) => setEditSession({ ...editSession, payment_status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">আনপেইড</SelectItem>
                    <SelectItem value="paid">পেইড</SelectItem>
                    <SelectItem value="verified">ভেরিফাইড</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>মিটিং লিংক</Label>
                <Input
                  placeholder="https://meet.google.com/..."
                  value={editSession.meeting_link || ""}
                  onChange={(e) => setEditSession({ ...editSession, meeting_link: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>নোট</Label>
                <Textarea
                  placeholder="সেশন সম্পর্কে নোট..."
                  value={editSession.notes || ""}
                  onChange={(e) => setEditSession({ ...editSession, notes: e.target.value })}
                />
              </div>

              <Button 
                onClick={() => updateSession(editSession.id, {
                  status: editSession.status,
                  payment_status: editSession.payment_status,
                  meeting_link: editSession.meeting_link,
                  notes: editSession.notes
                })}
                className="w-full"
              >
                সেভ করুন
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMentorship;
