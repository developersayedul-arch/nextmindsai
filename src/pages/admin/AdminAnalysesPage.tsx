import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalyses from "@/components/admin/AdminAnalyses";
import { FileText } from "lucide-react";

const AdminAnalysesPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">এনালাইসিস</h1>
            <p className="text-sm text-muted-foreground">
              সব বিজনেস এনালাইসিস দেখুন ও ম্যানেজ করুন
            </p>
          </div>
        </div>

        <AdminAnalyses />
      </div>
    </AdminLayout>
  );
};

export default AdminAnalysesPage;
