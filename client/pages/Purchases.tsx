import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  ShoppingCart,
  Package,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  Star,
  Building,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Purchase {
  id: string;
  orderNumber: string;
  supplier: {
    name: string;
    logo?: string;
    rating: number;
    phone: string;
    email: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image?: string;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  orderDate: Date;
  deliveryDate?: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  paymentMethod: string;
  notes?: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "1",
    orderNumber: "PO-2024-001",
    supplier: {
      name: "شركة المواد الطبية المتقدمة",
      rating: 4.8,
      phone: "+964 771 234 5678",
      email: "sales@advanced-dental.com",
      address: "بغداد، الكرادة، شارع الأطباء",
    },
    items: [
      {
        id: "1",
        name: "مجموعة حشوات مركبة",
        category: "مواد الحشو",
        quantity: 5,
        unitPrice: 45000,
        total: 225000,
      },
      {
        id: "2",
        name: "أدوات جراحة الأسنان المتقدمة",
        category: "أدوات جراحية",
        quantity: 2,
        unitPrice: 120000,
        total: 240000,
      },
    ],
    totalAmount: 465000,
    status: "delivered",
    orderDate: new Date("2024-01-15"),
    deliveryDate: new Date("2024-01-20"),
    trackingNumber: "TRK123456789",
    paymentMethod: "بنكي",
  },
  {
    id: "2",
    orderNumber: "PO-2024-002",
    supplier: {
      name: "مؤسسة الابتسامة ال��هبية",
      rating: 4.5,
      phone: "+964 772 987 6543",
      email: "info@golden-smile.com",
      address: "البصرة، العشار، مجمع الأطباء",
    },
    items: [
      {
        id: "3",
        name: "جهاز تنظيف الأسنان بالموجات فوق الصوتية",
        category: "أجهزة طبية",
        quantity: 1,
        unitPrice: 850000,
        total: 850000,
      },
    ],
    totalAmount: 850000,
    status: "shipped",
    orderDate: new Date("2024-01-18"),
    estimatedDelivery: new Date("2024-01-25"),
    trackingNumber: "TRK987654321",
    paymentMethod: "نقدي عند التسليم",
  },
  {
    id: "3",
    orderNumber: "PO-2024-003",
    supplier: {
      name: "مركز التقنيات الطبية الحديثة",
      rating: 4.9,
      phone: "+964 773 111 2222",
      email: "orders@modern-tech.com",
      address: "أربيل، 60 متر، مجمع زانكو",
    },
    items: [
      {
        id: "4",
        name: "كاميرا أشعة رقمية",
        category: "تصوير طبي",
        quantity: 1,
        unitPrice: 1200000,
        total: 1200000,
      },
      {
        id: "5",
        name: "مواد طباعة الطبعات الرقم��ة",
        category: "مواد طبية",
        quantity: 10,
        unitPrice: 35000,
        total: 350000,
      },
    ],
    totalAmount: 1550000,
    status: "confirmed",
    orderDate: new Date("2024-01-20"),
    estimatedDelivery: new Date("2024-01-28"),
    paymentMethod: "تحويل بنكي",
  },
  {
    id: "4",
    orderNumber: "PO-2024-004",
    supplier: {
      name: "شركة الدلتا للمعدات الطبية",
      rating: 4.6,
      phone: "+964 774 333 4444",
      email: "support@delta-medical.com",
      address: "النجف، المركز، شارع الكوفة",
    },
    items: [
      {
        id: "6",
        name: "كرسي طبيب الأسنان الكهربائي",
        category: "أثاث طبي",
        quantity: 1,
        unitPrice: 2500000,
        total: 2500000,
      },
    ],
    totalAmount: 2500000,
    status: "pending",
    orderDate: new Date("2024-01-22"),
    estimatedDelivery: new Date("2024-02-05"),
    paymentMethod: "دفع آجل",
    notes: "يتطلب تركيب وتدريب",
  },
];

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let filtered = purchases;

    if (searchTerm) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((purchase) => purchase.status === statusFilter);
    }

    setFilteredPurchases(filtered);
  }, [searchTerm, statusFilter, purchases]);

  const getStatusColor = (status: Purchase["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Purchase["status"]) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      delivered: <Package className="w-4 h-4" />,
      cancelled: <AlertCircle className="w-4 h-4" />,
    };
    return icons[status];
  };

  const getStatusText = (status: Purchase["status"]) => {
    const texts = {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      shipped: "في الطريق",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };
    return texts[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalPurchases = () => {
    return filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  };

  const getStatusCounts = () => {
    return {
      total: purchases.length,
      pending: purchases.filter(p => p.status === "pending").length,
      confirmed: purchases.filter(p => p.status === "confirmed").length,
      shipped: purchases.filter(p => p.status === "shipped").length,
      delivered: purchases.filter(p => p.status === "delivered").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            مشتريات متجر الأسنان
          </h1>
          <p className="text-gray-600 mt-1">
            إدارة وتتبع مشترياتك من موردي معدات ومواد طب الأسنان
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مؤكدة</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">في الطريق</p>
              <p className="text-2xl font-bold text-purple-600">{statusCounts.shipped}</p>
            </div>
            <Truck className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مسلمة</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الطلبات، الموردين، أو المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="shipped">في الطريق</option>
              <option value="delivered">تم التسليم</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>إجمالي قيمة المشتريات المعروضة:</span>
            <span className="font-bold text-lg text-blue-600">
              {formatCurrency(getTotalPurchases())}
            </span>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            قائمة المشتريات ({filteredPurchases.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPurchases.map((purchase) => (
            <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {purchase.orderNumber}
                    </h3>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1",
                        getStatusColor(purchase.status)
                      )}
                    >
                      {getStatusIcon(purchase.status)}
                      {getStatusText(purchase.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">المورد:</span>
                      <span className="font-medium">{purchase.supplier.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">تاريخ الطلب:</span>
                      <span className="font-medium">
                        {purchase.orderDate.toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">المجموع:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(purchase.totalAmount)}
                      </span>
                    </div>
                    
                    {purchase.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">رقم التتبع:</span>
                        <span className="font-mono font-medium">{purchase.trackingNumber}</span>
                      </div>
                    )}
                    
                    {purchase.estimatedDelivery && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">التسليم المتوقع:</span>
                        <span className="font-medium">
                          {purchase.estimatedDelivery.toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">عدد الأصناف:</span>
                      <span className="font-medium">{purchase.items.length}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">الأصناف: </span>
                    {purchase.items.map(item => item.name).join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setShowDetails(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="تحميل الفاتورة"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPurchases.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشتريات</h3>
            <p>لم يتم العثور على مشتريات تطابق معايير البحث الحالية</p>
          </div>
        )}
      </div>

      {/* Purchase Details Modal */}
      {showDetails && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل الطلب {selectedPurchase.orderNumber}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Supplier Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  معلومات المورد
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">اسم المورد:</span>
                    <span className="font-medium mr-2">{selectedPurchase.supplier.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">التقييم:</span>
                    <div className="flex items-center gap-1 mr-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedPurchase.supplier.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedPurchase.supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedPurchase.supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-1 md:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedPurchase.supplier.address}</span>
                  </div>
                </div>
              </div>
              
              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  أصناف الطلب
                </h3>
                <div className="space-y-3">
                  {selectedPurchase.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-600">
                            الكمية: <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            سعر الوحدة: <span className="font-medium">{formatCurrency(item.unitPrice)}</span>
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            المجموع: {formatCurrency(item.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>إجمالي قيمة الطلب:</span>
                  <span className="text-blue-600">{formatCurrency(selectedPurchase.totalAmount)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>طريقة الدفع:</span>
                    <span className="font-medium">{selectedPurchase.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              {selectedPurchase.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    ملاحظات
                  </h3>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{selectedPurchase.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
