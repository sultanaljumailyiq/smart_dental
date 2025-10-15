import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  Tag,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: "active" | "inactive";
}

interface Order {
  id: string;
  orderNumber: string;
  clinic: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

interface Offer {
  id: string;
  title: string;
  discount: number;
  validUntil: string;
  status: "active" | "expired";
  applicableProducts: string[];
}

interface SupplierProfile {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  description: string;
  businessLicense: string;
}

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "p1",
      name: "جهاز تبييض الأسنان",
      category: "أجهزة",
      price: 2500000,
      stock: 15,
      status: "active",
    },
    {
      id: "p2",
      name: "قفازات طبية (علبة 100)",
      category: "مستهلكات",
      price: 45000,
      stock: 250,
      status: "active",
    },
    {
      id: "p3",
      name: "مادة حشو الأسنان",
      category: "مواد",
      price: 180000,
      stock: 80,
      status: "active",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "o1",
      orderNumber: "ORD-2024-021",
      clinic: "عيادة الرعاية الطبية",
      total: 950000,
      status: "processing",
      date: "2024-01-20",
      items: 5,
    },
    {
      id: "o2",
      orderNumber: "ORD-2024-020",
      clinic: "ابتسامة البصرة",
      total: 1260000,
      status: "delivered",
      date: "2024-01-19",
      items: 8,
    },
    {
      id: "o3",
      orderNumber: "ORD-2024-019",
      clinic: "مركز الابتسامة الذهبية",
      total: 480000,
      status: "pending",
      date: "2024-01-18",
      items: 3,
    },
  ]);

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "of1",
      title: "خصم 20% على المستهلكات",
      discount: 20,
      validUntil: "2024-02-28",
      status: "active",
      applicableProducts: ["p2"],
    },
    {
      id: "of2",
      title: "عرض الأجهزة الطبية",
      discount: 15,
      validUntil: "2024-03-15",
      status: "active",
      applicableProducts: ["p1"],
    },
  ]);

  const [profile, setProfile] = useState<SupplierProfile>({
    companyName: "شركة الإمدادات الطبية المتقدمة",
    contactPerson: "أحمد محمود",
    email: "info@medical-supplies.iq",
    phone: "+964 770 123 4567",
    address: "شارع الكرادة، بناية 15",
    city: "بغداد",
    description: "مورد رئيسي للمعدات والمستلزمات الطبية في العراق",
    businessLicense: "BL-2020-12345",
  });

  const stats = {
    totalProducts: products.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    activeOffers: offers.filter((o) => o.status === "active").length,
    revenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 0),
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: editingProduct?.id || `p${Date.now()}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      status: (formData.get("status") as "active" | "inactive") || "active",
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
    } else {
      setProducts([...products, newProduct]);
    }

    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOffer: Offer = {
      id: editingOffer?.id || `of${Date.now()}`,
      title: formData.get("title") as string,
      discount: Number(formData.get("discount")),
      validUntil: formData.get("validUntil") as string,
      status: (formData.get("status") as "active" | "expired") || "active",
      applicableProducts: [],
    };

    if (editingOffer) {
      setOffers(offers.map((o) => (o.id === editingOffer.id ? newOffer : o)));
    } else {
      setOffers([...offers, newOffer]);
    }

    setOfferDialogOpen(false);
    setEditingOffer(null);
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العرض؟")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setProfile({
      companyName: formData.get("companyName") as string,
      contactPerson: formData.get("contactPerson") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      description: formData.get("description") as string,
      businessLicense: formData.get("businessLicense") as string,
    });
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "قيد المعالجة", className: "bg-blue-100 text-blue-800" },
      shipped: { label: "تم الشحن", className: "bg-purple-100 text-purple-800" },
      delivered: { label: "تم التسليم", className: "bg-green-100 text-green-800" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة تحكم المورد
          </h1>
          <p className="text-gray-600">
            إدارة المنتجات، الطلبات، العروض والملف الشخصي
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-white p-1 h-auto">
            <TabsTrigger value="overview" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">المنتجات</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">الطلبات</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">العروض</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">الملف الشخصي</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي المنتجات
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    منتجات نشطة في المتجر
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    طلبات قيد الانتظار
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    تحتاج إلى معالجة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    العروض النشطة
                  </CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOffers}</div>
                  <p className="text-xs text-muted-foreground">
                    عروض سارية المفعول
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي الإيرادات
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.revenue.toLocaleString("ar-IQ")}
                  </div>
                  <p className="text-xs text-muted-foreground">دينار عراقي</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الطلبات الأخيرة</CardTitle>
                  <CardDescription>آخر الطلبات الواردة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm">{order.orderNumber}</p>
                          <p className="text-xs text-gray-600">{order.clinic}</p>
                        </div>
                        <div className="text-left">
                          {getStatusBadge(order.status)}
                          <p className="text-xs text-gray-600 mt-1">
                            {order.total.toLocaleString("ar-IQ")} IQD
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
                  <CardDescription>أفضل المنتجات أداءً</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">
                            {product.price.toLocaleString("ar-IQ")} IQD
                          </p>
                          <p className="text-xs text-gray-600">
                            متوفر: {product.stock}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
                <p className="text-gray-600">إضافة وتعديل وحذف المنتجات</p>
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة منتج
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المنتج</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead className="text-left">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            {product.price.toLocaleString("ar-IQ")} IQD
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                product.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {product.status === "active" ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-left">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h2>
              <p className="text-gray-600">عرض وتحديث حالة الطلبات</p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم الطلب</TableHead>
                        <TableHead>العيادة</TableHead>
                        <TableHead>عدد المنتجات</TableHead>
                        <TableHead>الإجمالي</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead className="text-left">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>{order.clinic}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>
                            {order.total.toLocaleString("ar-IQ")} IQD
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-left">
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleUpdateOrderStatus(
                                  order.id,
                                  value as Order["status"]
                                )
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">قيد الانتظار</SelectItem>
                                <SelectItem value="processing">
                                  قيد المعالجة
                                </SelectItem>
                                <SelectItem value="shipped">تم الشحن</SelectItem>
                                <SelectItem value="delivered">
                                  تم التسليم
                                </SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة العروض</h2>
                <p className="text-gray-600">إنشاء وتعديل العروض والخصومات</p>
              </div>
              <Button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة عرض
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <Badge
                        className={
                          offer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {offer.status === "active" ? "نشط" : "منتهي"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">نسبة الخصم:</span>
                        <span className="font-bold text-green-600">
                          {offer.discount}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">صالح حتى:</span>
                        <span className="font-medium">{offer.validUntil}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setEditingOffer(offer);
                            setOfferDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 ml-2" />
                          تعديل
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <Trash2 className="w-4 h-4 ml-2 text-red-600" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الملف الشخصي</h2>
              <p className="text-gray-600">تحديث معلومات الشركة والتواصل</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">اسم الشركة</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={profile.companyName}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        defaultValue={profile.contactPerson}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile.email}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={profile.phone}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={profile.city}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessLicense">رقم الرخصة التجارية</Label>
                      <Input
                        id="businessLicense"
                        name="businessLicense"
                        defaultValue={profile.businessLicense}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={profile.address}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">وصف الشركة</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={profile.description}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                      إلغاء
                    </Button>
                    <Button type="submit">حفظ التغييرات</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
            <DialogDescription>
              قم بإدخال تفاصيل المنتج أدناه
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المنتج</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingProduct?.category}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">السعر (IQD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">المخزون</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={editingProduct?.stock}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    name="status"
                    defaultValue={editingProduct?.status || "active"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">صورة المنتج</Label>
                  <div className="flex gap-2">
                    <Input id="image" name="image" type="file" accept="image/*" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}
            </DialogTitle>
            <DialogDescription>
              قم بإدخال تفاصيل العرض والخصم
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveOffer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">عنوان العرض</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingOffer?.title}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">نسبة الخصم (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={editingOffer?.discount}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validUntil">صالح حتى</Label>
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    defaultValue={editingOffer?.validUntil}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status">حالة العرض</Label>
                  <Select
                    name="status"
                    defaultValue={editingOffer?.status || "active"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="expired">منتهي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOfferDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
