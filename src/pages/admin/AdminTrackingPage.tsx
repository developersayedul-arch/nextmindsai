import AdminLayout from "@/components/admin/AdminLayout";
import AdminAnonymousTracking from "@/components/admin/AdminAnonymousTracking";

const AdminTrackingPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">অ্যানোনিমাস ট্র্যাকিং</h1>
          <p className="text-muted-foreground">
            অ্যাকাউন্ট ছাড়া ভিজিটরদের ফর্ম ডেটা ও ট্র্যাকিং
          </p>
        </div>
        <AdminAnonymousTracking />
      </div>
    </AdminLayout>
  );
};

export default AdminTrackingPage;