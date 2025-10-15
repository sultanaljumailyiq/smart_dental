import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image,
  DollarSign,
  Tag,
  BarChart3,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Product, ProductStatus, UserRole } from "@/types/system";
import { productService } from "@/services/dataService";

interface ProductManagementProps {
  userRole: UserRole;
  supplierId?: string;
}

export default function ProductManagement({
  userRole,
  supplierId,
}: ProductManagementProps) {
  const { user, hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load products based on user role
  useEffect(() => {
    loadProducts();
  }, [userRole, supplierId]);

  // Filter products based on search and status
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.arabicName.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, statusFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      let allProducts: Product[] = [];

      if (userRole === UserRole.PLATFORM_ADMIN) {
        // Admin can see all products
        allProducts = productService.getAll();
      } else if (userRole === UserRole.SUPPLIER && supplierId) {
        // Supplier can only see their own products
        allProducts = productService.getBySupplierId(supplierId);
      }

      setProducts(allProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    productId: string,
    newStatus: ProductStatus,
  ) => {
    try {
      const updated = productService.updateStatus(productId, newStatus);
      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updated : p)),
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleBulkStatusChange = async (newStatus: ProductStatus) => {
    try {
      const updatedProducts = productService.bulkUpdate(selectedProducts, {
        status: newStatus,
      });
      setProducts((prev) =>
        prev.map((p) => {
          const updated = updatedProducts.find((up) => up.id === p.id);
          return updated || p;
        }),
      );
      setSelectedProducts([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error("Error bulk updating products:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        const success = productService.delete(productId);
        if (success) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const getStatusColor = (status: ProductStatus) => {
    const colors = {
      [ProductStatus.ACTIVE]: "bg-green-100 text-green-800",
      [ProductStatus.INACTIVE]: "bg-gray-100 text-gray-800",
      [ProductStatus.OUT_OF_STOCK]: "bg-red-100 text-red-800",
      [ProductStatus.PENDING_APPROVAL]: "bg-yellow-100 text-yellow-800",
      [ProductStatus.REJECTED]: "bg-red-100 text-red-800",
      [ProductStatus.DISCONTINUED]: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: ProductStatus) => {
    const labels = {
      [ProductStatus.ACTIVE]: "نشط",
      [ProductStatus.INACTIVE]: "غير نشط",
      [ProductStatus.OUT_OF_STOCK]: "نفذ المخزون",
      [ProductStatus.PENDING_APPROVAL]: "قيد المراجعة",
      [ProductStatus.REJECTED]: "مرفوض",
      [ProductStatus.DISCONTINUED]: "متوقف",
    };
    return labels[status] || status;
  };

  const analytics = {
    total: products.length,
    active: products.filter((p) => p.status === ProductStatus.ACTIVE).length,
    pending: products.filter((p) => p.status === ProductStatus.PENDING_APPROVAL)
      .length,
    outOfStock: products.filter((p) => p.status === ProductStatus.OUT_OF_STOCK)
      .length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                إدارة المنتجات
              </h1>
              <p className="text-gray-600 mt-1">
                {userRole === UserRole.SUPPLIER
                  ? "إدارة منتجاتك"
                  : "إدارة جميع المنتجات في المنصة"}
              </p>
            </div>

            {hasPermission("products", "create") && (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  تصدير
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  استيراد
                </button>
                <Link
                  to="/admin/products/new"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  منتج جديد
                </Link>
              </div>
            )}
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    إجمالي ال��نتجات
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    المنتجات النشطة
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    قيد المراجعة
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {analytics.pending}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    نفذ المخزون
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {analytics.outOfStock}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ProductStatus | "all")
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value={ProductStatus.ACTIVE}>نشط</option>
              <option value={ProductStatus.INACTIVE}>غير نشط</option>
              <option value={ProductStatus.PENDING_APPROVAL}>
                قيد المراجعة
              </option>
              <option value={ProductStatus.OUT_OF_STOCK}>نفذ المخزون</option>
              <option value={ProductStatus.REJECTED}>مرفوض</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              فلاتر متقدمة
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  تم اختيار {selectedProducts.length} منتج
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkStatusChange(ProductStatus.ACTIVE)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    تفعيل
                  </button>
                  <button
                    onClick={() =>
                      handleBulkStatusChange(ProductStatus.INACTIVE)
                    }
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    إلغاء تفعيل
                  </button>
                  <button
                    onClick={() => setSelectedProducts([])}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    إلغاء التحديد
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(
                            filteredProducts.map((p) => p.id),
                          );
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المخزون
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts((prev) => [
                              ...prev,
                              product.id,
                            ]);
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((id) => id !== product.id),
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.arabicName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.arabicName}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category.arabicName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.brand.arabicName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(
                          product.pricing.salePrice || product.pricing.basePrice
                        ).toLocaleString()}{" "}
                        د.ع
                      </div>
                      {product.pricing.salePrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {product.pricing.basePrice.toLocaleString()} د.ع
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.inventory.availableQuantity}
                      </div>
                      {product.inventory.availableQuantity <=
                        product.inventory.lowStockThreshold && (
                        <div className="text-xs text-red-600">مخزون منخفض</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getStatusColor(product.status),
                        )}
                      >
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dental-supply/product/${product.id}`}
                          className="text-gray-600 hover:text-blue-600 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {hasPermission("products", "update") && (
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-gray-600 hover:text-purple-600 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                        {hasPermission("products", "delete") && (
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-gray-600 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="relative">
                          <button className="text-gray-600 hover:text-gray-800 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد منتجات
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "لا توجد منتجات تطابق معايير البحث"
                  : "لم تقم بإضافة أي منتجات بعد"}
              </p>
              {hasPermission("products", "create") &&
                !searchQuery &&
                statusFilter === "all" && (
                  <Link
                    to="/admin/products/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة منتج جديد
                  </Link>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
