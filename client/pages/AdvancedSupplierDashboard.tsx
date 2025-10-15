import React, { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Star,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  Tag,
  Percent,
  Gift,
  Zap,
  Target,
  Award,
  Activity,
  Map,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/Breadcrumbs";
import { ProgressBar, ButtonLoading } from "@/components/LoadingIndicators";

interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  price: number;
  cost: number;
  margin: number;
  lastUpdated: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "reorder_needed";
  image: string;
  supplier: string;
  location: string;
  expiryDate?: string;
  batchNumber?: string;
}

interface Sale {
  id: string;
  orderNumber: string;
  customer: string;
  customerType: "dentist" | "clinic" | "hospital";
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  date: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: string;
  notes?: string;
}

interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Promotion {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "buy_x_get_y" | "free_shipping";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  currentUsage: number;
  status: "active" | "paused" | "expired";
  description: string;
}

interface Customer {
  id: string;
  name: string;
  type: "dentist" | "clinic" | "hospital";
  email: string;
  phone: string;
  city: string;
  registrationDate: string;
  lastOrder?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  status: "active" | "inactive";
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum";
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "مادة التخدير الموضعي - يدوكائين 2%",
    brand: "Septodont",
    category: "أدوية التخدير",
    sku: "ANE-LID-001",
    currentStock: 15,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 25,
    price: 15000,
    cost: 10000,
    margin: 50,
    lastUpdated: "2024-01-15",
    status: "low_stock",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=300",
    supplier: "Septodont France",
    location: "مخزن A - رقم 15",
    expiryDate: "2025-06-30",
    batchNumber: "LOT-2024-001",
  },
  {
    id: "2",
    name: "حشوة الكومبوزيت الضوئية",
    brand: "3M ESPE",
    category: "مواد الحشو",
    sku: "FIL-COM-002",
    currentStock: 35,
    minStock: 15,
    maxStock: 80,
    reorderPoint: 20,
    price: 85000,
    cost: 60000,
    margin: 41.7,
    lastUpdated: "2024-01-14",
    status: "in_stock",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300",
    supplier: "3M Company",
    location: "مخزن B - رقم 8",
    expiryDate: "2026-12-31",
    batchNumber: "LOT-2024-002",
  },
];

const mockSales: Sale[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001234",
    customer: "د. أحمد محمد علي",
    customerType: "dentist",
    items: [
      {
        productId: "1",
        name: "مادة التخدير الموضعي",
        quantity: 2,
        price: 15000,
        total: 30000,
      },
      {
        productId: "2",
        name: "حشوة الكومبوزيت",
        quantity: 1,
        price: 85000,
        total: 85000,
      },
    ],
    subtotal: 115000,
    discount: 5000,
    tax: 0,
    total: 110000,
    status: "confirmed",
    date: "2024-01-15",
    paymentMethod: "الدفع عند الاستلام",
    paymentStatus: "pending",
    shippingAddress: "بغداد، الكرخ، حي الجامعة",
  },
];

const mockPromotions: Promotion[] = [
  {
    id: "1",
    name: "خصم 20% على منتجات التخدير",
    type: "percentage",
    value: 20,
    minOrder: 100000,
    maxDiscount: 50000,
    applicableProducts: ["1"],
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    usageLimit: 100,
    currentUsage: 25,
    status: "active",
    description: "خصم 20% على جميع منتجات التخدير للطلبات أكثر من 100,000 د.ع",
  },
];

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "د. أحمد محمد علي",
    type: "dentist",
    email: "ahmed.mohammed@email.com",
    phone: "+964 770 123 4567",
    city: "بغداد",
    registrationDate: "2023-06-15",
    lastOrder: "2024-01-15",
    totalOrders: 25,
    totalSpent: 2750000,
    averageOrderValue: 110000,
    status: "active",
    loyaltyTier: "gold",
  },
];

export default function AdvancedSupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const lowStockItems = inventory.filter(
    (item) => item.status === "low_stock" || item.status === "out_of_stock",
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-IQ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-700 border-green-200";
      case "low_stock":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "out_of_stock":
        return "bg-red-100 text-red-700 border-red-200";
      case "reorder_needed":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case "in_stock":
        return "متوفر";
      case "low_stock":
        return "مخزون منخفض";
      case "out_of_stock":
        return "نفد المخزون";
      case "reorder_needed":
        return "يحتاج إعادة طلب";
      default:
        return status;
    }
  };

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-700";
      case "silver":
        return "bg-gray-100 text-gray-700";
      case "gold":
        return "bg-yellow-100 text-yellow-700";
      case "platinum":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateStock = (itemId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          let status: InventoryItem["status"] = "in_stock";
          if (newStock === 0) status = "out_of_stock";
          else if (newStock <= item.minStock) status = "low_stock";
          else if (newStock <= item.reorderPoint) status = "reorder_needed";

          return {
            ...item,
            currentStock: newStock,
            status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      }),
    );
  };

  const createPromotion = () => {
    // Open promotion creation modal
  };

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: BarChart3 },
    { id: "inventory", label: "إدارة المخزون", icon: Package },
    { id: "sales", label: "المبيعات", icon: ShoppingCart },
    { id: "promotions", label: "العروض والخصو��ات", icon: Tag },
    { id: "customers", label: "إدارة العملاء", icon: Users },
    { id: "analytics", label: "التحليلات", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="لوحة إدارة الموردين المتطورة"
        description="إدارة شاملة للمخزون والمبيعات والعملاء مع تحليلات متقدمة"
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              تصدير التقرير
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              منتج جديد
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط قيمة الطلب</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(averageOrderValue)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">-2.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تنبيهات المخزون</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">يحتاج اهتمام</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-4 border-b-2 font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700",
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Plus className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    إضافة منتج
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <Tag className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    إنشاء عرض
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    تقارير المبيعات
                  </span>
                </button>
                <button className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <Bell className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    إدارة التنبيهات
                  </span>
                </button>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    الطلبات الأخيرة
                  </h3>
                  <div className="space-y-3">
                    {sales.slice(0, 5).map((sale) => (
                      <div
                        key={sale.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {sale.orderNumber}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {sale.customer}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-purple-600">
                            {formatCurrency(sale.total)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(sale.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    تنبيهات المخزون
                  </h3>
                  <div className="space-y-3">
                    {inventory
                      .filter(
                        (item) =>
                          item.status === "low_stock" ||
                          item.status === "out_of_stock",
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-red-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-red-600">
                                المخزون: {item.currentStock}
                              </p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                            إعادة طلب
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="البحث في المخزون..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">جميع المنتجات</option>
                    <option value="in_stock">متوفر</option>
                    <option value="low_stock">مخزون منخفض</option>
                    <option value="out_of_stock">نفد المخزون</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload className="w-4 h-4" />
                    استيراد
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    إضافة منتج
                  </button>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-right p-4 font-medium text-gray-900">
                          المنتج
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          SKU
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          المخزون الحالي
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          الحد الأدنى
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          السعر
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          الهامش
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          الحالة
                        </th>
                        <th className="text-right p-4 font-medium text-gray-900">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {item.brand}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{item.sku}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {item.currentStock}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    updateStock(item.id, item.currentStock - 1)
                                  }
                                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateStock(item.id, item.currentStock + 1)
                                  }
                                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{item.minStock}</td>
                          <td className="p-4 font-medium">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="p-4">
                            <span className="text-green-600 font-medium">
                              {item.margin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs border",
                                getStockStatusColor(item.status),
                              )}
                            >
                              {getStockStatusText(item.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "promotions" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  إدارة العروض والخصومات
                </h3>
                <button
                  onClick={createPromotion}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إنشاء عرض جديد
                </button>
              </div>

              {/* Promotions Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {promo.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {promo.description}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          promo.status === "active"
                            ? "bg-green-100 text-green-700"
                            : promo.status === "paused"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {promo.status === "active" && "نشط"}
                        {promo.status === "paused" && "متوقف"}
                        {promo.status === "expired" && "منتهي الصلاحية"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">نوع الخصم</p>
                        <p className="font-medium">
                          {promo.type === "percentage" && `${promo.value}%`}
                          {promo.type === "fixed" &&
                            formatCurrency(promo.value)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          الحد الأدنى للطلب
                        </p>
                        <p className="font-medium">
                          {promo.minOrder
                            ? formatCurrency(promo.minOrder)
                            : "لا يوجد"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                        <p className="font-medium">
                          {formatDate(promo.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">الاستخدام</p>
                        <p className="font-medium">
                          {promo.currentUsage}/{promo.usageLimit || "∞"}
                        </p>
                      </div>
                    </div>

                    {promo.usageLimit && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>معدل الاستخدام</span>
                          <span>
                            {Math.round(
                              (promo.currentUsage / promo.usageLimit) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <ProgressBar
                          progress={
                            (promo.currentUsage / promo.usageLimit) * 100
                          }
                          color="blue"
                          showPercentage={false}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        تعديل
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        {promo.status === "active" ? "إيقاف" : "تفعيل"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-6">
              {/* Customer List */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">قاعدة العملاء</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <div key={customer.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {customer.name}
                              </h4>
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  getLoyaltyTierColor(customer.loyaltyTier),
                                )}
                              >
                                {customer.loyaltyTier}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                <span>
                                  {customer.type === "dentist"
                                    ? "طبيب أسنان"
                                    : customer.type === "clinic"
                                      ? "عيادة"
                                      : "مستشفى"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{customer.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Map className="w-3 h-3" />
                                <span>{customer.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-left">
                          <div className="font-bold text-lg text-purple-600 mb-1">
                            {formatCurrency(customer.totalSpent)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {customer.totalOrders} طلب
                          </div>
                          <div className="text-sm text-gray-600">
                            متوسط: {formatCurrency(customer.averageOrderValue)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            انضم: {formatDate(customer.registrationDate)}
                          </span>
                          {customer.lastOrder && (
                            <span>
                              آخر طلب: {formatDate(customer.lastOrder)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                            عرض الملف
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                            إرسال عرض
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
