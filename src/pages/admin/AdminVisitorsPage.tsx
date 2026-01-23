import AdminLayout from "@/components/admin/AdminLayout";
import AdminVisitors from "@/components/admin/AdminVisitors";
import { Eye } from "lucide-react";

const AdminVisitorsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Eye className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ভিজিটর</h1>
            <p className="text-sm text-muted-foreground">
              সাইটের সব ভিজিটর ট্র্যাকিং দেখুন
            </p>
          </div>
        </div>

        <AdminVisitors />
      </div>
    </AdminLayout>
  );
};

export default AdminVisitorsPage;
