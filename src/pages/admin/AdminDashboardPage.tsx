import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Shield } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ড্যাশবোর্ড</h1>
            <p className="text-sm text-muted-foreground">
              সব ডাটা ও বিজনেস insights দেখুন
            </p>
          </div>
        </div>

        <AdminDashboard />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
