import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
  AlertCircle,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Star,
  Calendar,
  Phone,
  Mail,
  Globe,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Award,
  Ban,
  BarChart3,
  Megaphone,
  MessageSquare,
  Settings,
} from "lucide-react";
import AdminTopNavbar from "@/components/AdminTopNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SupplierBadge {
  slug: string;
  arabicName: string;
  color: string;
  icon: string;
}

interface Supplier {
  id: string;
  companyName: string;
  arabicCompanyName: string;
  email: string;
  phone: string;
  logo: string;
  location: string;
  speciality: string;
  verified: boolean;
  isApproved: boolean;
  rating: number;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
  platformCommission: number;
  revenue: number;
  complaints: number;
  badges: string[]; // Array of badge slugs
  createdAt: string;
}

// Available badge types
const AVAILABLE_BADGES: SupplierBadge[] = [
  { slug: "trusted", arabicName: "موثوق", color: "blue", icon: "Shield" },
  { slug: "featured", arabicName: "مميز", color: "purple", icon: "Star" },
  { slug: "new", arabicName: "جديد", color: "green", icon: "CheckCircle" },
  { slug: "certified", arabicName: "معتمد", color: "gold", icon: "Award" },
  { slug: "syndicate_verified", arabicName: "موثوق من النقابة", color: "indigo", icon: "Building2" },
  { slug: "syndicate_supported", arabicName: "مدعوم من النقابة", color: "teal", icon: "Users" },
];

export default function AdminSuppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      companyName: "DentalTech Solutions",
      arabicCompanyName: "شركة حلول الأسنان التقنية",
      email: "info@dentaltech.iq",
      phone: "+964 770 123 4567",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
      location: "بغداد، العراق",
      speciality: "معدات طبية متقدمة",
      verified: true,
      isApproved: true,
      rating: 4.9,
      totalOrders: 1250,
      totalProducts: 450,
      totalReviews: 234,
      platformCommission: 15,
      revenue: 125000000,
      complaints: 2,
      badges: ["trusted", "featured", "syndicate_verified"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      companyName: "Medical Supply Co",
      arabicCompanyName: "شركة الإمدادات الطبية",
      email: "info@medicalsupply.iq",
      phone: "+964 771 234 5678",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
      location: "البصرة، العراق",
      speciality: "مستلزمات طبية عامة",
      verified: true,
      isApproved: false,
      rating: 4.5,
      totalOrders: 850,
      totalProducts: 320,
      totalReviews: 156,
      platformCommission: 12,
      revenue: 85000000,
      complaints: 5,
      badges: ["certified"],
      createdAt: "2024-02-20",
    },
    {
      id: "3",
      companyName: "Advanced Dental Equipment",
      arabicCompanyName: "معدات الأسنان المتقدمة",
      email: "info@advanceddental.iq",
      phone: "+964 772 345 6789",
      logo: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=150&h=150&fit=crop",
      location: "أربيل، العراق",
      speciality: "أجهزة تشخيص متقدمة",
      verified: false,
      isApproved: false,
      rating: 4.2,
      totalOrders: 320,
      totalProducts: 180,
      totalReviews: 89,
      platformCommission: 10,
      revenue: 32000000,
      complaints: 8,
      badges: ["new"],
      createdAt: "2024-03-10",
    },
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "verify" | "approve" | "reject" | null;
    supplierId: string | null;
  }>({ open: false, type: null, supplierId: null });
  const [badgeDialog, setBadgeDialog] = useState<{
    open: boolean;
    supplierId: string | null;
  }>({ open: false, supplierId: null });
  const [suspendDialog, setSuspendDialog] = useState<{
    open: boolean;
    supplierId: string | null;
  }>({ open: false, supplierId: null });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBadge, setFilterBadge] = useState<string>("all"); // Filter by badge
  const [searchQuery, setSearchQuery] = useState("");
  const [note, setNote] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const getStatusBadge = (supplier: Supplier) => {
    if (supplier.verified && supplier.isApproved) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          معتمد وموثق
        </Badge>
      );
    }
    if (supplier.verified && !supplier.isApproved) {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          موثق
        </Badge>
      );
    }
    if (!supplier.verified && supplier.isApproved) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          معتمد
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-300 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        قيد المراجعة
      </Badge>
    );
  };

  const handleAction = (type: "verify" | "approve" | "reject", supplierId: string) => {
    setActionDialog({ open: true, type, supplierId });
  };

  const confirmAction = () => {
    if (!actionDialog.supplierId || !actionDialog.type) return;

    setSuppliers(
      suppliers.map((sup) => {
        if (sup.id === actionDialog.supplierId) {
          if (actionDialog.type === "verify") {
            return { ...sup, verified: true };
          }
          if (actionDialog.type === "approve") {
            return { ...sup, isApproved: true };
          }
          if (actionDialog.type === "reject") {
            return { ...sup, isApproved: false };
          }
        }
        return sup;
      })
    );

    setActionDialog({ open: false, type: null, supplierId: null });
    setNote("");
  };

  const toggleBadge = (supplierId: string, badgeSlug: string) => {
    setSuppliers(
      suppliers.map((sup) => {
        if (sup.id === supplierId) {
          const currentBadges = sup.badges || [];
          if (currentBadges.includes(badgeSlug)) {
            // Remove badge
            return { ...sup, badges: currentBadges.filter(b => b !== badgeSlug) };
          } else {
            // Add badge
            return { ...sup, badges: [...currentBadges, badgeSlug] };
          }
        }
        return sup;
      })
    );
  };

  const getBadgeDetails = (slug: string): SupplierBadge | undefined => {
    return AVAILABLE_BADGES.find(b => b.slug === slug);
  };

  const handleSuspend = () => {
    if (!suspendDialog.supplierId || !suspendReason.trim()) return;
    
    // Here you would typically call an API to suspend the supplier
    console.log("Suspending supplier:", suspendDialog.supplierId, "Reason:", suspendReason);
    
    // For now, just update the state to mark as not approved
    setSuppliers(
      suppliers.map((sup) =>
        sup.id === suspendDialog.supplierId
          ? { ...sup, isApproved: false, verified: false }
          : sup
      )
    );
    
    setSuspendDialog({ open: false, supplierId: null });
    setSuspendReason("");
  };

  const getBadgeColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      green: "bg-green-100 text-green-700 border-green-300",
      gold: "bg-yellow-100 text-yellow-700 border-yellow-300",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
      teal: "bg-teal-100 text-teal-700 border-teal-300",
    };
    return colors[color] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesSearch =
      sup.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.arabicCompanyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "verified" && sup.verified) ||
      (filterStatus === "approved" && sup.isApproved) ||
      (filterStatus === "pending" && !sup.isApproved);

    const matchesBadge = 
      filterBadge === "all" || 
      (sup.badges && sup.badges.includes(filterBadge));

    return matchesSearch && matchesStatus && matchesBadge;
  });

  const stats = {
    total: suppliers.length,
    verified: suppliers.filter((s) => s.verified).length,
    approved: suppliers.filter((s) => s.isApproved).length,
    pending: suppliers.filter((s) => !s.isApproved).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <AdminTopNavbar />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-7 h-7 text-blue-600" />
                مركز إدارة الموردين
              </h1>
              <p className="text-sm text-gray-600 mt-1">مراقبة وإدارة جميع الموردين في المنصة</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/admin/suppliers")}
            >
              <Building2 className="w-4 h-4 ml-2" />
              الموردين
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/analytics")}
            >
              <BarChart3 className="w-4 h-4 ml-2" />
              الإحصائيات
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/promotions")}
            >
              <Megaphone className="w-4 h-4 ml-2" />
              الحملات الترويجية
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/suppliers/support")}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              الدعم
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/platform-settings")}
            >
              <Settings className="w-4 h-4 ml-2" />
              إعدادات المنصة
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الموردين</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">معتمدون</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">موثقون</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">قيد المراجعة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="بحث بالاسم، البريد، أو الموقع..."
                    className="pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الموردين</SelectItem>
                    <SelectItem value="verified">موثقون</SelectItem>
                    <SelectItem value="approved">معتمدون</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterBadge} onValueChange={setFilterBadge}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="فلترة حسب الوسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الوسوم</SelectItem>
                    {AVAILABLE_BADGES.map((badge) => (
                      <SelectItem key={badge.slug} value={badge.slug}>
                        {badge.arabicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">المورد</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الموقع</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">التقييم</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الطلبات</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الإيرادات</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">العمولة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الشكاوي</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الحالة</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={supplier.logo} />
                            <AvatarFallback>{supplier.arabicCompanyName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{supplier.arabicCompanyName}</p>
                            <p className="text-xs text-gray-500">{supplier.email}</p>
                            {supplier.badges && supplier.badges.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {supplier.badges.slice(0, 2).map((badgeSlug) => {
                                  const badge = getBadgeDetails(badgeSlug);
                                  if (!badge) return null;
                                  return (
                                    <Badge
                                      key={badgeSlug}
                                      variant="outline"
                                      className={cn("text-[10px] px-1 py-0", getBadgeColorClass(badge.color))}
                                    >
                                      {badge.arabicName}
                                    </Badge>
                                  );
                                })}
                                {supplier.badges.length > 2 && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    +{supplier.badges.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {supplier.location}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{supplier.rating}</span>
                          <span className="text-xs text-gray-500">({supplier.totalReviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{supplier.totalOrders.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                          <DollarSign className="w-4 h-4" />
                          {(supplier.revenue / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {supplier.platformCommission}%
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            supplier.complaints > 5
                              ? "bg-red-50 text-red-700 border-red-200"
                              : supplier.complaints > 2
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          )}
                        >
                          {supplier.complaints}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(supplier)}</td>
                      <td className="px-4 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!supplier.verified && (
                              <DropdownMenuItem onClick={() => handleAction("verify", supplier.id)}>
                                <Shield className="w-4 h-4 ml-2" />
                                توثيق الحساب
                              </DropdownMenuItem>
                            )}
                            {!supplier.isApproved && (
                              <DropdownMenuItem onClick={() => handleAction("approve", supplier.id)}>
                                <CheckCircle className="w-4 h-4 ml-2" />
                                الموافقة على المورد
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setBadgeDialog({ open: true, supplierId: supplier.id })}>
                              <Award className="w-4 h-4 ml-2" />
                              إدارة الوسوم
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSuspendDialog({ open: true, supplierId: supplier.id })}
                              className="text-orange-600"
                            >
                              <Ban className="w-4 h-4 ml-2" />
                              إلغاء تفعيل الحساب
                            </DropdownMenuItem>
                            {supplier.isApproved && (
                              <DropdownMenuItem
                                onClick={() => handleAction("reject", supplier.id)}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 ml-2" />
                                إلغاء الموافقة
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "verify"
                ? "توثيق حساب المورد"
                : actionDialog.type === "approve"
                ? "الموافقة على المورد"
                : "إلغاء الموافقة"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "verify"
                ? "سيتم منح المورد علامة التوثيق الزرقاء"
                : actionDialog.type === "approve"
                ? "سيتم تفعيل حساب المورد والسماح له بالبيع على المنصة"
                : "سيتم إيقاف حساب المورد مؤقتاً"}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="أضف ملاحظة (اختياري)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, supplierId: null })}>
              إلغاء
            </Button>
            <Button onClick={confirmAction} variant={actionDialog.type === "reject" ? "destructive" : "default"}>
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Badge Management Dialog */}
      <Dialog open={badgeDialog.open} onOpenChange={(open) => setBadgeDialog({ ...badgeDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              إدارة وسوم المورد
            </DialogTitle>
            <DialogDescription>
              اختر الوسوم التي تريد منحها للمورد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {AVAILABLE_BADGES.map((badge) => {
              const currentSupplier = suppliers.find(s => s.id === badgeDialog.supplierId);
              const isActive = currentSupplier?.badges?.includes(badge.slug);
              
              return (
                <div
                  key={badge.slug}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                    isActive
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => badgeDialog.supplierId && toggleBadge(badgeDialog.supplierId, badge.slug)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      getBadgeColorClass(badge.color)
                    )}>
                      {badge.icon === "Shield" && <Shield className="w-5 h-5" />}
                      {badge.icon === "Star" && <Star className="w-5 h-5" />}
                      {badge.icon === "CheckCircle" && <CheckCircle className="w-5 h-5" />}
                      {badge.icon === "Award" && <Award className="w-5 h-5" />}
                      {badge.icon === "Building2" && <Building2 className="w-5 h-5" />}
                      {badge.icon === "Users" && <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{badge.arabicName}</p>
                      <p className="text-xs text-gray-500">{badge.slug}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isActive
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-300"
                  )}>
                    {isActive && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setBadgeDialog({ open: false, supplierId: null })}>
              تم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog.open} onOpenChange={(open) => setSuspendDialog({ open, supplierId: null })}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <Ban className="w-5 h-5" />
              إلغاء تفعيل حساب المورد
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في إلغاء تفعيل حساب هذا المورد؟ سيتم إيقاف جميع خدماته ومنعه من الدخول للمنصة.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>سبب إلغاء التفعيل *</Label>
              <Textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="مثال: عدم الدفع، سلوك سيء مع العملاء، انتهاك شروط الخدمة..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>تنبيه:</strong> سيتم إلغاء جميع الطلبات النشطة وإشعار العملاء بالإيقاف.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSuspendDialog({ open: false, supplierId: null });
                setSuspendReason("");
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSuspend}
              disabled={!suspendReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Ban className="w-4 h-4 ml-2" />
              تأكيد الإيقاف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSupplier && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedSupplier.logo} />
                    <AvatarFallback>{selectedSupplier.arabicCompanyName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selectedSupplier.arabicCompanyName}</p>
                    <p className="text-sm font-normal text-gray-500">{selectedSupplier.companyName}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      البريد الإلكتروني
                    </p>
                    <p className="text-sm font-medium">{selectedSupplier.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      الهاتف
                    </p>
                    <p className="text-sm font-medium">{selectedSupplier.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      الموقع
                    </p>
                    <p className="text-sm font-medium">{selectedSupplier.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      التخصص
                    </p>
                    <p className="text-sm font-medium">{selectedSupplier.speciality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedSupplier.totalOrders}</p>
                      <p className="text-xs text-gray-500">إجمالي الطلبات</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{(selectedSupplier.revenue / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-gray-500">الإيرادات (IQD)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedSupplier.rating}</p>
                      <p className="text-xs text-gray-500">التقييم</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 mb-1">عمولة المنصة</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedSupplier.platformCommission}%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 mb-1">الشكاوي</p>
                    <p className="text-2xl font-bold text-red-900">{selectedSupplier.complaints}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
