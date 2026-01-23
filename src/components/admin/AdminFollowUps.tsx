import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Bell, 
  Plus, 
  Check, 
  Clock, 
  Phone, 
  Trash2,
  Loader2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  whatsapp_number: string | null;
  business_idea: string | null;
  is_completed: boolean | null;
}

interface Reminder {
  id: string;
  lead_id: string;
  scheduled_at: string;
  status: string;
  reminder_type: string;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  leads?: Lead;
}

const AdminFollowUps = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [uncompletedLeads, setUncompletedLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    lead_id: "",
    scheduled_at: "",
    reminder_type: "whatsapp",
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from("follow_up_reminders")
        .select(`
          *,
          leads (id, whatsapp_number, business_idea, is_completed)
        `)
        .order("scheduled_at", { ascending: true });

      if (remindersError) throw remindersError;
      setReminders(remindersData || []);

      // Fetch uncompleted leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("id, whatsapp_number, business_idea, is_completed")
        .eq("is_completed", false)
        .not("whatsapp_number", "is", null);

      if (leadsError) throw leadsError;
      setUncompletedLeads(leadsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async () => {
    if (!newReminder.lead_id || !newReminder.scheduled_at) {
      toast.error("লিড ও সময় সিলেক্ট করুন");
      return;
    }

    try {
      const { error } = await supabase
        .from("follow_up_reminders")
        .insert({
          lead_id: newReminder.lead_id,
          scheduled_at: new Date(newReminder.scheduled_at).toISOString(),
          reminder_type: newReminder.reminder_type,
          notes: newReminder.notes || null
        });

      if (error) throw error;

      toast.success("রিমাইন্ডার তৈরি হয়েছে");
      setIsDialogOpen(false);
      setNewReminder({ lead_id: "", scheduled_at: "", reminder_type: "whatsapp", notes: "" });
      fetchData();
    } catch (err) {
      console.error("Error creating reminder:", err);
      toast.error("রিমাইন্ডার তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const completeReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from("follow_up_reminders")
        .update({ 
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("রিমাইন্ডার সম্পন্ন");
      fetchData();
    } catch (err) {
      console.error("Error completing reminder:", err);
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm("রিমাইন্ডার ডিলিট করতে চান?")) return;

    try {
      const { error } = await supabase
        .from("follow_up_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("রিমাইন্ডার ডিলিট হয়েছে");
      fetchData();
    } catch (err) {
      console.error("Error deleting reminder:", err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isOverdue = (scheduledAt: string) => {
    return new Date(scheduledAt) < new Date();
  };

  const pendingReminders = reminders.filter(r => r.status === "pending");
  const completedReminders = reminders.filter(r => r.status === "completed");
  const overdueReminders = pendingReminders.filter(r => isOverdue(r.scheduled_at));

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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReminders.length}</p>
                <p className="text-xs text-muted-foreground">পেন্ডিং</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Bell className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overdueReminders.length}</p>
                <p className="text-xs text-muted-foreground">ওভারডিউ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedReminders.length}</p>
                <p className="text-xs text-muted-foreground">সম্পন্ন</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Phone className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uncompletedLeads.length}</p>
                <p className="text-xs text-muted-foreground">অসম্পূর্ণ লিড</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Reminder Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ফলো-আপ রিমাইন্ডার</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              নতুন রিমাইন্ডার
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>নতুন ফলো-আপ রিমাইন্ডার</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>লিড সিলেক্ট করুন</Label>
                <Select 
                  value={newReminder.lead_id}
                  onValueChange={(v) => setNewReminder({ ...newReminder, lead_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="একটি লিড সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {uncompletedLeads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.whatsapp_number} - {lead.business_idea?.slice(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>সময় সিলেক্ট করুন</Label>
                <Input
                  type="datetime-local"
                  value={newReminder.scheduled_at}
                  onChange={(e) => setNewReminder({ ...newReminder, scheduled_at: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>রিমাইন্ডার টাইপ</Label>
                <Select 
                  value={newReminder.reminder_type}
                  onValueChange={(v) => setNewReminder({ ...newReminder, reminder_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="call">ফোন কল</SelectItem>
                    <SelectItem value="email">ইমেইল</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>নোট (ঐচ্ছিক)</Label>
                <Textarea
                  placeholder="কি বলতে চান লিখুন..."
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                />
              </div>

              <Button onClick={createReminder} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                রিমাইন্ডার তৈরি করুন
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">পেন্ডিং রিমাইন্ডার ({pendingReminders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>সময়</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>বিজনেস আইডিয়া</TableHead>
                <TableHead>টাইপ</TableHead>
                <TableHead>নোট</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    কোনো পেন্ডিং রিমাইন্ডার নেই
                  </TableCell>
                </TableRow>
              ) : (
                pendingReminders.map((reminder) => (
                  <TableRow key={reminder.id} className={isOverdue(reminder.scheduled_at) ? "bg-red-500/5" : ""}>
                    <TableCell className="whitespace-nowrap">
                      <span className={isOverdue(reminder.scheduled_at) ? "text-red-500 font-medium" : ""}>
                        {formatDate(reminder.scheduled_at)}
                      </span>
                      {isOverdue(reminder.scheduled_at) && (
                        <span className="ml-2 text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded">
                          ওভারডিউ
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(reminder as any).leads?.whatsapp_number ? (
                        <a 
                          href={`https://wa.me/88${(reminder as any).leads.whatsapp_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-500 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {(reminder as any).leads.whatsapp_number}
                        </a>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {(reminder as any).leads?.business_idea || "-"}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary rounded text-xs">
                        {reminder.reminder_type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {reminder.notes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500"
                          onClick={() => completeReminder(reminder.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteReminder(reminder.id)}
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
    </div>
  );
};

export default AdminFollowUps;
