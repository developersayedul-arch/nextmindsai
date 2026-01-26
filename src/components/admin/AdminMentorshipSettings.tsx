import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Settings,
  Save,
  Loader2,
  Edit,
  Power,
  Clock,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface MentorshipSettings {
  id: string;
  is_enabled: boolean;
  coming_soon_message: string | null;
  updated_at: string;
}

interface SessionType {
  id: string;
  session_key: string;
  label_bn: string;
  description_bn: string | null;
  price: number;
  duration_minutes: number;
  display_order: number;
  is_active: boolean;
  icon_name: string | null;
}

const AdminMentorshipSettings = () => {
  const [settings, setSettings] = useState<MentorshipSettings | null>(null);
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editSession, setEditSession] = useState<SessionType | null>(null);
  const [comingSoonMessage, setComingSoonMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, typesRes] = await Promise.all([
        supabase.from("mentorship_settings").select("*").limit(1).maybeSingle(),
        supabase.from("mentorship_session_types").select("*").order("display_order")
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (typesRes.error) throw typesRes.error;

      if (settingsRes.data) {
        setSettings(settingsRes.data);
        setComingSoonMessage(settingsRes.data.coming_soon_message || "");
      }
      setSessionTypes(typesRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const toggleMentorship = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("mentorship_settings")
        .update({ is_enabled: !settings.is_enabled })
        .eq("id", settings.id);

      if (error) throw error;

      setSettings({ ...settings, is_enabled: !settings.is_enabled });
      toast.success(settings.is_enabled ? "মেন্টরশিপ বন্ধ করা হয়েছে" : "মেন্টরশিপ চালু করা হয়েছে");
    } catch (err) {
      console.error("Error toggling mentorship:", err);
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const saveComingSoonMessage = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("mentorship_settings")
        .update({ coming_soon_message: comingSoonMessage })
        .eq("id", settings.id);

      if (error) throw error;

      setSettings({ ...settings, coming_soon_message: comingSoonMessage });
      toast.success("মেসেজ সেভ হয়েছে");
    } catch (err) {
      console.error("Error saving message:", err);
      toast.error("সেভ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const updateSessionType = async () => {
    if (!editSession) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("mentorship_session_types")
        .update({
          label_bn: editSession.label_bn,
          description_bn: editSession.description_bn,
          price: editSession.price,
          duration_minutes: editSession.duration_minutes,
          is_active: editSession.is_active
        })
        .eq("id", editSession.id);

      if (error) throw error;

      toast.success("সেশন টাইপ আপডেট হয়েছে");
      fetchData();
      setEditSession(null);
    } catch (err) {
      console.error("Error updating session type:", err);
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
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
      {/* Master Toggle */}
      <Card className={settings?.is_enabled ? "border-green-500/50" : "border-orange-500/50"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            মেন্টরশিপ ফিচার কন্ট্রোল
          </CardTitle>
          <CardDescription>
            মেন্টরশিপ সেকশন চালু/বন্ধ করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-3">
              {settings?.is_enabled ? (
                <Badge className="bg-green-500">চালু</Badge>
              ) : (
                <Badge variant="secondary" className="bg-orange-500 text-white">বন্ধ (Coming Soon)</Badge>
              )}
              <span className="font-medium">
                {settings?.is_enabled ? "মেন্টরশিপ বুকিং চালু আছে" : "ভিজিটররা Coming Soon দেখবে"}
              </span>
            </div>
            <Switch
              checked={settings?.is_enabled}
              onCheckedChange={toggleMentorship}
              disabled={saving}
            />
          </div>

          {!settings?.is_enabled && (
            <div className="space-y-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <Label>Coming Soon মেসেজ</Label>
              </div>
              <Textarea
                value={comingSoonMessage}
                onChange={(e) => setComingSoonMessage(e.target.value)}
                placeholder="মেন্টরশিপ সেশন শীঘ্রই আসছে..."
                rows={3}
              />
              <Button onClick={saveComingSoonMessage} disabled={saving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                মেসেজ সেভ করুন
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Types / Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            সেশন টাইপ ও প্রাইসিং
          </CardTitle>
          <CardDescription>
            প্রতিটি সেশনের দাম ও সময় পরিবর্তন করুন
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>সেশন টাইপ</TableHead>
                <TableHead>দাম (৳)</TableHead>
                <TableHead>সময়</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionTypes.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{session.label_bn}</p>
                      <p className="text-xs text-muted-foreground">{session.description_bn}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary">৳{session.price}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.duration_minutes} মিনিট
                    </span>
                  </TableCell>
                  <TableCell>
                    {session.is_active ? (
                      <Badge className="bg-green-500">সক্রিয়</Badge>
                    ) : (
                      <Badge variant="secondary">নিষ্ক্রিয়</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditSession(session)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editSession} onOpenChange={() => setEditSession(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>সেশন টাইপ এডিট করুন</DialogTitle>
          </DialogHeader>
          {editSession && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>সেশন নাম (বাংলা)</Label>
                <Input
                  value={editSession.label_bn}
                  onChange={(e) => setEditSession({ ...editSession, label_bn: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>বিবরণ (বাংলা)</Label>
                <Textarea
                  value={editSession.description_bn || ""}
                  onChange={(e) => setEditSession({ ...editSession, description_bn: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>দাম (৳)</Label>
                  <Input
                    type="number"
                    value={editSession.price}
                    onChange={(e) => setEditSession({ ...editSession, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সময় (মিনিট)</Label>
                  <Input
                    type="number"
                    value={editSession.duration_minutes}
                    onChange={(e) => setEditSession({ ...editSession, duration_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <Label>সেশন সক্রিয়</Label>
                <Switch
                  checked={editSession.is_active}
                  onCheckedChange={(checked) => setEditSession({ ...editSession, is_active: checked })}
                />
              </div>

              <Button 
                onClick={updateSessionType}
                className="w-full"
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                সেভ করুন
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMentorshipSettings;
