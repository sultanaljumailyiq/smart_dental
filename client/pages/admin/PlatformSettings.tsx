import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Database,
  Key,
  Link as LinkIcon,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Activity,
  Lock,
  Globe,
  Server,
  Code,
  Clock,
  AlertTriangle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Upload,
  HardDrive,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminTopNavbar from "@/components/AdminTopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface DatabaseConnection {
  id: string;
  name: string;
  arabicName: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  isActive: boolean;
  lastConnected: string;
  notes: string;
}

interface ApiService {
  id: string;
  name: string;
  arabicName: string;
  type: string;
  baseUrl: string;
  isActive: boolean;
  lastUsed: string;
  requestsCount: number;
  notes: string;
}

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  isPublic: boolean;
  dataType: string;
}

export default function PlatformSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [backupFormat, setBackupFormat] = useState<'json' | 'sql'>('json');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Mock data for database connections
  const [databaseConnections, setDatabaseConnections] = useState<DatabaseConnection[]>([
    {
      id: "1",
      name: "Main PostgreSQL",
      arabicName: "قاعدة البيانات الرئيسية",
      type: "postgresql",
      host: "db.example.com",
      port: 5432,
      database: "dental_platform",
      username: "admin",
      isActive: true,
      lastConnected: "2024-01-20 14:30",
      notes: "Primary database for all platform data",
    },
    {
      id: "2",
      name: "Analytics MongoDB",
      arabicName: "قاعدة بيانات التحليلات",
      type: "mongodb",
      host: "mongo.example.com",
      port: 27017,
      database: "analytics",
      username: "analytics_user",
      isActive: true,
      lastConnected: "2024-01-20 15:45",
      notes: "Analytics and reporting data",
    },
  ]);

  // Mock data for API services
  const [apiServices, setApiServices] = useState<ApiService[]>([
    {
      id: "1",
      name: "Stripe Payment Gateway",
      arabicName: "بوابة الدفع Stripe",
      type: "stripe",
      baseUrl: "https://api.stripe.com",
      isActive: true,
      lastUsed: "2024-01-20 16:20",
      requestsCount: 15420,
      notes: "Payment processing",
    },
    {
      id: "2",
      name: "Google Maps API",
      arabicName: "خرائط جوجل",
      type: "google_maps",
      baseUrl: "https://maps.googleapis.com",
      isActive: true,
      lastUsed: "2024-01-20 16:15",
      requestsCount: 8930,
      notes: "Location services",
    },
    {
      id: "3",
      name: "OpenAI API",
      arabicName: "OpenAI للذكاء الاصطناعي",
      type: "openai",
      baseUrl: "https://api.openai.com",
      isActive: true,
      lastUsed: "2024-01-20 16:10",
      requestsCount: 3240,
      notes: "AI dental assistant",
    },
    {
      id: "4",
      name: "Zain Cash Payment",
      arabicName: "زين كاش للدفع",
      type: "zain_cash",
      baseUrl: "https://api.zaincash.iq",
      isActive: false,
      lastUsed: "2024-01-15 10:30",
      requestsCount: 1250,
      notes: "Iraqi payment method",
    },
  ]);

  // Mock data for platform settings
  const [platformSettings, setPlatformSettings] = useState<PlatformSetting[]>([
    {
      id: "1",
      key: "platform_name",
      value: "Iraqi Dental Platform",
      category: "general",
      description: "Platform name",
      isPublic: true,
      dataType: "string",
    },
    {
      id: "2",
      key: "commission_rate",
      value: "15",
      category: "payment",
      description: "Default commission rate (%)",
      isPublic: false,
      dataType: "number",
    },
    {
      id: "3",
      key: "email_notifications",
      value: "true",
      category: "email",
      description: "Enable email notifications",
      isPublic: false,
      dataType: "boolean",
    },
  ]);

  const [dbDialogOpen, setDbDialogOpen] = useState(false);
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);

  const [newDbConnection, setNewDbConnection] = useState<Partial<DatabaseConnection>>({
    type: "postgresql",
    isActive: true,
  });

  const [newApiService, setNewApiService] = useState<Partial<ApiService>>({
    isActive: true,
  });

  const dbTypeLabels: { [key: string]: string } = {
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    firebase: "Firebase",
    supabase: "Supabase",
  };

  const apiTypeLabels: { [key: string]: string } = {
    stripe: "Stripe",
    google_maps: "Google Maps",
    openai: "OpenAI",
    twilio: "Twilio",
    zain_cash: "Zain Cash",
    firebase: "Firebase",
  };

  const dbTypeIcons: { [key: string]: string } = {
    postgresql: "🐘",
    mysql: "🐬",
    mongodb: "🍃",
    firebase: "🔥",
    supabase: "⚡",
  };

  const testConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    try {
      const response = await fetch(`/api/admin/database-connections/${connectionId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "✅ نجح الاختبار",
          description: data.message || "تم الاتصال بقاعدة البيانات بنجاح",
        });
      } else {
        toast({
          variant: "destructive",
          title: "❌ فشل الاختبار",
          description: data.error || "فشل الاتصال بقاعدة البيانات",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ خطأ في الاختبار",
        description: "حدث خطأ أثناء اختبار الاتصال",
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const deleteConnection = (connectionId: string) => {
    setDatabaseConnections(databaseConnections.filter((c) => c.id !== connectionId));
  };

  const deleteService = (serviceId: string) => {
    setApiServices(apiServices.filter((s) => s.id !== serviceId));
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const response = await fetch('/api/admin/database-connections/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: backupFormat })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart_dental_backup_${Date.now()}.${backupFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "✅ تم التحميل",
          description: "تم تحميل النسخة الاحتياطية بنجاح",
        });
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ فشل التحميل",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const text = await file.text();
      let backupData;
      
      if (file.name.endsWith('.json')) {
        backupData = JSON.parse(text);
      } else {
        backupData = text;
      }

      const response = await fetch('/api/admin/database-connections/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupData })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ تمت الاستعادة",
          description: data.message || "تمت استعادة النسخة الاحتياطية بنجاح",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ فشلت الاستعادة",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء استعادة النسخة الاحتياطية",
      });
    } finally {
      setIsRestoring(false);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <AdminTopNavbar />
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                إعدادات المنصة
              </h1>
              <p className="text-gray-600">إدارة قواعد البيانات والخدمات الخارجية</p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              إعدادات عامة
            </TabsTrigger>
            <TabsTrigger value="databases" className="gap-2">
              <Database className="w-4 h-4" />
              قواعد البيانات
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2">
              <HardDrive className="w-4 h-4" />
              النسخ الاحتياطية
            </TabsTrigger>
            <TabsTrigger value="apis" className="gap-2">
              <LinkIcon className="w-4 h-4" />
              خدمات خارجية
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Activity className="w-4 h-4" />
              السجلات
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">الإعدادات العامة</h2>
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platformSettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{setting.description}</Label>
                      {setting.isPublic && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          عام
                        </span>
                      )}
                    </div>
                    {setting.dataType === "boolean" ? (
                      <div className="flex items-center gap-2">
                        <Switch checked={setting.value === "true"} />
                        <span className="text-sm text-gray-600">
                          {setting.value === "true" ? "مفعّل" : "معطّل"}
                        </span>
                      </div>
                    ) : (
                      <Input
                        value={setting.value}
                        onChange={() => {}}
                        type={setting.dataType === "number" ? "number" : "text"}
                        readOnly
                      />
                    )}
                    <p className="text-xs text-gray-500">{setting.key}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Databases Tab */}
          <TabsContent value="databases" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">قواعد البيانات الخارجية</h2>
                <Button onClick={() => setDbDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة قاعدة بيانات
                </Button>
              </div>

              <div className="space-y-4">
                {databaseConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                          {dbTypeIcons[connection.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{connection.arabicName}</h3>
                            <span className="text-xs text-gray-500">({connection.name})</span>
                            {connection.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4" />
                              <span>{connection.host}:{connection.port}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              <span>{connection.database}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>آخر اتصال: {connection.lastConnected}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              <span>{dbTypeLabels[connection.type]}</span>
                            </div>
                          </div>
                          {connection.notes && (
                            <p className="text-sm text-gray-500 mt-2">{connection.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testConnection(connection.id)}
                          disabled={testingConnection === connection.id}
                          className="gap-2"
                        >
                          {testingConnection === connection.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          اختبار
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteConnection(connection.id)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Backup/Restore Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backup Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">تحميل نسخة احتياطية</h2>
                    <p className="text-sm text-gray-600">تصدير قاعدة البيانات كنسخة احتياطية</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>صيغة الملف</Label>
                    <Select value={backupFormat} onValueChange={(value: 'json' | 'sql') => setBackupFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON - جميع البيانات</SelectItem>
                        <SelectItem value="sql">SQL - قاعدة بيانات كاملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">معلومات النسخة الاحتياطية</p>
                        <p className="text-xs text-blue-700">
                          {backupFormat === 'json' 
                            ? 'ملف JSON يحتوي على جميع بيانات المنصة بصيغة قابلة للقراءة'
                            : 'ملف SQL يحتوي على البنية الكاملة لقاعدة البيانات مع البيانات'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBackup} 
                    disabled={isBackingUp}
                    className="w-full gap-2"
                  >
                    {isBackingUp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التحميل...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        تحميل النسخة الاحتياطية
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Restore Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">استعادة نسخة احتياطية</h2>
                    <p className="text-sm text-gray-600">استيراد بيانات من نسخة احتياطية</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900 mb-1">⚠️ تحذير مهم</p>
                        <p className="text-xs text-amber-700">
                          استعادة النسخة الاحتياطية ستستبدل البيانات الحالية. تأكد من أخذ نسخة احتياطية قبل المتابعة.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                        {isRestoring ? (
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        ) : (
                          <Upload className="w-8 h-8 text-purple-600" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {isRestoring ? 'جاري الاستعادة...' : 'اضغط لاختيار ملف'}
                        </p>
                        <p className="text-sm text-gray-500">JSON أو SQL</p>
                      </div>
                      <input
                        type="file"
                        accept=".json,.sql"
                        onChange={handleRestore}
                        disabled={isRestoring}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">الخدمات الخارجية</h2>
                <Button onClick={() => setApiDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة خدمة
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {apiServices.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{service.arabicName}</h3>
                          {service.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{service.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteService(service.id)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs break-all">{service.baseUrl}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Activity className="w-4 h-4" />
                          <span>{service.requestsCount.toLocaleString()} طلب</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">{service.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    {service.notes && (
                      <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        {service.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">سجلات الاتصال</h2>
              <div className="space-y-3">
                {[
                  {
                    id: "1",
                    service: "Stripe Payment Gateway",
                    action: "payment_intent",
                    status: "success",
                    time: "2024-01-20 16:20:15",
                    duration: "245ms",
                  },
                  {
                    id: "2",
                    service: "Google Maps API",
                    action: "geocode",
                    status: "success",
                    time: "2024-01-20 16:15:30",
                    duration: "180ms",
                  },
                  {
                    id: "3",
                    service: "OpenAI API",
                    action: "chat_completion",
                    status: "success",
                    time: "2024-01-20 16:10:45",
                    duration: "1240ms",
                  },
                  {
                    id: "4",
                    service: "Zain Cash Payment",
                    action: "payment_verify",
                    status: "failed",
                    time: "2024-01-20 15:50:20",
                    duration: "5000ms",
                  },
                ].map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 rounded-lg border ${
                      log.status === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {log.status === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{log.service}</p>
                          <p className="text-sm text-gray-600">
                            {log.action} • {log.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span
                          className={`text-sm font-medium ${
                            log.status === "success" ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {log.status === "success" ? "نجح" : "فشل"}
                        </span>
                        <p className="text-xs text-gray-500">{log.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Database Connection Dialog */}
        <Dialog open={dbDialogOpen} onOpenChange={setDbDialogOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة قاعدة بيانات جديدة</DialogTitle>
              <DialogDescription>
                قم بإدخال معلومات الاتصال بقاعدة البيانات الخارجية
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم بالعربية</Label>
                <Input
                  value={newDbConnection.arabicName || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, arabicName: e.target.value })
                  }
                  placeholder="قاعدة البيانات الرئيسية"
                />
              </div>

              <div className="space-y-2">
                <Label>الاسم بالإنجليزية</Label>
                <Input
                  value={newDbConnection.name || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, name: e.target.value })
                  }
                  placeholder="Main Database"
                />
              </div>

              <div className="space-y-2">
                <Label>نوع القاعدة</Label>
                <Select
                  value={newDbConnection.type}
                  onValueChange={(value) =>
                    setNewDbConnection({ ...newDbConnection, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(dbTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {dbTypeIcons[key]} {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>المضيف (Host)</Label>
                <Input
                  value={newDbConnection.host || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, host: e.target.value })
                  }
                  placeholder="db.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>المنفذ (Port)</Label>
                <Input
                  type="number"
                  value={newDbConnection.port || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, port: parseInt(e.target.value) })
                  }
                  placeholder="5432"
                />
              </div>

              <div className="space-y-2">
                <Label>اسم القاعدة</Label>
                <Input
                  value={newDbConnection.database || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, database: e.target.value })
                  }
                  placeholder="database_name"
                />
              </div>

              <div className="space-y-2">
                <Label>اسم المستخدم</Label>
                <Input
                  value={newDbConnection.username || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, username: e.target.value })
                  }
                  placeholder="admin"
                />
              </div>

              <div className="space-y-2">
                <Label>كلمة المرور</Label>
                <div className="relative">
                  <Input
                    type={showPassword["db"] ? "text" : "password"}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({ ...showPassword, db: !showPassword["db"] })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword["db"] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={newDbConnection.notes || ""}
                  onChange={(e) =>
                    setNewDbConnection({ ...newDbConnection, notes: e.target.value })
                  }
                  placeholder="ملاحظات إضافية..."
                  rows={3}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  checked={newDbConnection.isActive}
                  onCheckedChange={(checked) =>
                    setNewDbConnection({ ...newDbConnection, isActive: checked })
                  }
                />
                <Label>تفعيل الاتصال</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDbDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setDbDialogOpen(false)} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة القاعدة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add API Service Dialog */}
        <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة خدمة خارجية جديدة</DialogTitle>
              <DialogDescription>
                قم بإدخال معلومات الخدمة الخارجية ومفاتيح API
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم بالعربية</Label>
                <Input
                  value={newApiService.arabicName || ""}
                  onChange={(e) =>
                    setNewApiService({ ...newApiService, arabicName: e.target.value })
                  }
                  placeholder="بوابة الدفع"
                />
              </div>

              <div className="space-y-2">
                <Label>الاسم بالإنجليزية</Label>
                <Input
                  value={newApiService.name || ""}
                  onChange={(e) =>
                    setNewApiService({ ...newApiService, name: e.target.value })
                  }
                  placeholder="Payment Gateway"
                />
              </div>

              <div className="space-y-2">
                <Label>نوع الخدمة</Label>
                <Select
                  value={newApiService.type}
                  onValueChange={(value) =>
                    setNewApiService({ ...newApiService, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(apiTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                  value={newApiService.baseUrl || ""}
                  onChange={(e) =>
                    setNewApiService({ ...newApiService, baseUrl: e.target.value })
                  }
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="relative">
                  <Input
                    type={showPassword["api"] ? "text" : "password"}
                    placeholder="sk_live_••••••••"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({ ...showPassword, api: !showPassword["api"] })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword["api"] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secret Key (اختياري)</Label>
                <div className="relative">
                  <Input
                    type={showPassword["secret"] ? "text" : "password"}
                    placeholder="sk_secret_••••••••"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword({ ...showPassword, secret: !showPassword["secret"] })
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword["secret"] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={newApiService.notes || ""}
                  onChange={(e) =>
                    setNewApiService({ ...newApiService, notes: e.target.value })
                  }
                  placeholder="ملاحظات إضافية..."
                  rows={3}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Switch
                  checked={newApiService.isActive}
                  onCheckedChange={(checked) =>
                    setNewApiService({ ...newApiService, isActive: checked })
                  }
                />
                <Label>تفعيل الخدمة</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setApiDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setApiDialogOpen(false)} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة الخدمة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
