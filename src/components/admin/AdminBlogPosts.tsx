import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  description: string | null;
  embed_code: string | null;
  source_url: string | null;
  source_type: string;
  thumbnail_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const AdminBlogPosts = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    embed_code: "",
    source_url: "",
    source_type: "article",
    thumbnail_url: "",
    is_published: false,
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (post: typeof form & { id?: string }) => {
      const payload = {
        ...post,
        published_at: post.is_published ? new Date().toISOString() : null,
        description: post.description || null,
        embed_code: post.embed_code || null,
        source_url: post.source_url || null,
        thumbnail_url: post.thumbnail_url || null,
      };
      if (post.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success(editingPost ? "পোস্ট আপডেট হয়েছে" : "পোস্ট তৈরি হয়েছে");
      resetForm();
    },
    onError: () => toast.error("সমস্যা হয়েছে"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("পোস্ট ডিলিট হয়েছে");
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
    },
  });

  const resetForm = () => {
    setForm({ title: "", description: "", embed_code: "", source_url: "", source_type: "article", thumbnail_url: "", is_published: false });
    setEditingPost(null);
    setDialogOpen(false);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      description: post.description || "",
      embed_code: post.embed_code || "",
      source_url: post.source_url || "",
      source_type: post.source_type,
      thumbnail_url: post.thumbnail_url || "",
      is_published: post.is_published,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return toast.error("টাইটেল দিন");
    saveMutation.mutate({ ...form, id: editingPost?.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ব্লগ পোস্ট</h1>
          <p className="text-muted-foreground">সোশ্যাল মিডিয়া ও আর্টিকেল এম্বেড করুন</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />নতুন পোস্ট</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "পোস্ট এডিট করুন" : "নতুন পোস্ট তৈরি করুন"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">টাইটেল *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="পোস্টের টাইটেল" />
              </div>
              <div>
                <label className="text-sm font-medium">বিবরণ</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="সংক্ষিপ্ত বিবরণ" />
              </div>
              <div>
                <label className="text-sm font-medium">সোর্স টাইপ</label>
                <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">এম্বেড কোড (HTML)</label>
                <Textarea value={form.embed_code} onChange={(e) => setForm({ ...form, embed_code: e.target.value })} placeholder="<iframe>...</iframe> বা এম্বেড HTML পেস্ট করুন" rows={5} className="font-mono text-xs" />
              </div>
              <div>
                <label className="text-sm font-medium">সোর্স URL</label>
                <Input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium">থাম্বনেইল URL</label>
                <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} id="published" />
                <label htmlFor="published" className="text-sm">পাবলিশ করুন</label>
              </div>
              <Button onClick={handleSubmit} disabled={saveMutation.isPending} className="w-full">
                {saveMutation.isPending ? "সেভ হচ্ছে..." : editingPost ? "আপডেট করুন" : "তৈরি করুন"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">লোড হচ্ছে...</div>
          ) : !posts?.length ? (
            <div className="p-8 text-center text-muted-foreground">কোনো পোস্ট নেই</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>টাইটেল</TableHead>
                  <TableHead>সোর্স</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.source_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(post.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => togglePublish.mutate({ id: post.id, is_published: !post.is_published })}>
                        {post.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {post.source_url && (
                        <Button size="icon" variant="ghost" asChild>
                          <a href={post.source_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(post.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogPosts;
