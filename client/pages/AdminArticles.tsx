import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  Heart,
  Calendar,
  User,
  BookOpen,
  ArrowLeft,
  Save,
  X,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// تصدير بيانات المقالات للاستخدام في الإدارة
const articlesData = [
  {
    id: 1,
    title: "أهمية العناية بصحة الأسنان يومياً",
    excerpt: "تعرف على الطرق الصحيحة للعناية بأسنانك وحمايتها من التسوس والأمراض",
    category: "صحة الأسنان",
    author: "د. أحمد الطبيب",
    publishDate: "2024-01-15",
    readTime: "5 دقائق",
    views: 1250,
    likes: 89,
    image: "/placeholder.svg",
    featured: true,
    status: "published",
  },
  {
    id: 2,
    title: "التغذية السليمة وأثرها على الصحة العامة",
    excerpt: "دليل شامل للتغذية الصحية وكيفية اختيار الأطعمة المناسبة لصحة أفضل",
    category: "التغذية",
    author: "د. سارة النصار",
    publishDate: "2024-01-14",
    readTime: "8 دقائق",
    views: 2100,
    likes: 156,
    image: "/placeholder.svg",
    featured: true,
    status: "published",
  },
  {
    id: 3,
    title: "كيفية التعامل مع القلق والتوتر",
    excerpt: "نصائح عملية للتخلص من القلق والتوتر وتحسين الصحة النفسية",
    category: "الصحة النفسية",
    author: "د. محمد الزهراني",
    publishDate: "2024-01-13",
    readTime: "6 دقائق",
    views: 1890,
    likes: 234,
    image: "/placeholder.svg",
    featured: false,
    status: "published",
  },
];

const categories = [
  "صحة الأسنان",
  "التغذية",
  "الصحة النفسية",
  "اللياقة البدنية",
  "أمراض القلب",
  "نمط الحياة",
  "صحة المرأة",
  "الأمراض المزمنة",
  "رعاية المسنين",
  "أ��راض العظام",
  "العلاج الطبيعي",
  "الصحة الإنجابية",
  "الوقاية",
  "الجمال والعناية",
  "إدارة الألم",
  "الصحة المهنية",
];

export default function AdminArticles() {
  const [articles, setArticles] = useState(articlesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    author: "",
    readTime: "",
    featured: false,
    status: "draft",
    content: "",
  });

  // تصفية المقالات
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // فتح نموذج إضافة مقال جديد
  const openAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      excerpt: "",
      category: "",
      author: "",
      readTime: "",
      featured: false,
      status: "draft",
      content: "",
    });
    setIsModalOpen(true);
  };

  // فتح نموذج تعديل مقال
  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      readTime: article.readTime,
      featured: article.featured,
      status: article.status,
      content: article.content || "",
    });
    setIsModalOpen(true);
  };

  // حفظ المقال (إضافة أو تعديل)
  const saveArticle = () => {
    if (editingArticle) {
      // تعديل مقال موجود
      setArticles(articles.map(article => 
        article.id === editingArticle.id 
          ? { ...article, ...formData, publishDate: article.publishDate }
          : article
      ));
    } else {
      // إضافة مقال جديد
      const newArticle = {
        ...formData,
        id: Date.now(),
        publishDate: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        image: "/placeholder.svg",
      };
      setArticles([newArticle, ...articles]);
    }
    setIsModalOpen(false);
  };

  // حذف مقا��
  const deleteArticle = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  // تغيير حالة المقال
  const toggleArticleStatus = (id) => {
    setArticles(articles.map(article => 
      article.id === id 
        ? { ...article, status: article.status === "published" ? "draft" : "published" }
        : article
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-purple-600" />
                إدارة المقالات
              </h1>
            </div>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة مقال جديد
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="الكل">جميع التصنيفات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              المقالات ({filteredArticles.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredArticles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {article.featured && (
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                            مميز
                          </span>
                        )}
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          article.status === "published" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        )}>
                          {article.status === "published" ? "منشور" : "مسودة"}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleArticleStatus(article.id)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        article.status === "published"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      )}
                    >
                      {article.status === "published" ? "إلغاء النشر" : "نشر"}
                    </button>
                    <button
                      onClick={() => openEditModal(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد مقالات
              </h3>
              <p className="text-gray-500">
                جرب تغيير كلمات البحث أو التصنيف المختار
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Article */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingArticle ? "تعديل المقال" : "إضافة مقال جديد"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان المقال
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="أدخل عنوان المقال..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المقدمة
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="أدخل مقدمة المقال..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  محتوى المقال
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="أدخل محتوى المقال الكامل..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الكاتب
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="د. اسم الكاتب"
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    وقت القراءة
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="5 دقائق"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
                  مقال مميز
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveArticle}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingArticle ? "حفظ التعديلات" : "إضافة المقال"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
