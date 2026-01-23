import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Code, 
  Smartphone, 
  ShoppingCart,
  Zap,
  MessageCircle,
  CheckCircle2,
  Edit,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  icon: typeof Globe;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  price: number;
  features: string[];
  whatsappMessage: string;
}

const defaultServices: Service[] = [
  {
    id: "landing-page",
    icon: Globe,
    title: "Landing Page",
    titleBn: "ল্যান্ডিং পেজ",
    description: "Professional landing page with order form",
    descriptionBn: "অর্ডার ফর্ম সহ প্রফেশনাল ল্যান্ডিং পেজ",
    price: 4999,
    features: ["Mobile optimized", "WhatsApp integration", "Order form", "SSL certificate"],
    whatsappMessage: "আসসালামু আলাইকুম, আমি Landing Page সার্ভিস নিতে চাই।"
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce Website",
    titleBn: "ই-কমার্স ওয়েবসাইট",
    description: "Full e-commerce with payment gateway",
    descriptionBn: "পেমেন্ট গেটওয়ে সহ সম্পূর্ণ ই-কমার্স সাইট",
    price: 14999,
    features: ["Product catalog", "Cart & checkout", "Payment integration", "Admin panel"],
    whatsappMessage: "আসসালামু আলাইকুম, আমি E-commerce Website সার্ভিস নিতে চাই।"
  },
  {
    id: "mobile-app",
    icon: Smartphone,
    title: "Mobile App",
    titleBn: "মোবাইল এপ",
    description: "Android/iOS app development",
    descriptionBn: "Android/iOS এপ ডেভেলপমেন্ট",
    price: 29999,
    features: ["Cross-platform", "Push notifications", "Admin dashboard", "App store publishing"],
    whatsappMessage: "আসসালামু আলাইকুম, আমি Mobile App সার্ভিস নিতে চাই।"
  },
  {
    id: "custom-software",
    icon: Code,
    title: "Custom Software",
    titleBn: "কাস্টম সফটওয়্যার",
    description: "Custom business software solution",
    descriptionBn: "বিজনেস সফটওয়্যার সলিউশন",
    price: 49999,
    features: ["Custom features", "Database design", "API development", "Ongoing support"],
    whatsappMessage: "আসসালামু আলাইকুম, আমি Custom Software সার্ভিস নিতে চাই।"
  }
];

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [whatsappNumber, setWhatsappNumber] = useState("8801712345678");

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    setServices(services.map(s => 
      s.id === editingId ? { ...s, ...editForm } : s
    ));
    setEditingId(null);
    setEditForm({});
    toast.success("সার্ভিস আপডেট হয়েছে");
  };

  const getWhatsAppLink = (service: Service) => {
    const message = encodeURIComponent(service.whatsappMessage);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            SA Coder সার্ভিস
          </h2>
          <p className="text-muted-foreground mt-1">
            Website ও App Development সার্ভিস ম্যানেজ করুন
          </p>
        </div>
      </div>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            WhatsApp সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>WhatsApp নম্বর (country code সহ)</Label>
              <Input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="8801712345678"
                className="mt-1"
              />
            </div>
            <Button onClick={() => toast.success("নম্বর সেভ হয়েছে")}>
              <Save className="h-4 w-4 mr-2" />
              সেভ করুন
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            {editingId === service.id ? (
              <>
                <CardHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Title (English)</Label>
                      <Input
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Title (বাংলা)</Label>
                      <Input
                        value={editForm.titleBn || ""}
                        onChange={(e) => setEditForm({ ...editForm, titleBn: e.target.value })}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Description (বাংলা)</Label>
                    <Textarea
                      value={editForm.descriptionBn || ""}
                      onChange={(e) => setEditForm({ ...editForm, descriptionBn: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Price (৳)</Label>
                    <Input
                      type="number"
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>WhatsApp Message</Label>
                    <Textarea
                      value={editForm.whatsappMessage || ""}
                      onChange={(e) => setEditForm({ ...editForm, whatsappMessage: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      সেভ করুন
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.titleBn}</CardTitle>
                        <CardDescription>{service.title}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.descriptionBn}</p>
                  
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-primary">৳{service.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">শুরু হচ্ছে</p>
                  </div>

                  <div className="space-y-2">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(getWhatsAppLink(service), "_blank")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp এ যোগাযোগ করুন
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            সার্ভিস পরিসংখ্যান
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{services.length}</p>
              <p className="text-sm text-muted-foreground">মোট সার্ভিস</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-green-500">৳{Math.min(...services.map(s => s.price)).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">সর্বনিম্ন দাম</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-orange-500">৳{Math.max(...services.map(s => s.price)).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">সর্বোচ্চ দাম</p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-500">7-30</p>
              <p className="text-sm text-muted-foreground">দিনে ডেলিভারি</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
