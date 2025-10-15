import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Box,
  Image as ImageIcon,
  Upload,
  Save,
  X,
  Star,
  Copy,
  Archive,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SupplierHeader from "@/components/supplier/SupplierHeader";

interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: "active" | "inactive" | "out_of_stock";
  image?: string;
  description: string;
  sku: string;
  trending: "up" | "down" | "stable";
  featured: boolean;
  rating: number;
  reviews: number;
}

export default function SupplierProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "مادة حشو الأسنان - Composite",
      nameEn: "Dental Filling Material - Composite",
      category: "materials",
      price: 85000,
      stock: 28,
      sold: 45,
      status: "active",
      description: "مادة حشو عالية الجودة للأسنان الأمامية والخلفية",
      sku: "DFM-001",
      trending: "up",
      featured: true,
      rating: 4.8,
      reviews: 23,
    },
    {
      id: "2",
      name: "قفازات طبية (علبة 100)",
      nameEn: "Medical Gloves (Box of 100)",
      category: "supplies",
      price: 45000,
      stock: 5,
      sold: 120,
      status: "active",
      description: "قفازات طبية معقمة للاستخدام الطبي",
      sku: "GLV-100",
      trending: "up",
      featured: false,
      rating: 4.5,
      reviews: 56,
    },
    {
      id: "3",
      name: "كمامات N95 (علبة 50)",
      nameEn: "N95 Masks (Box of 50)",
      category: "supplies",
      price: 125000,
      stock: 0,
      sold: 67,
      status: "out_of_stock",
      description: "كمامات N95 عالية الحماية",
      sku: "MSK-N95",
      trending: "down",
      featured: false,
      rating: 4.7,
      reviews: 34,
    },
    {
      id: "4",
      name: "جهاز تعقيم الأدوات",
      nameEn: "Autoclave Sterilizer",
      category: "equipment",
      price: 1850000,
      stock: 3,
      sold: 8,
      status: "active",
      description: "جهاز تعقيم أدوات طبية بالبخار",
      sku: "AUT-2024",
      trending: "stable",
      featured: true,
      rating: 4.9,
      reviews: 12,
    },
    {
      id: "5",
      name: "مخدر موضعي",
      nameEn: "Local Anesthetic",
      category: "medications",
      price: 35000,
      stock: 45,
      sold: 89,
      status: "active",
      description: "مخدر موضعي للإجراءات السنية",
      sku: "ANS-LOCAL",
      trending: "up",
      featured: false,
      rating: 4.6,
      reviews: 45,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    nameEn: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
  });

  const categories = [
    { value: "materials", label: "مواد طبية" },
    { value: "supplies", label: "مستلزمات" },
    { value: "equipment", label: "أجهزة" },
    { value: "medications", label: "أدوية" },
    { value: "tools", label: "أدوات" },
  ];

  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    out_of_stock: "bg-red-500",
  };

  const statusLabels = {
    active: "نشط",
    inactive: "غير نشط",
    out_of_stock: "نفذت الكمية",
  };

  const filteredProducts = products.filter((product) => {
    if (filterStatus !== "all" && product.status !== filterStatus) return false;
    if (filterCategory !== "all" && product.category !== filterCategory)
      return false;
    if (searchQuery) {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      nameEn: newProduct.nameEn,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      sold: 0,
      status: "active",
      description: newProduct.description,
      sku: newProduct.sku,
      trending: "stable",
      featured: false,
      rating: 0,
      reviews: 0,
    };
    setProducts([...products, product]);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      nameEn: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      sku: "",
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    outOfStock: products.filter((p) => p.status === "out_of_stock").length,
    featured: products.filter((p) => p.featured).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <SupplierHeader />
      
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                المنتجات
              </h1>
              <p className="text-gray-600">
                إدارة قائمة المنتجات والمخزون
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة منتج جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل المنتج الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>اسم المنتج (عربي)</Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        placeholder="مثال: قفازات طبية"
                      />
                    </div>
                    <div>
                      <Label>اسم المنتج (إنجليزي)</Label>
                      <Input
                        value={newProduct.nameEn}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            nameEn: e.target.value,
                          })
                        }
                        placeholder="Example: Medical Gloves"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الفئة</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>رمز المنتج (SKU)</Label>
                      <Input
                        value={newProduct.sku}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, sku: e.target.value })
                        }
                        placeholder="مثال: GLV-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>السعر (دينار)</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        placeholder="مثال: 45000"
                      />
                    </div>
                    <div>
                      <Label>الكمية المتوفرة</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                        placeholder="مثال: 100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="وصف تفصيلي للمنتج"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddProduct}>
                      <Save className="w-4 h-4 ml-2" />
                      حفظ المنتج
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-r-4 border-r-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">منتجات نشطة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.active}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">نفذت الكمية</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.outOfStock}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-4 border-r-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">منتجات مميزة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.featured}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="حالة المنتج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="out_of_stock">نفذت الكمية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-400" />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.nameEn}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 ml-2" />
                          أرشفة
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{product.sku}</Badge>
                    <Badge
                      className={cn("text-white", statusColors[product.status])}
                    >
                      {statusLabels[product.status]}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString()}
                        <span className="text-sm text-gray-500 mr-1">د.ع</span>
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600">المخزون</p>
                      <p
                        className={cn(
                          "font-semibold",
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-orange-600"
                            : "text-red-600"
                        )}
                      >
                        {product.stock} قطعة
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{product.rating}</span>
                      <span>({product.reviews} تقييم)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {product.trending === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : product.trending === "down" ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span>بيع {product.sold}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="w-4 h-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد منتجات
              </h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على منتجات تطابق البحث أو الفلاتر
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة منتج جديد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
