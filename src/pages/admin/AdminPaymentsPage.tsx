import AdminLayout from "@/components/admin/AdminLayout";
import AdminPayments from "@/components/admin/AdminPayments";

const AdminPaymentsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">পেমেন্ট ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">
            সব bKash, Nagad, Rocket পেমেন্ট ভেরিফাই ও ম্যানেজ করুন
          </p>
        </div>
        <AdminPayments />
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentsPage;