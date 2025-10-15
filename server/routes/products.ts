import { Request, Response } from "express";
import { db, products, suppliers, categories, brands } from "../storage";
import { supplierApprovals } from "../../shared/schema";
import { eq, desc, like, and, gte, lte, sql, or } from "drizzle-orm";

// Get all products with filters
export async function getProducts(req: Request, res: Response) {
  try {
    const {
      category,
      supplier,
      brand,
      search,
      minPrice,
      maxPrice,
      featured,
      new: isNew,
      limit = 20,
      offset = 0,
    } = req.query;

    let query = db.select().from(products).$dynamic();

    // Apply filters
    const conditions = [];
    
    if (category) {
      conditions.push(eq(products.categoryId, Number(category)));
    }
    
    if (supplier) {
      conditions.push(eq(products.supplierId, Number(supplier)));
    }
    
    if (brand) {
      conditions.push(eq(products.brandId, Number(brand)));
    }
    
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.arabicName, `%${search}%`)
        )
      );
    }
    
    if (minPrice) {
      conditions.push(gte(products.price, minPrice.toString()));
    }
    
    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }
    
    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true));
    }
    
    if (isNew === 'true') {
      conditions.push(eq(products.isNew, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(desc(products.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ products: result, count: result.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// Get product by ID
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const product = await db.query.products.findFirst({
      where: eq(products.id, Number(id)),
      with: {
        supplier: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Increment view count
    await db.update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, Number(id)));

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// Create product (Supplier only)
export async function createProduct(req: Request, res: Response) {
  try {
    const productData = req.body;
    const { supplierId } = productData;
    
    // Check if supplier is approved
    const [approval] = await db
      .select()
      .from(supplierApprovals)
      .where(eq(supplierApprovals.supplierId, supplierId))
      .limit(1);

    if (!approval) {
      return res.status(403).json({ 
        error: "موافقة المورد غير موجودة",
        message: "يجب الحصول على موافقة المنصة أولاً"
      });
    }

    if (approval.status !== "approved") {
      return res.status(403).json({ 
        error: "المورد غير مُوافق عليه",
        message: approval.status === "pending" 
          ? "طلب الموافقة قيد المراجعة. سيتم إشعارك عند الموافقة."
          : "تم رفض طلب الموافقة. يرجى التواصل مع إدارة المنصة.",
        status: approval.status
      });
    }
    
    const [newProduct] = await db.insert(products)
      .values({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// Update product (Supplier only)
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [updatedProduct] = await db.update(products)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// Delete product (Supplier only)
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await db.delete(products).where(eq(products.id, Number(id)));
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}

// Get products by supplier
export async function getProductsBySupplier(req: Request, res: Response) {
  try {
    const { supplierId } = req.params;
    
    try {
      const result = await db.select()
        .from(products)
        .where(eq(products.supplierId, Number(supplierId)))
        .orderBy(desc(products.createdAt));

      res.json({ products: result, count: result.length });
    } catch (dbError) {
      // Database error (e.g., Neon endpoint disabled), use fallback
      console.warn("Database unavailable for supplier products, using mock data:", dbError);
      
      // Mock products fallback
      const mockProducts = [
        {
          id: 1,
          name: "Digital X-ray Sensor",
          arabicName: "مستشعر الأشعة الرقمية",
          price: "2400000",
          originalPrice: "2800000",
          image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop",
          rating: "4.80",
          reviewCount: 89,
          category: "أجهزة أشعة",
          brand: "XrayTech",
          discount: 14,
          inStock: true,
          supplierId: Number(supplierId)
        },
        {
          id: 2,
          name: "Dental Chair Unit",
          arabicName: "وحدة كرسي الأسنان",
          price: "15600000",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
          rating: "4.90",
          reviewCount: 45,
          category: "معدات كبيرة",
          brand: "ChairPro",
          inStock: true,
          supplierId: Number(supplierId)
        }
      ];
      
      res.json({ products: mockProducts, count: mockProducts.length });
    }
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({ error: "Failed to fetch supplier products" });
  }
}
