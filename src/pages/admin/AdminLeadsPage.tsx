import AdminLayout from "@/components/admin/AdminLayout";
import AdminLeads from "@/components/admin/AdminLeads";
import { Target } from "lucide-react";

const AdminLeadsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Target className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">লিডস</h1>
            <p className="text-sm text-muted-foreground">
              সব ভিজিটর থেকে কালেক্ট করা লিড দেখুন ও ম্যানেজ করুন
            </p>
          </div>
        </div>

        <AdminLeads />
      </div>
    </AdminLayout>
  );
};

export default AdminLeadsPage;
