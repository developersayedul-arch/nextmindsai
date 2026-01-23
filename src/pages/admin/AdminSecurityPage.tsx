import AdminLayout from "@/components/admin/AdminLayout";
import AdminSecurity from "@/components/admin/AdminSecurity";
import { Shield } from "lucide-react";

const AdminSecurityPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">সিকিউরিটি</h1>
            <p className="text-sm text-muted-foreground">
              লগইন attempts ও whitelist ম্যানেজ করুন
            </p>
          </div>
        </div>

        <AdminSecurity />
      </div>
    </AdminLayout>
  );
};

export default AdminSecurityPage;
