import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { MapPin, Users, Star, Search, ArrowRight, Phone, MessageCircle, Send, Briefcase } from "lucide-react";
import InteractiveJobsMap from "@/components/InteractiveJobsMap";
import JobsSubNav from "@/components/JobsSubNav";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  phone: string;
  image: string;
  availableNow?: boolean;
}

const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "د. أحمد الرحمة",
    specialty: "زراعة الأسنان",
    location: "بغداد، العراق",
    experience: "10+ سنوات",
    rating: 4.9,
    phone: "+964 770 123 4567",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "د. سارة النور",
    specialty: "تقويم الأسنان",
    location: "بغداد، العراق",
    experience: "7+ سنوات",
    rating: 4.8,
    phone: "+964 750 987 6543",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "د. محمد الخالدي",
    specialty: "جراحة ��لفم والفكين",
    location: "أربيل، العراق",
    experience: "12+ سنة",
    rating: 4.7,
    phone: "+964 780 456 7890",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "د. فاطمة حسن",
    specialty: "طب أسنان الأطفال",
    location: "البصرة، العراق",
    experience: "6+ سنوات",
    rating: 4.9,
    phone: "+964 771 222 3344",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "د. ليث العابد",
    specialty: "التجميل والترميم",
    location: "السليمانية، العراق",
    experience: "9+ سنوات",
    rating: 4.6,
    phone: "+964 772 555 6677",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "د. زينب علي",
    specialty: "علاج اللثة",
    location: "النجف، العراق",
    experience: "8+ سنوات",
    rating: 4.7,
    phone: "+964 773 888 9900",
    image:
      "https://images.unsplash.com/photo-1554386690-15499755a163?w=200&h=200&fit=crop",
  },
  {
    id: 7,
    name: "د. علي الحسي��ي",
    specialty: "تقويم الأسنان",
    location: "كربلاء، العراق",
    experience: "5+ سنوات",
    rating: 4.5,
    phone: "+964 770 112 2233",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  },
  {
    id: 8,
    name: "د. مريم كريم",
    specialty: "زراعة الأسنان",
    location: "الموصل، العراق",
    experience: "11+ سنة",
    rating: 4.8,
    phone: "+964 771 334 5566",
    image:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?w=200&h=200&fit=crop",
  },
];

export default function BrowseDentists() {
  const { language } = useI18n();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApply, setShowApply] = useState(false);
  const [applyJob, setApplyJob] = useState<any>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageDoctor, setMessageDoctor] = useState<Doctor | null>(null);

  const specialties = useMemo(() => {
    const set = new Set<string>();
    doctorsData.forEach((d) => set.add(d.specialty));
    return ["all", ...Array.from(set)];
  }, []);

  const locations = useMemo(() => {
    const set = new Set<string>();
    doctorsData.forEach((d) => set.add(d.location));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let arr = doctorsData.filter((d) => {
      const matchesQuery =
        d.name.includes(query) ||
        d.specialty.includes(query) ||
        d.location.includes(query);
      const matchesSpecialty = specialty === "all" || d.specialty === specialty;
      const matchesLocation = location === "all" || d.location === location;
      return matchesQuery && matchesSpecialty && matchesLocation;
    });
    if (sortBy === "rating") arr = arr.sort((a, b) => b.rating - a.rating);
    if (sortBy === "experience") {
      const toNum = (s: string) => parseInt(s.split("+")[0].replace(/[^0-9]/g, "")) || 0;
      arr = arr.sort((a, b) => toNum(b.experience) - toNum(a.experience));
    }
    return arr;
  }, [query, specialty, location, sortBy]);

  const cityCoords: Record<string, { lat: number; lng: number }> = {
    "بغداد": { lat: 33.3152, lng: 44.3661 },
    "البصرة": { lat: 30.5085, lng: 47.7804 },
    "أربيل": { lat: 36.19, lng: 44.0092 },
    "الموصل": { lat: 36.335, lng: 43.1189 },
    "السليمانية": { lat: 35.565, lng: 45.4297 },
    "النجف": { lat: 32.028, lng: 44.3419 },
    "كربلاء": { lat: 32.616, lng: 44.0244 },
  };

  const getCoordinates = (loc: string) => {
    const key = Object.keys(cityCoords).find((k) => loc.includes(k));
    return key ? cityCoords[key] : null;
  };

  const dentistJobs = useMemo(() => {
    return filtered.map((d) => ({
      id: d.id,
      title: `${d.specialty} — متاح للعمل`,
      company: d.name,
      location: d.location,
      coordinates: getCoordinates(d.location),
      district: "",
      nearbyLandmarks: [],
      type: "طبيب متاح",
      experience: d.experience,
      salary: "يتم الاتفاق",
      description: `طبيب ${d.specialty} جاهز للعمل فورًا`,
      requirements: [],
      benefits: [],
      posted: "اليوم",
      applicants: 0,
      featured: d.rating >= 4.8,
      urgent: !!d.availableNow,
      remote: false,
      logo: d.image,
      company_rating: d.rating,
      company_size: "1",
      distance: "",
      commute_time: "",
      phone: d.phone,
    }));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                تصفح الأطباء
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ابحث بحسب الاختصاص والموقع وقارن التقييم والخبرة
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              العودة إلى الوظائف
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <JobsSubNav />

          {/* Search Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الاختصاص أو الموقع"
                className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                title="اختيار الاختصاص"
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "كل الاختصاصات" : s}
                  </option>
                ))}
              </select>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                title="اختيار الموقع"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l === "all" ? "كل المواقع" : l}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                title="ترتيب حسب"
              >
                <option value="rating">الأعلى تقييماً</option>
                <option value="experience">الأكثر خبرة</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Map (Jobs UI) */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              الأطباء المتوفرون (خريطة)
            </h2>
          </div>
          <div className="p-4">
            <InteractiveJobsMap
              jobs={dentistJobs as any}
              selectedJob={selectedJob}
              onJobSelect={(job) => setSelectedJob(job)}
              onJobApply={(jobId) => {
                const job = (dentistJobs as any).find((j: any) => j.id === jobId);
                setApplyJob(job);
                setShowApply(true);
              }}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">نتائج الأطباء</h2>
            <div className="text-sm text-gray-600">{filtered.length} نتيجة</div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d) => (
              <div key={d.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <img src={d.image} alt={d.name} className="w-14 h-14 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{d.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="text-sm text-gray-700">{d.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{d.specialty}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{d.location}</span>
                      <span>•</span>
                      <span>{d.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => { setMessageDoctor(d); setShowMessage(true); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100"
                  >
                    <MessageCircle className="w-4 h-4" />
                    مراسلة
                  </button>
                  <button
                    onClick={() => {
                      const job = (dentistJobs as any).find((j: any) => j.id === d.id);
                      setApplyJob(job);
                      setShowApply(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                  >
                    <Briefcase className="w-4 h-4" />
                    تقدم بعرض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApply && applyJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                التقدم لفرصة مع {applyJob.company}
              </h3>
              <button onClick={() => setShowApply(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowApply(false);
                alert("تم إرسال طلبك بنجاح");
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-700 mb-1">الاسم الكامل</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="اسمك" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">رقم الهاتف</label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="رقم التواصل" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">رسالة تعريفية</label>
                <textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-28" placeholder="اكتب رسالة مختصرة..." />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowApply(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  إرسال الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessage && messageDoctor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                مراسلة {messageDoctor.name}
              </h3>
              <button onClick={() => setShowMessage(false)} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowMessage(false);
                alert("تم إرسال الرسالة");
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-700 mb-1">رسالتك</label>
                <textarea required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32" placeholder="اكتب رسالتك هنا..." />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMessage(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">إلغاء</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  إرسال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
