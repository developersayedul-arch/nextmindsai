import AdminLayout from "@/components/admin/AdminLayout";
import AdminChat from "@/components/admin/AdminChat";

const AdminChatPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Live Chat</h1>
          <p className="text-muted-foreground">
            Manage visitor conversations and reply in real-time
          </p>
        </div>
        <AdminChat />
      </div>
    </AdminLayout>
  );
};

export default AdminChatPage;
