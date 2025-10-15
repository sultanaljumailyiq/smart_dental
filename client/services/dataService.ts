// خدمات إدارة البيانات المتقدمة
// Advanced Data Management Services

import {
  Product,
  Order,
  User,
  UserStatus,
  Category,
  Brand,
  Supplier,
  Tag,
  Offer,
  SearchFilters,
  SearchResult,
  OrderStatus,
  ProductStatus,
  UserRole,
} from "@/types/system";

// ============= Base Data Service =============

class BaseDataService<T> {
  protected data: T[] = [];
  protected storageKey: string;

  constructor(storageKey: string, initialData: T[] = []) {
    this.storageKey = storageKey;
    this.loadFromStorage();
    if (this.data.length === 0 && initialData.length > 0) {
      this.data = initialData;
      this.saveToStorage();
    }
  }

  protected loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Error loading ${this.storageKey}:`, error);
      this.data = [];
    }
  }

  protected saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error(`Error saving ${this.storageKey}:`, error);
    }
  }

  getAll(): T[] {
    return [...this.data];
  }

  getById(id: string): T | undefined {
    return this.data.find((item: any) => item.id === id);
  }

  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.data.push(newItem);
    this.saveToStorage();
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.data.findIndex((item: any) => item.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.data[index] = updated;
    this.saveToStorage();
    return updated;
  }

  delete(id: string): boolean {
    const index = this.data.findIndex((item: any) => item.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  count(): number {
    return this.data.length;
  }

  protected generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// ============= Product Service =============

class ProductService extends BaseDataService<Product> {
  constructor() {
    super("products", []);
  }

  // Advanced product search with filters
  search(filters: SearchFilters): SearchResult {
    let filteredProducts = [...this.data];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.arabicName.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.arabicDescription.toLowerCase().includes(query) ||
          product.tags.some(
            (tag) =>
              tag.name.toLowerCase().includes(query) ||
              tag.arabicName.toLowerCase().includes(query),
          ),
      );
    }

    // Category filter
    if (filters.categoryIds?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.categoryIds!.includes(product.category.id),
      );
    }

    // Brand filter
    if (filters.brandIds?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.brandIds!.includes(product.brand.id),
      );
    }

    // Supplier filter
    if (filters.supplierIds?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.supplierIds!.includes(product.supplier.id),
      );
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.pricing.salePrice || product.pricing.basePrice;
        return (
          (filters.minPrice === undefined || price >= filters.minPrice) &&
          (filters.maxPrice === undefined || price <= filters.maxPrice)
        );
      });
    }

    // Stock filter
    if (filters.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.inStock
          ? product.inventory.availableQuantity > 0
          : product.inventory.availableQuantity === 0,
      );
    }

    // Discount filter
    if (filters.hasDiscount) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.pricing.salePrice &&
          product.pricing.salePrice < product.pricing.basePrice,
      );
    }

    // Rating filter
    if (filters.rating !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.rating >= filters.rating!,
      );
    }

    // Badges filter
    if (filters.badges?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        product.badges.some((badge) => filters.badges!.includes(badge.type)),
      );
    }

    // Sort products
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case "price_low":
            return (
              (a.pricing.salePrice || a.pricing.basePrice) -
              (b.pricing.salePrice || b.pricing.basePrice)
            );
          case "price_high":
            return (
              (b.pricing.salePrice || b.pricing.basePrice) -
              (a.pricing.salePrice || a.pricing.basePrice)
            );
          case "rating":
            return b.rating - a.rating;
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "popularity":
            return b.analytics.views - a.analytics.views;
          default:
            return 0;
        }
      });
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Generate aggregations
    const aggregations = this.generateAggregations(filteredProducts);

    return {
      products: paginatedProducts,
      totalCount: filteredProducts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNextPage: endIndex < filteredProducts.length,
      hasPreviousPage: page > 1,
      aggregations,
      searchTime: Date.now(), // Mock search time
      suggestions: this.generateSuggestions(filters.query || ""),
    };
  }

  private generateAggregations(products: Product[]) {
    // Generate category aggregations
    const categoryMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const brandMap = new Map<
      string,
      { id: string; name: string; count: number }
    >();
    const priceRanges = [
      { min: 0, max: 100000, count: 0 },
      { min: 100000, max: 500000, count: 0 },
      { min: 500000, max: 1000000, count: 0 },
      { min: 1000000, max: Infinity, count: 0 },
    ];
    const ratingMap = new Map<number, number>();

    products.forEach((product) => {
      // Category aggregation
      const categoryKey = product.category.id;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          id: product.category.id,
          name: product.category.arabicName,
          count: 0,
        });
      }
      categoryMap.get(categoryKey)!.count++;

      // Brand aggregation
      const brandKey = product.brand.id;
      if (!brandMap.has(brandKey)) {
        brandMap.set(brandKey, {
          id: product.brand.id,
          name: product.brand.arabicName,
          count: 0,
        });
      }
      brandMap.get(brandKey)!.count++;

      // Price range aggregation
      const price = product.pricing.salePrice || product.pricing.basePrice;
      priceRanges.forEach((range) => {
        if (price >= range.min && price < range.max) {
          range.count++;
        }
      });

      // Rating aggregation
      const rating = Math.floor(product.rating);
      ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
    });

    return {
      categories: Array.from(categoryMap.values()).sort(
        (a, b) => b.count - a.count,
      ),
      brands: Array.from(brandMap.values()).sort((a, b) => b.count - a.count),
      priceRanges: priceRanges.filter((range) => range.count > 0),
      ratings: Array.from(ratingMap.entries())
        .map(([rating, count]) => ({ rating, count }))
        .sort((a, b) => b.rating - a.rating),
    };
  }

  private generateSuggestions(query: string): string[] {
    if (!query || query.length < 2) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    this.data.forEach((product) => {
      // Check product names
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.add(product.name);
      }
      if (product.arabicName.toLowerCase().includes(queryLower)) {
        suggestions.add(product.arabicName);
      }

      // Check tags
      product.tags.forEach((tag) => {
        if (tag.name.toLowerCase().includes(queryLower)) {
          suggestions.add(tag.name);
        }
        if (tag.arabicName.toLowerCase().includes(queryLower)) {
          suggestions.add(tag.arabicName);
        }
      });
    });

    return Array.from(suggestions).slice(0, 10);
  }

  // Get products by category
  getByCategory(categoryId: string): Product[] {
    return this.data.filter((product) => product.category.id === categoryId);
  }

  // Get products by supplier
  getBySupplierId(supplierId: string): Product[] {
    return this.data.filter((product) => product.supplier.id === supplierId);
  }

  // Get products by brand
  getByBrand(brandId: string): Product[] {
    return this.data.filter((product) => product.brand.id === brandId);
  }

  // Get featured products
  getFeatured(): Product[] {
    return this.data.filter(
      (product) =>
        product.badges.some((badge) => badge.type === "featured") ||
        product.visibility === "featured",
    );
  }

  // Get new products
  getNew(): Product[] {
    return this.data.filter((product) =>
      product.badges.some((badge) => badge.type === "new"),
    );
  }

  // Get discounted products
  getDiscounted(): Product[] {
    return this.data.filter(
      (product) =>
        product.pricing.salePrice &&
        product.pricing.salePrice < product.pricing.basePrice,
    );
  }

  // Get related products
  getRelated(productId: string, limit: number = 4): Product[] {
    const product = this.getById(productId);
    if (!product) return [];

    return this.data
      .filter(
        (p) =>
          p.id !== productId &&
          (p.category.id === product.category.id ||
            p.brand.id === product.brand.id),
      )
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, limit);
  }

  // Update product status
  updateStatus(productId: string, status: ProductStatus): Product | undefined {
    return this.update(productId, { status });
  }

  // Bulk update products
  bulkUpdate(productIds: string[], updates: Partial<Product>): Product[] {
    const updatedProducts: Product[] = [];
    productIds.forEach((id) => {
      const updated = this.update(id, updates);
      if (updated) updatedProducts.push(updated);
    });
    return updatedProducts;
  }
}

// ============= Order Service =============

class OrderService extends BaseDataService<Order> {
  constructor() {
    super("orders", []);
  }

  // Get orders by customer
  getByCustomerId(customerId: string): Order[] {
    return this.data.filter((order) => order.customer.id === customerId);
  }

  // Get orders by supplier
  getBySupplierId(supplierId: string): Order[] {
    return this.data.filter((order) =>
      order.items.some((item) => item.supplierId === supplierId),
    );
  }

  // Get orders by status
  getByStatus(status: OrderStatus): Order[] {
    return this.data.filter((order) => order.status === status);
  }

  // Update order status
  updateStatus(
    orderId: string,
    status: OrderStatus,
    note?: string,
  ): Order | undefined {
    const order = this.getById(orderId);
    if (!order) return undefined;

    // Add timeline event
    const event = {
      id: this.generateId(),
      type: "status_change" as const,
      title: `Order ${status}`,
      arabicTitle: `الطلب ${this.getStatusInArabic(status)}`,
      description: note,
      data: { previousStatus: order.status, newStatus: status },
      isPublic: true,
      createdAt: new Date(),
    };

    const updatedTimeline = [...order.timeline, event];

    return this.update(orderId, {
      status,
      timeline: updatedTimeline,
      updatedAt: new Date(),
    });
  }

  private getStatusInArabic(status: OrderStatus): string {
    const statusMap = {
      [OrderStatus.PENDING]: "قيد الانتظار",
      [OrderStatus.CONFIRMED]: "مؤكد",
      [OrderStatus.PROCESSING]: "قيد المعالجة",
      [OrderStatus.SHIPPED]: "تم الشحن",
      [OrderStatus.DELIVERED]: "تم التسليم",
      [OrderStatus.CANCELLED]: "ملغي",
      [OrderStatus.REFUNDED]: "مسترد",
      [OrderStatus.RETURNED]: "مرتجع",
      [OrderStatus.FAILED]: "فاشل",
    };
    return statusMap[status] || status;
  }

  // Calculate order analytics
  getAnalytics(supplierId?: string) {
    let orders = this.data;
    if (supplierId) {
      orders = this.getBySupplierId(supplierId);
    }

    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === OrderStatus.DELIVERED,
    ).length;
    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
      conversionRate:
        totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }
}

// ============= User Service =============

class UserService extends BaseDataService<User> {
  constructor() {
    super("users", []);
  }

  // Get users by role
  getByRole(role: UserRole): User[] {
    return this.data.filter((user) => user.role === role);
  }

  // Get suppliers
  getSuppliers(): User[] {
    return this.getByRole(UserRole.SUPPLIER);
  }

  // Get customers
  getCustomers(): User[] {
    return this.getByRole(UserRole.CUSTOMER);
  }

  // Verify supplier
  verifySupplier(userId: string): User | undefined {
    return this.update(userId, {
      status: UserStatus.ACTIVE,
      updatedAt: new Date(),
    });
  }

  // Get user analytics
  getAnalytics() {
    const totalUsers = this.data.length;
    const activeUsers = this.data.filter(
      (user) => user.status === "active",
    ).length;
    const suppliers = this.getSuppliers().length;
    const customers = this.getCustomers().length;

    return {
      totalUsers,
      activeUsers,
      suppliers,
      customers,
      activeSuppliers: this.data.filter(
        (user) => user.role === UserRole.SUPPLIER && user.status === "active",
      ).length,
    };
  }
}

// ============= Category Service =============

class CategoryService extends BaseDataService<Category> {
  constructor() {
    super("categories", []);
  }

  // Get root categories (top level)
  getRootCategories(): Category[] {
    return this.data.filter((category) => !category.parentId);
  }

  // Get category hierarchy
  getCategoryHierarchy(): Category[] {
    const rootCategories = this.getRootCategories();
    return rootCategories.map((category) => ({
      ...category,
      children: this.getChildren(category.id),
    }));
  }

  // Get children of a category
  getChildren(parentId: string): Category[] {
    return this.data.filter((category) => category.parentId === parentId);
  }

  // Get category path (breadcrumb)
  getCategoryPath(categoryId: string): Category[] {
    const path: Category[] = [];
    let currentCategory = this.getById(categoryId);

    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId
        ? this.getById(currentCategory.parentId)
        : undefined;
    }

    return path;
  }
}

// ============= Export Services =============

export const productService = new ProductService();
export const orderService = new OrderService();
export const userService = new UserService();
export const categoryService = new CategoryService();

// Initialize with sample data if empty
if (productService.count() === 0) {
  // Add sample products
  // This will be populated from your existing dentalProducts data
}

if (categoryService.count() === 0) {
  // Add sample categories
  // This will be populated from your existing categories data
}
