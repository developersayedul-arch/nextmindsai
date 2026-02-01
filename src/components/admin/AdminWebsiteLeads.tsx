import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Globe, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2
} from "lucide-react";

interface WebsiteLead {
  id: string;
  name: string;
  whatsapp_number: string;
  email: string | null;
  business_idea: string | null;
  service_interest: string;
  budget_range: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const AdminWebsiteLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['website-leads', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('website_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WebsiteLead[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('website_leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-leads'] });
      toast.success("স্ট্যাটাস আপডেট হয়েছে");
    },
    onError: () => {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('website_leads')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-leads'] });
      toast.success("লিড ডিলিট হয়েছে");
    },
    onError: () => {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  });

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.whatsapp_number.includes(searchTerm) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    lead.service_interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">নতুন</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500">যোগাযোগ হয়েছে</Badge>;
      case 'converted':
        return <Badge className="bg-green-500">কনভার্ট</Badge>;
      case 'lost':
        return <Badge variant="destructive">লস্ট</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    total: leads?.length || 0,
    new: leads?.filter(l => l.status === 'new').length || 0,
    contacted: leads?.filter(l => l.status === 'contacted').length || 0,
    converted: leads?.filter(l => l.status === 'converted').length || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Website Leads
          </h1>
          <p className="text-muted-foreground">Services page থেকে আসা leads</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">মোট Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            <div className="text-sm text-muted-foreground">নতুন</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{stats.contacted}</div>
            <div className="text-sm text-muted-foreground">যোগাযোগ হয়েছে</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{stats.converted}</div>
            <div className="text-sm text-muted-foreground">কনভার্ট</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="নাম, নম্বর, ইমেইল বা সার্ভিস দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব দেখুন</SelectItem>
            <SelectItem value="new">নতুন</SelectItem>
            <SelectItem value="contacted">যোগাযোগ হয়েছে</SelectItem>
            <SelectItem value="converted">কনভার্ট</SelectItem>
            <SelectItem value="lost">লস্ট</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filteredLeads?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">কোনো lead পাওয়া যায়নি</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLeads?.map((lead) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      {getStatusBadge(lead.status)}
                      <Badge variant="outline">{lead.service_interest}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {lead.whatsapp_number}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </span>
                      )}
                      {lead.budget_range && (
                        <span>Budget: {lead.budget_range}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(lead.created_at), 'dd MMM yyyy, hh:mm a')}
                      </span>
                    </div>

                    {lead.business_idea && (
                      <p className="text-sm bg-muted/50 p-2 rounded">
                        {lead.business_idea}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                      onClick={() => window.open(`https://wa.me/88${lead.whatsapp_number}`, '_blank')}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp
                    </Button>
                    
                    <Select
                      value={lead.status}
                      onValueChange={(value) => updateStatusMutation.mutate({ id: lead.id, status: value })}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">নতুন</SelectItem>
                        <SelectItem value="contacted">যোগাযোগ হয়েছে</SelectItem>
                        <SelectItem value="converted">কনভার্ট</SelectItem>
                        <SelectItem value="lost">লস্ট</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("এই lead ডিলিট করতে চান?")) {
                          deleteMutation.mutate(lead.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteLeads;
