import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  CreditCard,
  Smartphone,
  Building2,
  Globe,
  GripVertical,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  account_number: string | null;
  account_name: string | null;
  instructions: string | null;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const PAYMENT_TYPES = [
  { value: "mobile_banking", label: "মোবাইল ব্যাংকিং", icon: Smartphone },
  { value: "bank", label: "ব্যাংক ট্রান্সফার", icon: Building2 },
  { value: "gateway", label: "পেমেন্ট গেটওয়ে (Manual)", icon: Globe },
  { value: "payment_gateway", label: "পেমেন্ট গেটওয়ে (Online)", icon: CreditCard },
];

const AdminPaymentMethods = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "mobile_banking",
    account_number: "",
    account_name: "",
    instructions: "",
    logo_url: "",
    is_active: true,
    display_order: 0,
  });

  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as PaymentMethod[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("payment_methods").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("পেমেন্ট মেথড যোগ হয়েছে!");
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Create error:", error);
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from("payment_methods")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("আপডেট হয়েছে!");
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("আপডেট করতে সমস্যা হয়েছে।");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("ডিলিট হয়েছে!");
      setIsDeleteDialogOpen(false);
      setSelectedMethod(null);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে।");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("payment_methods")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("স্ট্যাটাস আপডেট হয়েছে!");
    },
    onError: (error) => {
      console.error("Toggle error:", error);
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    },
  });

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setSelectedMethod(method);
      setFormData({
        name: method.name,
        type: method.type,
        account_number: method.account_number || "",
        account_name: method.account_name || "",
        instructions: method.instructions || "",
        logo_url: method.logo_url || "",
        is_active: method.is_active,
        display_order: method.display_order,
      });
    } else {
      setSelectedMethod(null);
      setFormData({
        name: "",
        type: "mobile_banking",
        account_number: "",
        account_name: "",
        instructions: "",
        logo_url: "",
        is_active: true,
        display_order: (paymentMethods?.length || 0) + 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMethod(null);
    setFormData({
      name: "",
      type: "mobile_banking",
      account_number: "",
      account_name: "",
      instructions: "",
      logo_url: "",
      is_active: true,
      display_order: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("নাম দিন");
      return;
    }

    if (selectedMethod) {
      updateMutation.mutate({ id: selectedMethod.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = PAYMENT_TYPES.find((t) => t.value === type);
    if (!typeInfo) return CreditCard;
    return typeInfo.icon;
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = PAYMENT_TYPES.find((t) => t.value === type);
    return typeInfo?.label || type;
  };

  const activeCount = paymentMethods?.filter((m) => m.is_active).length || 0;
  const totalCount = paymentMethods?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            পেমেন্ট মেথড ম্যানেজমেন্ট
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            মোট {totalCount} টি মেথড | {activeCount} টি সক্রিয়
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          নতুন মেথড
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {paymentMethods?.filter((m) => m.type === "mobile_banking").length || 0}
              </p>
              <p className="text-xs text-muted-foreground">মোবাইল ব্যাংকিং</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {paymentMethods?.filter((m) => m.type === "bank").length || 0}
              </p>
              <p className="text-xs text-muted-foreground">ব্যাংক ট্রান্সফার</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Globe className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {paymentMethods?.filter((m) => m.type === "gateway").length || 0}
              </p>
              <p className="text-xs text-muted-foreground">পেমেন্ট গেটওয়ে</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : paymentMethods && paymentMethods.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>নাম</TableHead>
                <TableHead>টাইপ</TableHead>
                <TableHead>একাউন্ট নম্বর</TableHead>
                <TableHead>একাউন্ট নাম</TableHead>
                <TableHead className="text-center">স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map((method, index) => {
                const TypeIcon = getTypeIcon(method.type);
                return (
                  <TableRow key={method.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {getTypeLabel(method.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {method.account_number || "-"}
                    </TableCell>
                    <TableCell>{method.account_name || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={method.is_active}
                        onCheckedChange={(checked) =>
                          toggleStatusMutation.mutate({ id: method.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(method)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(method)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">কোন পেমেন্ট মেথড নেই</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              প্রথম মেথড যোগ করুন
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedMethod ? "পেমেন্ট মেথড এডিট করুন" : "নতুন পেমেন্ট মেথড যোগ করুন"}
            </DialogTitle>
            <DialogDescription>
              bKash, Nagad, Rocket বা অন্য যেকোন পেমেন্ট মেথড যোগ করুন
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম *</Label>
                <Input
                  id="name"
                  placeholder="যেমন: বিকাশ (bKash)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">টাইপ</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_number">একাউন্ট নম্বর</Label>
                <Input
                  id="account_number"
                  placeholder="01XXXXXXXXX"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_name">একাউন্ট নাম</Label>
                <Input
                  id="account_name"
                  placeholder="SA Coder"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">নির্দেশনা (Instructions)</Label>
              <Textarea
                id="instructions"
                placeholder="Send Money করুন এবং Transaction ID দিন"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">ক্রম (Order)</Label>
                <Input
                  id="display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>স্ট্যাটাস</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <span className="text-sm">
                    {formData.is_active ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" /> সক্রিয়
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <XCircle className="h-4 w-4" /> নিষ্ক্রিয়
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {selectedMethod ? "আপডেট করুন" : "যোগ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedMethod?.name}" পেমেন্ট মেথড ডিলিট করলে এটি আর ব্যবহারযোগ্য থাকবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMethod && deleteMutation.mutate(selectedMethod.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPaymentMethods;
