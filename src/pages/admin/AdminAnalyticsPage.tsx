import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import { TrendingUp } from "lucide-react";

const AdminAnalyticsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="gradient-hero p-3 rounded-xl">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">এনালিটিক্স</h1>
            <p className="text-sm text-muted-foreground">
              কনভার্সন ট্রেন্ড ও পারফরম্যান্স দেখুন
            </p>
          </div>
        </div>

        <AdminAnalyticsCharts />
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
