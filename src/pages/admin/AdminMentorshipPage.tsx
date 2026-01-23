import AdminLayout from "@/components/admin/AdminLayout";
import AdminMentorship from "@/components/admin/AdminMentorship";
import { Users } from "lucide-react";

const AdminMentorshipPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">মেন্টরশিপ</h1>
            <p className="text-sm text-muted-foreground">
              সব মেন্টরশিপ সেশন ম্যানেজ করুন
            </p>
          </div>
        </div>

        <AdminMentorship />
      </div>
    </AdminLayout>
  );
};

export default AdminMentorshipPage;
