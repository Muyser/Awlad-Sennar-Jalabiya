import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Ruler, Plus, Pencil, Check, X, Loader2 } from "lucide-react";
import { Card, PageHeader, SectionTitle, Badge, Table } from "@/components/admin/ui";
import { money } from "@/lib/mockData";
import { toast } from "@/components/ui/use-toast";

export default function CustomerDetail() {
  const { id } = useParams();
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [sizesText, setSizesText] = useState("");
  const [savingSizes, setSavingSizes] = useState(false);

  const getAuthToken = () => {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken") ||
      (() => {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          return user?.token || user?.accessToken;
        } catch {
          return null;
        }
      })()
    );
  };

  // جلب تفاصيل العميل
  const fetchCustomerDetail = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل جلب بيانات العميل");

      // التعامل مع هيكل الـ Backend (السيرفر قد يعيد العميل داخل data أو مباشرة)
      const customerData = result.data || result.customer || result;
      setCustomer(customerData);
      setOrders(result.orders || []);
      setSizesText(customerData?.sizes || "");
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "تعذر جلب تفاصيل العميل من السيرفر",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  // حفظ المقاسات المحدثة وإرسالها للباك إند
  const handleSaveSizes = async (e) => {
    e.preventDefault();
    setSavingSizes(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ sizes: sizesText }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل تحديث المقاسات");

      const updatedCustomer = result.data || result.customer || result;
      setCustomer(updatedCustomer);
      setIsEditingSizes(false);
      
      toast({
        title: "تم الحفظ",
        description: "تم تحديث المقاسات بنجاح.",
      });
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "حدث خطأ أثناء حفظ المقاسات",
        variant: "destructive"
      });
    } finally {
      setSavingSizes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FFFFFF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#f28c28]" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center text-[#1a2c6b]">
        <p>العميل غير موجود أو تم حذفه.</p>
        <Link to="/admin/customers" className="text-[#f28c28] underline mt-2 inline-block">العودة لقائمة العملاء</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title={customer.name} 
        subtitle={customer.phone} 
        actions={
          <Link to="/admin/customers" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm text-sm font-medium">
            <ArrowRight className="w-4 h-4" /> رجوع للعملاء
          </Link>
        } 
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* العمود الجانبي: معلومات العميل والمقاسات */}
        <div className="space-y-6">
          {/* معلومات العميل */}
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">معلومات العميل</SectionTitle>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-[#1a2c6b]/5">
                <dt className="text-[#1a2c6b]/70">الاسم</dt>
                <dd className="font-semibold text-[#1a2c6b]">{customer.name}</dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a2c6b]/5">
                <dt className="text-[#1a2c6b]/70">الهاتف</dt>
                <dd className="font-mono text-[#1a2c6b]" dir="ltr">{customer.phone}</dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a2c6b]/5">
                <dt className="text-[#1a2c6b]/70">عدد الطلبات</dt>
                <dd className="font-mono font-bold text-[#1a2c6b]">{customer.orders ?? 0}</dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a2c6b]/5">
                <dt className="text-[#1a2c6b]/70">إجمالي المشتريات</dt>
                <dd className="font-mono font-bold text-[#1a2c6b] dir-ltr">{money(customer.spent ?? 0)} RWF</dd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1a2c6b]/5">
                <dt className="text-[#1a2c6b]/70">المدفوع</dt>
                <dd className="font-mono text-green-700 font-bold dir-ltr">{money(customer.paid ?? 0)} RWF</dd>
              </div>
              <div className="flex justify-between items-center py-1">
                <dt className="text-[#1a2c6b]/70">المتبقي</dt>
                <dd className={`font-mono font-bold dir-ltr ${(customer.remaining ?? 0) > 0 ? "text-red-600" : "text-green-700"}`}>
                  {money(customer.remaining ?? 0)} RWF
                </dd>
              </div>
            </dl>
          </Card>

          {/* المقاسات المحفوظة والتعديل عليها */}
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1a2c6b]/10 pb-2 mb-4">
              <SectionTitle className="text-[#1a2c6b] font-bold text-base flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#f28c28]" /> المقاسات المحفوظة
              </SectionTitle>
              {!isEditingSizes && (
                <button 
                  onClick={() => setIsEditingSizes(true)} 
                  className="text-xs text-[#f28c28] hover:text-[#e07b1e] flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> تعديل المقاسات
                </button>
              )}
            </div>

            {isEditingSizes ? (
              <form onSubmit={handleSaveSizes} className="space-y-3">
                <textarea 
                  value={sizesText} 
                  onChange={(e) => setSizesText(e.target.value)} 
                  rows={4}
                  className="w-full p-2.5 text-xs font-mono bg-white border border-[#1a2c6b]/15 text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm"
                  placeholder="أدخل تفاصيل المقاسات هنا..."
                  required
                />
                <div className="flex items-center gap-2">
                  <button 
                    type="submit" 
                    disabled={savingSizes}
                    className="flex-1 py-2 bg-[#f28c28] hover:bg-[#e07b1e] text-white text-xs rounded-sm font-medium flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {savingSizes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} 
                    حفظ
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setIsEditingSizes(false); setSizesText(customer.sizes); }} 
                    className="px-3 py-2 border border-[#1a2c6b]/20 text-[#1a2c6b] text-xs rounded-sm hover:bg-[#1a2c6b]/5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-sm text-[#1a2c6b]/80 bg-[#1a2c6b]/5 border border-[#1a2c6b]/10 p-3 rounded-sm font-mono whitespace-pre-line leading-relaxed">
                  {customer.sizes || "لا توجد مقاسات مسجلة."}
                </p>
                <Link 
                  to="/admin/tailoring" 
                  className="w-full mt-4 py-2.5 px-4 bg-[#f28c28] hover:bg-[#e07b1e] text-white text-sm font-medium rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> طلب تفصيل بهذه المقاسات
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* العمود الرئيسي: سجل الطلبات */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
            <SectionTitle className="text-[#1a2c6b] font-bold text-base border-b border-[#1a2c6b]/10 pb-2 mb-4">سجل الطلبات السابقة</SectionTitle>
            <div className="overflow-x-auto">
              <Table
                columns={[
                  { key: "id", label: "رقم الطلب", render: (r) => <span className="font-mono font-medium text-[#1a2c6b]">{r.id || r._id}</span> },
                  { key: "date", label: "التاريخ", render: (r) => <span className="font-mono text-xs text-[#1a2c6b]/70">{r.date ? new Date(r.date).toLocaleDateString() : "-"}</span> },
                  { key: "items", label: "القطع", render: (r) => <span className="font-mono text-[#1a2c6b]">{r.items || 1}</span> },
                  { key: "total", label: "الإجمالي", render: (r) => <span className="font-mono font-semibold text-[#1a2c6b] dir-ltr">{money(r.total || 0)} RWF</span> },
                  { 
                    key: "status", 
                    label: "الحالة", 
                    render: (r) => (
                      <span className={`px-2.5 py-1 rounded-sm text-xs font-medium ${r.status === "تم التسليم" ? "bg-green-100 text-green-700 border border-green-200" : "bg-[#1a2c6b]/10 text-[#1a2c6b] border border-[#1a2c6b]/15"}`}>
                        {r.status || "قيد التنفيذ"}
                      </span>
                    ) 
                  },
                ]}
                rows={orders.length ? orders : []}
                empty="لا توجد طلبات سابقة مسجلة لهذا العميل."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}