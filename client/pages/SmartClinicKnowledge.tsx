import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Filter, Globe, FileText, Image, Video, Users, Calendar, Eye, Heart, Share2, Edit, Trash2, MoreHorizontal, Clock, CheckCircle, AlertCircle, Bookmark, Tag, Settings, Upload, Link as LinkIcon, Rss, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
interface KnowledgeItem {
  id: string;
  type: "article" | "video" | "image" | "document" | "external";
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  source: "internal" | "rss" | "api" | "manual";
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  shares: number;
  featured: boolean;
  thumbnailUrl?: string;
}
interface DataSource {
  id: string;
  name: string;
  type: "rss" | "api" | "manual";
  url?: string;
  apiKey?: string;
  status: "active" | "inactive" | "error";
  lastSync: Date;
  itemsCount: number;
  category: string;
}
const mockKnowledgeItems: KnowledgeItem[] = [{
  id: "1",
  type: "article",
  title: "أحدث تقنيات زراعة الأسنان 2024",
  content: "مقال شامل حول التطورات الحديثة في مجال زراعة الأسنان والتقنيات المستخدمة...",
  author: {
    name: "د. أحمد العراقي",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face",
    role: "أخصائي زراعة الأسنان"
  },
  category: "زراعة الأسنان",
  tags: ["زراعة", "تقنيات حديثة", "2024"],
  source: "internal",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  status: "published",
  views: 2547,
  likes: 89,
  shares: 23,
  featured: true,
  thumbnailUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300&h=200&fit=crop"
}, {
  id: "2",
  type: "video",
  title: "خطوات تنظيف الأسنان الصحيح",
  content: "فيديو تعليمي يوضح الطريقة الصحيحة لتنظيف الأسنان والعناية بالفم...",
  author: {
    name: "د. سارة محمد",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
    role: "أخصائية طب الأسنان الوقائي"
  },
  category: "الوقاية والعناية",
  tags: ["تنظيف", "وقاية", "تعليمي"],
  source: "rss",
  sourceUrl: "https://example.com/dental-care-video",
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  status: "published",
  views: 1893,
  likes: 156,
  shares: 67,
  featured: false,
  thumbnailUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=200&fit=crop"
}, {
  id: "3",
  type: "document",
  title: "دليل العيادة الذكية الشامل",
  content: "دليل تفصيلي لتحويل العيادة التقليدية إلى عيادة ذكية مع أحدث التقنيات...",
  author: {
    name: "فريق التطوير",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    role: "مطور نظم طبية"
  },
  category: "التقنيات الذكية",
  tags: ["عيادة ذكية", "تقنيات", "دليل"],
  source: "api",
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  status: "published",
  views: 987,
  likes: 43,
  shares: 12,
  featured: true
}];
const mockDataSources: DataSource[] = [{
  id: "1",
  name: "مجلة طب الأسنان العربية",
  type: "rss",
  url: "https://dental-magazine.com/rss",
  status: "active",
  lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
  itemsCount: 45,
  category: "مقالات طبية"
}, {
  id: "2",
  name: "الجمعية السعودية لطب الأسنان",
  type: "api",
  url: "https://api.saudi-dental.org/articles",
  apiKey: "***************",
  status: "active",
  lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
  itemsCount: 28,
  category: "أبحاث علمية"
}, {
  id: "3",
  name: "قناة التعليم الطبي",
  type: "rss",
  url: "https://medical-education-channel.com/feed",
  status: "error",
  lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
  itemsCount: 0,
  category: "فيديوهات تعليمية"
}];
export default function SmartClinicKnowledge() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"content" | "sources" | "analytics">("content");
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "featured">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // New content form
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState({
    type: "article" as KnowledgeItem["type"],
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
    sourceUrl: "",
    featured: false
  });

  // New source form
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    type: "rss" as DataSource["type"],
    url: "",
    apiKey: "",
    category: ""
  });
  const categories = ["all", "زراعة الأسنان", "الوقاية والعناية", "التقنيات الذكية", "التجميل", "جراحة الفم"];
  const contentTypes = ["all", "article", "video", "image", "document", "external"];
  const filteredItems = knowledgeItems.filter(item => (selectedCategory === "all" || item.category === selectedCategory) && (selectedType === "all" || item.type === selectedType) && (searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.content.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))).sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
  const handleAddContent = () => {
    const item: KnowledgeItem = {
      id: Date.now().toString(),
      ...newContent,
      author: {
        name: "مدير النظام",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        role: "مدير المنصة"
      },
      tags: newContent.tags,
      source: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "published",
      views: 0,
      likes: 0,
      shares: 0
    };
    setKnowledgeItems([item, ...knowledgeItems]);
    setNewContent({
      type: "article",
      title: "",
      content: "",
      category: "",
      tags: [],
      sourceUrl: "",
      featured: false
    });
    setShowAddContent(false);
  };
  const handleAddSource = () => {
    const source: DataSource = {
      id: Date.now().toString(),
      ...newSource,
      status: "active",
      lastSync: new Date(),
      itemsCount: 0
    };
    setDataSources([source, ...dataSources]);
    setNewSource({
      name: "",
      type: "rss",
      url: "",
      apiKey: "",
      category: ""
    });
    setShowAddSource(false);
  };
  const getTypeIcon = (type: KnowledgeItem["type"]) => {
    switch (type) {
      case "article":
        return FileText;
      case "video":
        return Video;
      case "image":
        return Image;
      case "document":
        return FileText;
      case "external":
        return LinkIcon;
      default:
        return FileText;
    }
  };
  const getStatusColor = (status: DataSource["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/dentist-hub/smart-clinic/overview")} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  إدارة المعرفة الذكية
                </h1>
                
              </div>
            </div>
            <div className="flex items-center gap-3">
              
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 lg:p-8 pb-20">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Rss className="w-4 h-4" />
              المصادر
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="البحث في المحتوى..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" />
                </div>
                
                <div className="flex gap-2">
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {categories.map(cat => <option key={cat} value={cat}>
                        {cat === "all" ? "جميع التصنيفات" : cat}
                      </option>)}
                  </select>
                  
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {contentTypes.map(type => <option key={type} value={type}>
                        {type === "all" ? "جميع الأنواع" : type === "article" ? "مقالات" : type === "video" ? "فيديوهات" : type === "image" ? "صور" : type === "document" ? "مستندات" : "روابط خارجية"}
                      </option>)}
                  </select>
                  
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="recent">الأحدث</option>
                    <option value="popular">الأكثر مشاهدة</option>
                    <option value="featured">المميز</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => {
              const TypeIcon = getTypeIcon(item.type);
              return <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    {item.thumbnailUrl && <div className="relative h-48 overflow-hidden">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        {item.featured && <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                            مميز
                          </Badge>}
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-white/90">
                            <TypeIcon className="w-3 h-3 ml-1" />
                            {item.type === "article" ? "مقال" : item.type === "video" ? "فيديو" : item.type === "image" ? "صورة" : item.type === "document" ? "مستند" : "رابط"}
                          </Badge>
                        </div>
                      </div>}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 ml-2" />
                              مشاركة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={item.author.avatar} />
                          <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">{item.author.name}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, index) => <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>)}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {item.shares}
                          </span>
                        </div>
                        <Badge variant="outline" className={cn(item.status === "published" ? "text-green-600 border-green-200" : item.status === "draft" ? "text-yellow-600 border-yellow-200" : "text-gray-600 border-gray-200")}>
                          {item.status === "published" ? "منشور" : item.status === "draft" ? "مسودة" : "مؤرشف"}
                        </Badge>
                      </div>
                    </div>
                  </div>;
            })}
            </div>
          </TabsContent>

          <TabsContent value="sources">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">مصادر البيانات</h2>
                <Button onClick={() => setShowAddSource(true)} className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مصدر
                </Button>
              </div>

              <div className="grid gap-4">
                {dataSources.map(source => <div key={source.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {source.type === "rss" ? <Rss className="w-5 h-5 text-blue-600" /> : <Database className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{source.name}</h3>
                          <p className="text-sm text-gray-600">{source.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(source.status)}>
                          {source.status === "active" ? "نشط" : source.status === "inactive" ? "غير نشط" : "خطأ"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 ml-2" />
                              إعدادات
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Upload className="w-4 h-4 ml-2" />
                              مزامنة الآن
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">النوع: </span>
                        <span className="font-medium">
                          {source.type === "rss" ? "RSS" : "API"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">العناصر: </span>
                        <span className="font-medium">{source.itemsCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">آخر مزامنة: </span>
                        <span className="font-medium">
                          {new Date(source.lastSync).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    
                    {source.url && <div className="mt-2">
                        <span className="text-gray-600 text-sm">الرابط: </span>
                        <span className="text-blue-600 text-sm font-mono">
                          {source.url}
                        </span>
                      </div>}
                  </div>)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {knowledgeItems.length}
                    </h3>
                    <p className="text-sm text-gray-600">إجمالي المحتوى</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {knowledgeItems.reduce((sum, item) => sum + item.views, 0)}
                    </h3>
                    <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {knowledgeItems.reduce((sum, item) => sum + item.likes, 0)}
                    </h3>
                    <p className="text-sm text-gray-600">إجمالي الإعجابات</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Rss className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {dataSources.filter(s => s.status === "active").length}
                    </h3>
                    <p className="text-sm text-gray-600">مصادر نشطة</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Content Dialog */}
      <Dialog open={showAddContent} onOpenChange={setShowAddContent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة محتوى جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المحتوى
              </label>
              <select value={newContent.type} onChange={e => setNewContent({
              ...newContent,
              type: e.target.value as any
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="article">مقال</option>
                <option value="video">فيديو</option>
                <option value="image">صورة</option>
                <option value="document">مستند</option>
                <option value="external">رابط خارجي</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <Input value={newContent.title} onChange={e => setNewContent({
              ...newContent,
              title: e.target.value
            })} placeholder="عنوان المحتوى..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المحتوى
              </label>
              <Textarea value={newContent.content} onChange={e => setNewContent({
              ...newContent,
              content: e.target.value
            })} placeholder="وصف أو محتوى المادة..." rows={4} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <Input value={newContent.category} onChange={e => setNewContent({
              ...newContent,
              category: e.target.value
            })} placeholder="التصنيف..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكلمات المفتاحية (منفصلة بفاصلة)
              </label>
              <Input value={newContent.tags.join(", ")} onChange={e => setNewContent({
              ...newContent,
              tags: e.target.value.split(", ").filter(t => t.trim())
            })} placeholder="كلمة1, كلمة2, كلمة3..." />
            </div>
            
            {(newContent.type === "video" || newContent.type === "external") && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرابط
                </label>
                <Input value={newContent.sourceUrl} onChange={e => setNewContent({
              ...newContent,
              sourceUrl: e.target.value
            })} placeholder="https://..." />
              </div>}
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={newContent.featured} onChange={e => setNewContent({
              ...newContent,
              featured: e.target.checked
            })} className="rounded" />
              <label htmlFor="featured" className="text-sm text-gray-700">
                محتوى مميز
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddContent} className="flex-1">
                إضافة المحتوى
              </Button>
              <Button variant="outline" onClick={() => setShowAddContent(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Source Dialog */}
      <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مصدر بيانات جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المصدر
              </label>
              <Input value={newSource.name} onChange={e => setNewSource({
              ...newSource,
              name: e.target.value
            })} placeholder="اسم المصدر..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المصدر
              </label>
              <select value={newSource.type} onChange={e => setNewSource({
              ...newSource,
              type: e.target.value as any
            })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="rss">RSS Feed</option>
                <option value="api">API</option>
                <option value="manual">يدوي</option>
              </select>
            </div>
            
            {newSource.type !== "manual" && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرابط
                </label>
                <Input value={newSource.url} onChange={e => setNewSource({
              ...newSource,
              url: e.target.value
            })} placeholder="https://..." />
              </div>}
            
            {newSource.type === "api" && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مفتاح API
                </label>
                <Input type="password" value={newSource.apiKey} onChange={e => setNewSource({
              ...newSource,
              apiKey: e.target.value
            })} placeholder="API Key..." />
              </div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <Input value={newSource.category} onChange={e => setNewSource({
              ...newSource,
              category: e.target.value
            })} placeholder="التصنيف..." />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddSource} className="flex-1">
                إضافة المصدر
              </Button>
              <Button variant="outline" onClick={() => setShowAddSource(false)} className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}