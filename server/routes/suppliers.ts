import { Router } from "express";
import { db } from "../storage";
import { suppliers, users, products } from "@shared/schema";
import { eq, count } from "drizzle-orm";

const router = Router();

// In-memory fallback data (temporary while Neon database is unavailable)
const mockSupplierData = {
  id: 1,
  userId: 1,
  companyName: "DentalTech Solutions",
  arabicCompanyName: "شركة حلول الأسنان التقنية",
  email: "info@dentaltech.iq",
  phone: "+964 770 123 4567",
  description: "Leading provider of advanced dental equipment",
  arabicDescription: "شركة رائدة في توفير معدات طب الأسنان المتقدمة",
  logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
  speciality: "معدات طبية متقدمة",
  location: "بغداد، العراق",
  established: 2015,
  verified: true,
  rating: "4.90",
  totalReviews: 234,
  totalProducts: 450,
  totalOrders: 1250,
  website: "www.dentaltech.iq",
  badges: ["trusted", "featured", "syndicate_verified"],
  services: ["توريد المعدات الطبية", "الصيانة والدعم الفني", "التدريب على الأجهزة"],
  certifications: ["ISO 13485", "CE المعتمدة", "FDA معتمدة"],
  responseTime: "خلال ساعة واحدة",
  whatsapp: "+964 770 123 4567",
  productsCount: 450
};

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
    supplierId: 1
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
    supplierId: 1
  }
];

// Get supplier profile by ID
router.get("/api/suppliers/:supplierId", async (req, res) => {
  try {
    const supplierId = parseInt(req.params.supplierId);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    try {
      const supplier = await db
        .select({
          id: suppliers.id,
          userId: suppliers.userId,
          companyName: suppliers.companyName,
          arabicCompanyName: suppliers.arabicCompanyName,
          email: suppliers.email,
          phone: suppliers.phone,
          description: suppliers.description,
          arabicDescription: suppliers.arabicDescription,
          logo: suppliers.logo,
          coverImage: suppliers.coverImage,
          speciality: suppliers.speciality,
          location: suppliers.location,
          established: suppliers.established,
          verified: suppliers.verified,
          rating: suppliers.rating,
          totalReviews: suppliers.totalReviews,
          totalProducts: suppliers.totalProducts,
          totalOrders: suppliers.totalOrders,
          website: suppliers.website,
          badges: suppliers.badges,
          services: suppliers.services,
          certifications: suppliers.certifications,
          responseTime: suppliers.responseTime,
          whatsapp: suppliers.whatsapp,
          userName: users.name,
          userArabicName: users.arabicName,
          userAvatar: users.avatar,
        })
        .from(suppliers)
        .leftJoin(users, eq(suppliers.userId, users.id))
        .where(eq(suppliers.id, supplierId))
        .limit(1);

      if (!supplier || supplier.length === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      // Get actual product count from products table
      const productCount = await db
        .select({ count: count() })
        .from(products)
        .where(eq(products.supplierId, supplierId));

      const supplierData = {
        ...supplier[0],
        productsCount: productCount[0]?.count || supplier[0].totalProducts || 0,
      };

      res.json(supplierData);
    } catch (dbError) {
      // Database error (e.g., Neon endpoint disabled), use fallback
      console.warn("Database unavailable, using mock data:", dbError);
      res.json(mockSupplierData);
    }
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ error: "Failed to fetch supplier data" });
  }
});

// Get supplier products
router.get("/api/suppliers/:supplierId/products", async (req, res) => {
  try {
    const supplierId = parseInt(req.params.supplierId);

    if (isNaN(supplierId)) {
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    try {
      const supplierProducts = await db
        .select()
        .from(products)
        .where(eq(products.supplierId, supplierId));

      res.json(supplierProducts);
    } catch (dbError) {
      // Database error (e.g., Neon endpoint disabled), use fallback
      console.warn("Database unavailable for products, using mock data:", dbError);
      res.json(mockProducts);
    }
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({ error: "Failed to fetch supplier products" });
  }
});

export default router;
