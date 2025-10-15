import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Home,
  Building2,
  Edit,
  Trash2,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Address {
  id: string;
  type: "home" | "work" | "clinic";
  title: string;
  fullAddress: string;
  city: string;
  area: string;
  street: string;
  building?: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    title: "المنزل",
    fullAddress: "بغداد، الكرادة، شارع 62، بناية 15",
    city: "بغداد",
    area: "الكرادة",
    street: "شارع 62",
    building: "بناية 15",
    phone: "07701234567",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    title: "العمل",
    fullAddress: "بغداد، المنصور، شارع الأميرات، مجمع المنصور الطبي",
    city: "بغداد",
    area: "المنصور",
    street: "شارع الأميرات",
    building: "مجمع المنصور الطبي",
    phone: "07809876543",
    isDefault: false,
  },
  {
    id: "3",
    type: "clinic",
    title: "العيادة",
    fullAddress: "أربيل، شارع 100، بناية النخيل الطبية، الطابق 3",
    city: "أربيل",
    area: "شارع 100",
    street: "بناية النخيل الطبية",
    building: "الطابق 3",
    phone: "07501112233",
    isDefault: false,
  },
];

const addressTypeConfig = {
  home: {
    label: "منزل",
    icon: Home,
    color: "bg-blue-100 text-blue-700",
    iconColor: "text-blue-600",
  },
  work: {
    label: "عمل",
    icon: Building2,
    color: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-600",
  },
  clinic: {
    label: "عيادة",
    icon: MapPin,
    color: "bg-green-100 text-green-700",
    iconColor: "text-green-600",
  },
};

export default function DentalSupplyAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleSetDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-7 h-7" />
              عناوين التوصيل
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/dental-supply")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-white/90 text-sm">
            إدارة عناوين التوصيل الخاصة بك
          </p>
        </div>
      </div>

      {/* Add New Address Button */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <Button
          onClick={() => alert("ميزة إضافة عنوان جديد قيد التطوير")}
          className="w-full bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 shadow-lg rounded-xl h-14 font-bold text-base"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة عنوان جديد
        </Button>
      </div>

      {/* Addresses List */}
      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
        {addresses.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              لا توجد عناوين محفوظة
            </h3>
            <p className="text-gray-500 mb-6">
              قم بإضافة عنوان توصيل لتسهيل عملية الطلب
            </p>
            <Button
              onClick={() => alert("ميزة إضافة عنوان جديد قيد التطوير")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة عنوان
            </Button>
          </Card>
        ) : (
          addresses.map((address) => {
            const TypeIcon = addressTypeConfig[address.type].icon;
            return (
              <Card
                key={address.id}
                className={`p-5 relative transition-all hover:shadow-lg ${
                  address.isDefault ? "border-2 border-purple-500" : ""
                }`}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
                    <CheckCircle className="w-3 h-3 ml-1" />
                    العنوان الافتراضي
                  </Badge>
                )}

                {/* Address Type */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2.5 rounded-lg ${addressTypeConfig[address.type].color}`}
                  >
                    <TypeIcon
                      className={`w-5 h-5 ${addressTypeConfig[address.type].iconColor}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {address.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${addressTypeConfig[address.type].color} border-0`}
                    >
                      {addressTypeConfig[address.type].label}
                    </Badge>
                  </div>
                </div>

                {/* Full Address */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed mb-2">
                    {address.fullAddress}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {address.city} • {address.area}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="text-gray-900 font-medium direction-ltr text-right">
                    {address.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      تعيين كافتراضي
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("ميزة تعديل العنوان قيد التطوير")}
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا العنوان بشكل نهائي ولن يمكنك استرجاعه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
