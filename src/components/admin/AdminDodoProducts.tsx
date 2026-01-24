import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  CreditCard,
  Users,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface DodoProduct {
  id: string;
  product_type: string;
  product_key: string;
  dodo_product_id: string;
  display_name: string;
  display_name_bn: string | null;
  price_bdt: number;
  duration_info: string | null;
  is_active: boolean;
  display_order: number;
}

const AdminDodoProducts = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DodoProduct | null>(null);
  const [formData, setFormData] = useState({
    product_type: "analysis",
    product_key: "",
    dodo_product_id: "",
    display_name: "",
    display_name_bn: "",
    price_bdt: 0,
    duration_info: "",
    is_active: true,
    display_order: 0
  });

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-dodo-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dodo_products")
        .select("*")
        .order("product_type")
        .order("display_order");
      
      if (error) throw error;
      return data as DodoProduct[];
    }
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from("dodo_products")
          .update({
            product_type: data.product_type,
            product_key: data.product_key,
            dodo_product_id: data.dodo_product_id,
            display_name: data.display_name,
            display_name_bn: data.display_name_bn || null,
            price_bdt: data.price_bdt,
            duration_info: data.duration_info || null,
            is_active: data.is_active,
            display_order: data.display_order
          })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("dodo_products")
          .insert({
            product_type: data.product_type,
            product_key: data.product_key,
            dodo_product_id: data.dodo_product_id,
            display_name: data.display_name,
            display_name_bn: data.display_name_bn || null,
            price_bdt: data.price_bdt,
            duration_info: data.duration_info || null,
            is_active: data.is_active,
            display_order: data.display_order
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dodo-products"] });
      toast.success(editingProduct ? "প্রোডাক্ট আপডেট হয়েছে" : "প্রোডাক্ট যোগ হয়েছে");
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error("সমস্যা হয়েছে: " + error.message);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("dodo_products")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dodo-products"] });
      toast.success("প্রোডাক্ট ডিলিট হয়েছে");
    },
    onError: (error: Error) => {
      toast.error("ডিলিট করতে সমস্যা: " + error.message);
    }
  });

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      product_type: "analysis",
      product_key: "",
      dodo_product_id: "",
      display_name: "",
      display_name_bn: "",
      price_bdt: 0,
      duration_info: "",
      is_active: true,
      display_order: 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: DodoProduct) => {
    setEditingProduct(product);
    setFormData({
      product_type: product.product_type,
      product_key: product.product_key,
      dodo_product_id: product.dodo_product_id,
      display_name: product.display_name,
      display_name_bn: product.display_name_bn || "",
      price_bdt: product.price_bdt,
      duration_info: product.duration_info || "",
      is_active: product.is_active,
      display_order: product.display_order
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (!formData.product_key || !formData.display_name) {
      toast.error("Product Key ও Display Name আবশ্যক");
      return;
    }
    saveMutation.mutate({
      ...formData,
      id: editingProduct?.id
    });
  };

  const analysisProducts = products?.filter(p => p.product_type === "analysis") || [];
  const mentorshipProducts = products?.filter(p => p.product_type === "mentorship") || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DodoPayment Products</h2>
          <p className="text-muted-foreground">
            Manage payment product IDs for all packages
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Analysis Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Analysis Plans
          </CardTitle>
          <CardDescription>এনালাইসিস প্যাকেজগুলোর প্রোডাক্ট আইডি</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Key</TableHead>
                <TableHead>Name (BN)</TableHead>
                <TableHead>Price (BDT)</TableHead>
                <TableHead>DodoPayment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.product_key}</TableCell>
                  <TableCell>{product.display_name_bn || product.display_name}</TableCell>
                  <TableCell>৳{product.price_bdt}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {product.dodo_product_id || "Not Set"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          if (confirm("এই প্রোডাক্ট ডিলিট করতে চান?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {analysisProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No analysis products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mentorship Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mentorship Sessions
          </CardTitle>
          <CardDescription>মেন্টরশিপ সেশনগুলোর প্রোডাক্ট আইডি</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Key</TableHead>
                <TableHead>Name (BN)</TableHead>
                <TableHead>Price (BDT)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>DodoPayment ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentorshipProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">{product.product_key}</TableCell>
                  <TableCell>{product.display_name_bn || product.display_name}</TableCell>
                  <TableCell>৳{product.price_bdt}</TableCell>
                  <TableCell>{product.duration_info || "-"}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {product.dodo_product_id || (
                        <span className="text-destructive">Not Set</span>
                      )}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          if (confirm("এই প্রোডাক্ট ডিলিট করতে চান?")) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {mentorshipProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No mentorship products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select
                value={formData.product_type}
                onValueChange={(value) => setFormData({ ...formData, product_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Analysis Plan</SelectItem>
                  <SelectItem value="mentorship">Mentorship Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Key *</Label>
              <Input
                placeholder="e.g., single, marketing, scaling"
                value={formData.product_key}
                onChange={(e) => setFormData({ ...formData, product_key: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>DodoPayment Product ID</Label>
              <Input
                placeholder="pdt_xxxxx"
                value={formData.dodo_product_id}
                onChange={(e) => setFormData({ ...formData, dodo_product_id: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name (EN) *</Label>
                <Input
                  placeholder="Single Analysis"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Name (BN)</Label>
                <Input
                  placeholder="সিঙ্গেল এনালাইসিস"
                  value={formData.display_name_bn}
                  onChange={(e) => setFormData({ ...formData, display_name_bn: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (BDT)</Label>
                <Input
                  type="number"
                  value={formData.price_bdt}
                  onChange={(e) => setFormData({ ...formData, price_bdt: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration Info</Label>
              <Input
                placeholder="e.g., 60 মিনিট"
                value={formData.duration_info}
                onChange={(e) => setFormData({ ...formData, duration_info: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProduct ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDodoProducts;
