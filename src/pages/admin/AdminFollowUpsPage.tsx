import AdminLayout from "@/components/admin/AdminLayout";
import AdminFollowUps from "@/components/admin/AdminFollowUps";
import { Bell } from "lucide-react";

const AdminFollowUpsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Bell className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ফলো-আপ রিমাইন্ডার</h1>
            <p className="text-sm text-muted-foreground">
              অসম্পূর্ণ লিডের ফলো-আপ ম্যানেজ করুন
            </p>
          </div>
        </div>

        <AdminFollowUps />
      </div>
    </AdminLayout>
  );
};

export default AdminFollowUpsPage;
