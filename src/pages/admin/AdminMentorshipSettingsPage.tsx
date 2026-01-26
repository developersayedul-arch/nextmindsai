import AdminLayout from "@/components/admin/AdminLayout";
import AdminMentorshipSettings from "@/components/admin/AdminMentorshipSettings";
import { Settings } from "lucide-react";

const AdminMentorshipSettingsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Settings className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">মেন্টরশিপ সেটিংস</h1>
            <p className="text-sm text-muted-foreground">
              প্রাইসিং ও ফিচার কন্ট্রোল
            </p>
          </div>
        </div>

        <AdminMentorshipSettings />
      </div>
    </AdminLayout>
  );
};

export default AdminMentorshipSettingsPage;
