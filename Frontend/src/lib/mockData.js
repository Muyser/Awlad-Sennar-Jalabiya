import { IMG, CATEGORIES } from "@/components/site/constants";

export const money = (n) => n.toLocaleString("en-US");

export const CATEGORY_LIST = CATEGORIES.map((name, i) => ({
  name,
  count: [42, 28, 19, 15, 22, 8, 14, 11, 9, 17, 6, 13][i] || 10,
  image: [IMG.sudanese, IMG.gulf, IMG.chadian, IMG.african, IMG.african, IMG.turbans, IMG.turbans, IMG.turbans, IMG.cream, IMG.burgundy, IMG.navy, IMG.green][i] || IMG.cream,
}));

export const PRODUCTS = [
  {
    id: "P-1001",
    name: "جلابية سودانية بيضاء كلاسيك",
    category: "جلاليب سودانية",
    price: 45000,
    oldPrice: null,
    image: IMG.cream,
    images: [IMG.cream, IMG.sudanese, IMG.about],
    colors: ["أبيض", "أسود", "ذهبي"],
    colorHex: ["#F9F7F2", "#1A1A1B", "#C5A059"],
    sizes: ["50", "52", "54", "56"],
    available: true,
    type: "جاهز",
    stock: 24,
    sold: 138,
    rating: 4.8,
    description:
      "جلابية سودانية أنيقة من القطن الخالص، بقصّة كلاسيكية مريحة وياقة مبسّط. مناسبة للمناسبات والاستعمال اليومي، تجمع بين الأصالة والأناقة العصرية.",
  },
  {
    id: "P-1002",
    name: "جلابية بُنّي مطرّزة بذهب",
    category: "جلاليب سودانية",
    price: 62000,
    oldPrice: 78000,
    image: IMG.burgundy,
    images: [IMG.burgundy, IMG.about, IMG.atelier],
    colors: ["بُنّي", "أسود"],
    colorHex: ["#6B2B2B", "#1A1A1B"],
    sizes: ["50", "52", "54"],
    available: true,
    type: "جاهز",
    stock: 12,
    sold: 76,
    rating: 4.9,
    description: "جلابية فاخرة بتطريز ذهبي يدوي على الياقة والأكمام، قماش قطني ثقيل يناسب المناسبات الرسمية والأعراس.",
  },
  {
    id: "P-1003",
    name: "جلابية كحلية فاخرة",
    category: "جلاليب سودانية",
    price: 55000,
    oldPrice: null,
    image: IMG.navy,
    images: [IMG.navy, IMG.sudanese, IMG.about],
    colors: ["كحلي", "أسود"],
    colorHex: ["#1A1A1B", "#1A1A1B"],
    sizes: ["52", "54", "56", "58"],
    available: true,
    type: "تفصيل",
    stock: 0,
    sold: 54,
    rating: 4.7,
    description: "جلابية كحلية بنقشة هادئة tone-on-tone، متوفرة جاهزة أو تفصّل حسب المقاس. خيار راقٍ للإطلالات اليومية.",
  },
  {
    id: "P-1004",
    name: "جلابية خضراء بتريزيب ذهبي",
    category: "جلاليب سودانية",
    price: 70000,
    oldPrice: null,
    image: IMG.green,
    images: [IMG.green, IMG.about, IMG.atelier],
    colors: ["أخضر"],
    colorHex: ["#1F3D2B"],
    sizes: ["50", "52", "54"],
    available: false,
    type: "تفصيل",
    stock: 0,
    sold: 33,
    rating: 4.6,
    description: "جلابية خضراء داكنة مع تريزيب ذهبي مزيّن، تفصّل حسب الطلب بمقاساتك الخاصة.",
  },
  {
    id: "P-1005",
    name: "جلابية خليجية كريمية",
    category: "جلاليب خليجية",
    price: 58000,
    oldPrice: null,
    image: IMG.gulf,
    images: [IMG.gulf, IMG.about, IMG.cream],
    colors: ["كريمي", "أبيض"],
    colorHex: ["#E8DCC4", "#F9F7F2"],
    sizes: ["52", "54", "56"],
    available: true,
    type: "جاهز",
    stock: 18,
    sold: 61,
    rating: 4.7,
    description: "جلابية خليجية بلمسة كريمية أنيقة وقماش فاخر بملمس ناعم، تصميم عصري محافظ على الطابع الخليجي الأصيل.",
  },
  {
    id: "P-1006",
    name: "جلابية تشادية مزخرفة",
    category: "جلاليب تشادية",
    price: 48000,
    oldPrice: 60000,
    image: IMG.chadian,
    images: [IMG.chadian, IMG.african, IMG.about],
    colors: ["نيلي", "بُنّي"],
    colorHex: ["#1A1A1B", "#6B2B2B"],
    sizes: ["50", "52", "54"],
    available: true,
    type: "جاهز",
    stock: 9,
    sold: 42,
    rating: 4.8,
    description: "جلابية تشادية بتطريز وزخارف تقليدية على قماش نيلي، تعكس الهوية التشادية السودانية الأصيلة.",
  },
  {
    id: "P-1007",
    name: "طقم جانفو أفريقي",
    category: "جانفو",
    price: 52000,
    oldPrice: null,
    image: IMG.african,
    images: [IMG.african, IMG.about, IMG.burgundy],
    colors: ["أوكرة", "نيلي"],
    colorHex: ["#C5A059", "#1A1A1B"],
    sizes: ["M", "L", "XL"],
    available: true,
    type: "جاهز",
    stock: 7,
    sold: 29,
    rating: 4.5,
    description: "طقم جانفو بنقشة أفريقية حيوية بألوان دافئة، قصّة مريحة تناسب الإطلالات العصرية ذات الهوية الأفريقية.",
  },
  {
    id: "P-1008",
    name: "شال وعمامة قطنية",
    category: "شالات",
    price: 22000,
    oldPrice: null,
    image: IMG.turbans,
    images: [IMG.turbans, IMG.about, IMG.cream],
    colors: ["أبيض", "كريمي"],
    colorHex: ["#F9F7F2", "#E8DCC4"],
    sizes: ["مقاس واحد"],
    available: true,
    type: "جاهز",
    stock: 40,
    sold: 210,
    rating: 4.9,
    description: "شال وعمامة قطنية فاخرة بملمس ناعم، تكمل الإطلالة السودانية بأناقة ووقار.",
  },
];

export const ORDERS = [
  { id: "ORD-2041", customer: "أحمد عبدالله", phone: "0912345678", items: 3, total: 165000, discount: 0, paid: 165000, remaining: 0, status: "جديد", date: "2026-09-22", branch: "الخرطوم" },
  { id: "ORD-2040", customer: "محمد عثمان", phone: "0912345679", items: 1, total: 62000, discount: 5000, paid: 30000, remaining: 27000, status: "تم التأكيد", date: "2026-09-22", branch: "أم درمان" },
  { id: "ORD-2039", customer: "يوسف إبراهيم", phone: "0912345680", items: 2, total: 110000, discount: 0, paid: 110000, remaining: 0, status: "قيد التجهيز", date: "2026-09-21", branch: "الخرطوم" },
  { id: "ORD-2038", customer: "خالد الأمين", phone: "0912345681", items: 4, total: 230000, discount: 15000, paid: 230000, remaining: 0, status: "جاهز", date: "2026-09-21", branch: "بحري" },
  { id: "ORD-2037", customer: "عمر سعيد", phone: "0912345682", items: 1, total: 48000, discount: 0, paid: 48000, remaining: 0, status: "تم التسليم", date: "2026-09-20", branch: "الخرطوم" },
  { id: "ORD-2036", customer: "حسن محمد", phone: "0912345683", items: 2, total: 96000, discount: 0, paid: 50000, remaining: 46000, status: "تم التسليم", date: "2026-09-19", branch: "أم درمان" },
  { id: "ORD-2035", customer: "إبراهيم آدم", phone: "0912345684", items: 5, total: 280000, discount: 20000, paid: 260000, remaining: 0, status: "تم التسليم", date: "2026-09-18", branch: "الخرطوم" },
];

export const TAILORING = [
  { id: "TL-501", customer: "أحمد عبدالله", phone: "0912345678", type: "جلابية سودانية", fabric: "قطن مصري", color: "أبيض", measurements: "صدر 50 / كم 60", notes: "ياقة مبسطة", delivery: "2026-10-02", paid: 30000, remaining: 25000, status: "جديد" },
  { id: "TL-500", customer: "محمد عثمان", phone: "0912345679", type: "جلابية خليجية", fabric: "كتان فاخر", color: "كريمي", measurements: "صدر 54 / كم 62", notes: "تريزيب خفيف", delivery: "2026-10-05", paid: 40000, remaining: 20000, status: "أخذ المقاسات" },
  { id: "TL-499", customer: "يوسف إبراهيم", phone: "0912345680", type: "جلابية تشادية", fabric: "قطن ثقيل", color: "نيلي", measurements: "صدر 52 / كم 58", notes: "زخرفة يدوية", delivery: "2026-09-30", paid: 50000, remaining: 0, status: "قيد التفصيل" },
  { id: "TL-498", customer: "خالد الأمين", phone: "0912345681", type: "جلابية سودانية", fabric: "قطن مصري", color: "بُنّي", measurements: "صدر 50 / كم 60", notes: "تطريز ذهبي", delivery: "2026-09-28", paid: 70000, remaining: 0, status: "جاهز" },
  { id: "TL-497", customer: "عمر سعيد", phone: "0912345682", type: "جانفو", fabric: "أفريقي مطبوع", color: "أوكرة", measurements: "M", notes: "", delivery: "2026-09-25", paid: 52000, remaining: 0, status: "تم التسليم" },
];

export const CUSTOMERS = [
  { id: "C-301", name: "أحمد عبدالله", phone: "0912345678", orders: 12, spent: 1280000, sizes: "صدر 50 / كم 60", paid: 1180000, remaining: 100000 },
  { id: "C-302", name: "محمد عثمان", phone: "0912345679", orders: 8, spent: 620000, sizes: "صدر 54 / كم 62", paid: 560000, remaining: 60000 },
  { id: "C-303", name: "يوسف إبراهيم", phone: "0912345680", orders: 15, spent: 1840000, sizes: "صدر 52 / كم 58", paid: 1840000, remaining: 0 },
  { id: "C-304", name: "خالد الأمين", phone: "0912345681", orders: 6, spent: 540000, sizes: "صدر 50 / كم 60", paid: 540000, remaining: 0 },
  { id: "C-305", name: "عمر سعيد", phone: "0912345682", orders: 9, spent: 720000, sizes: "صدر 56 / كم 64", paid: 700000, remaining: 20000 },
  { id: "C-306", name: "حسن محمد", phone: "0912345683", orders: 4, spent: 380000, sizes: "صدر 52 / كم 60", paid: 330000, remaining: 50000 },
];

export const EXPENSES = [
  { id: "E-901", type: "الإيجار", amount: 300000, date: "2026-09-01", notes: "إيجار المحل شهري" },
  { id: "E-900", type: "الرواتب", amount: 850000, date: "2026-09-01", notes: "رواتب الموظفين" },
  { id: "E-899", type: "شراء البضائع", amount: 1200000, date: "2026-09-10", notes: "دفعة قماش قطن" },
  { id: "E-898", type: "الكهرباء والمياه", amount: 45000, date: "2026-09-12", notes: "فاتورة سبتمبر" },
  { id: "E-897", type: "التفصيل", amount: 92000, date: "2026-09-15", notes: "أجور تفصيل" },
  { id: "E-896", type: "المواصلات", amount: 28000, date: "2026-09-18", notes: "توصيل بضائع" },
];

export const OFFERS = [
  { id: "OF-01", name: "تخفيضات الجلاليب", product: "جلابية بُنّي مطرّزة", type: "نسبة مئوية", value: "21%", start: "2026-09-20", end: "2026-09-30", active: true },
  { id: "OF-02", name: "عرض الجلابية الكحلية", product: "جلابية كحلية فاخرة", type: "نسبة مئوية", value: "20%", start: "2026-09-20", end: "2026-10-05", active: true },
  { id: "OF-03", name: "خصم الجلابية البيضاء", product: "جلابية سودانية بيضاء", type: "مبلغ ثابت", value: "9,000 ج.س", start: "2026-09-15", end: "2026-09-28", active: false },
];

export const BRANCHES = [
  { id: "B-1", name: "فرع الخرطوم", area: "الخرطوم", address: "سوق المدينة الحديثة، شارع المشتل", phone: "0123456789", hours: "9ص - 10م", status: "مفتوح" },
  { id: "B-2", name: "فرع أم درمان", area: "أم درمان", address: "شارع الموردة، قرب السوق الكبير", phone: "0123456790", hours: "9ص - 10م", status: "مفتوح" },
  { id: "B-3", name: "فرع بحري", area: "بحري", address: "السوق الشعبي، الك батареبان", phone: "0123456791", hours: "10ص - 9م", status: "مفتوح" },
  { id: "B-4", name: "فرع مدني", area: "ود مدني", address: "السوق المركزي", phone: "0123456792", hours: "9ص - 9م", status: "مغلق" },
];

export const STAFF = [
  { id: "S-1", name: "أولاد سنار", phone: "0912000000", email: "owner@sennar.sd", role: "Owner / Admin", branch: "الكل", status: "نشط" },
  { id: "S-2", name: "عبدالله أحمد", phone: "0912345601", email: "abdullah@sennar.sd", role: "Manager", branch: "الخرطوم", status: "نشط" },
  { id: "S-3", name: "ماجد يوسف", phone: "0912345602", email: "majd@sennar.sd", role: "Sales", branch: "أم درمان", status: "نشط" },
  { id: "S-4", name: "نور الدين", phone: "0912345603", email: "nour@sennar.sd", role: "Tailoring", branch: "الخرطوم", status: "نشط" },
  { id: "S-5", name: "سالم محمد", phone: "0912345604", email: "salem@sennar.sd", role: "Inventory", branch: "بحري", status: "موقوف" },
];

export const EXPENSE_TYPES = [
  "الإيجار", "الرواتب", "الكهرباء والمياه", "المواصلات", "التوصيل",
  "شراء البضائع", "الأقمشة والمواد", "التفصيل", "الصيانة", "أخرى",
];

export const ROLES = ["Owner / Admin", "Manager", "Sales", "Tailoring", "Inventory", "Accountant"];