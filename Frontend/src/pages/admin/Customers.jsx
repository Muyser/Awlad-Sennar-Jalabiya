import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Check, X, Loader2, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { PageHeader, Table, GoldButton, Badge, Card, Field, inputClass } from "@/components/admin/ui";
import { money } from "@/lib/mockData";
import { toast } from "@/components/ui/use-toast";

export default function Customers() {
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  
  // حالات النوافذ (Modals)
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // حالة التعديل ومعرف العميل الحالي
  const [editingId, setEditingId] = useState(null);
  
  // معرف العميل المراد حذفه
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // حقول النموذج
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSizes, setFormSizes] = useState("");
  const [formOrders, setFormOrders] = useState("");
  const [formSpent, setFormSpent] = useState("");
  const [formPaid, setFormPaid] = useState("");
  const [formRemaining, setFormRemaining] = useState("");

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

  const fetchCustomers = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:5000/api/customers", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل جلب العملاء");
      
      const customersArray = Array.isArray(result) ? result : (result.data || []);
      setCustomersList(Array.isArray(customersArray) ? customersArray : []);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "تعذر الاتصال بالسيرفر لجلب العملاء",
        variant: "destructive"
      });
      setCustomersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const list = Array.isArray(customersList) 
    ? customersList.filter((c) => (c?.name || "").includes(q) || (c?.phone || "").includes(q))
    : [];

  // فتح نافذة الإضافة
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormName("");
    setFormPhone("");
    setFormSizes("");
    setFormOrders("");
    setFormSpent("");
    setFormPaid("");
    setFormRemaining("");
    setModalOpen(true);
  };

  // فتح نافذة التعديل وتعبئة البيانات السابقة
  const handleOpenEditModal = (customer) => {
    setEditingId(customer._id || customer.id);
    setFormName(customer.name || "");
    setFormPhone(customer.phone || "");
    setFormSizes(customer.sizes || "");
    setFormOrders(customer.orders ?? "");
    setFormSpent(customer.spent ?? "");
    setFormPaid(customer.paid ?? "");
    setFormRemaining(customer.remaining ?? "");
    setModalOpen(true);
  };

  // حفظ العميل (إضافة جديد POST أو تعديل PUT)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      
      const payload = {
        name: formName.trim(),
        phone: formPhone.trim(),
        sizes: formSizes.trim() || "غير محدد",
        orders: formOrders === "" ? 0 : Number(formOrders),
        spent: formSpent === "" ? 0 : Number(formSpent),
        paid: formPaid === "" ? 0 : Number(formPaid),
        remaining: formRemaining === "" ? 0 : Number(formRemaining)
      };

      const url = editingId 
        ? `http://localhost:5000/api/customers/${editingId}`
        : "http://localhost:5000/api/customers";
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل حفظ العميل");

      const savedCustomer = result.data || result;

      if (editingId) {
        setCustomersList(customersList.map(c => (c._id === editingId || c.id === editingId) ? savedCustomer : c));
        toast({ title: "تم التعديل بنجاح", description: "تم تحديث بيانات العميل." });
      } else {
        setCustomersList([savedCustomer, ...customersList]);
        toast({ title: "تم الحفظ بنجاح", description: "تمت إضافة العميل للنظام." });
      }
      
      setModalOpen(false);
    } catch (err) {
      toast({
        title: "خطأ في العملية",
        description: err.message || "حدث خطأ أثناء الاتصال بالسيرفر",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // فتح نافذة تأكيد الحذف
  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  // تنفيذ الحذف الفعلي بعد التأكيد من المودال
  const handleDeleteExecute = async () => {
    if (!customerToDelete) return;
    const id = customerToDelete._id || customerToDelete.id;

    setDeleting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل حذف العميل");

      setCustomersList(customersList.filter(c => (c._id !== id && c.id !== id)));
      toast({ title: "تم الحذف", description: "تم حذف العميل بنجاح من النظام." });
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      toast({
        title: "خطأ في الحذف",
        description: err.message || "تعذر حذف العميل",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title="العملاء" 
        subtitle={`${customersList.length} عميل مسجل`} 
        actions={
          <GoldButton 
            onClick={handleOpenAddModal} 
            className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> عميل جديد
          </GoldButton>
        } 
      />

      {/* حقل البحث */}
      <Card className="p-4 mb-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2c6b]/40" />
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="ابحث بالاسم أو رقم الهاتف..." 
            className="w-full pr-9 pl-3 py-2.5 bg-[#FFFFFF] border border-[#1a2c6b]/15 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#f28c28] rounded-sm shadow-sm" 
          />
        </div>
      </Card>

      {/* جدول عرض العملاء */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#f28c28]" />
            </div>
          ) : (
            <Table
              columns={[
                { 
                  key: "name", 
                  label: "العميل", 
                  render: (r) => (
                    <Link to={`/admin/customers/${r._id || r.id}`} className="font-medium text-[#1a2c6b] hover:text-[#f28c28] transition-colors">
                      {r.name}
                    </Link>
                  ) 
                },
                { key: "phone", label: "الهاتف", render: (r) => <span className="font-mono text-[#1a2c6b]" dir="ltr">{r.phone}</span> },
                { key: "orders", label: "الطلبات", render: (r) => <span className="font-mono text-[#1a2c6b]">{r.orders ?? 0}</span> },
                { key: "spent", label: "إجمالي المشتريات", render: (r) => <span className="font-mono text-[#1a2c6b] dir-ltr">{money(r.spent ?? 0)} RWF</span> },
                { key: "sizes", label: "المقاسات", render: (r) => <span className="text-xs text-[#1a2c6b]/70 bg-[#1a2c6b]/5 px-2 py-1 rounded-sm border border-[#1a2c6b]/10">{r.sizes}</span> },
                { key: "paid", label: "المدفوع", render: (r) => <span className="font-mono text-green-700 font-medium dir-ltr">{money(r.paid ?? 0)} RWF</span> },
                { 
                  key: "remaining", 
                  label: "المتبقي", 
                  render: (r) => {
                    const rem = r.remaining ?? 0;
                    return (
                      <Badge variant={rem > 0 ? "red" : "green"} className={`dir-ltr ${rem > 0 ? "bg-red-100 text-red-700 border-red-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                        {money(rem)} RWF
                      </Badge>
                    );
                  } 
                },
                {
                  key: "actions",
                  label: "الإجراءات",
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(r)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(r)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              rows={list}
              empty="لا توجد عملاء مسجلين حالياً في قاعدة البيانات."
            />
          )}
        </div>
      </Card>

      {/* نافذة (مودال) إضافة أو تعديل عميل */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b] my-8">
            <button 
              onClick={() => setModalOpen(false)} 
              className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center justify-between mb-4 border-b border-[#1a2c6b]/10 pb-3">
              <h3 className="font-heading text-lg font-bold">
                {editingId ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <Field label="اسم العميل">
                <input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </Field>
              
              <Field label="رقم الهاتف">
                <input 
                  value={formPhone} 
                  onChange={(e) => setFormPhone(e.target.value)} 
                  className={inputClass} 
                  dir="ltr" 
                  required 
                />
              </Field>

              <Field label="المقاسات / ملاحظات التفصيل">
                <input 
                  value={formSizes} 
                  onChange={(e) => setFormSizes(e.target.value)} 
                  className={inputClass} 
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="عدد الطلبات">
                  <input 
                    type="number" 
                    value={formOrders} 
                    onChange={(e) => setFormOrders(e.target.value)} 
                    className={inputClass} 
                  />
                </Field>
                <Field label="إجمالي المشتريات (RWF)">
                  <input 
                    type="number" 
                    value={formSpent} 
                    onChange={(e) => setFormSpent(e.target.value)} 
                    className={inputClass} 
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="المدفوع (RWF)">
                  <input 
                    type="number" 
                    value={formPaid} 
                    onChange={(e) => setFormPaid(e.target.value)} 
                    className={inputClass} 
                  />
                </Field>
                <Field label="المتبقي (RWF)">
                  <input 
                    type="number" 
                    value={formRemaining} 
                    onChange={(e) => setFormRemaining(e.target.value)} 
                    className={inputClass} 
                  />
                </Field>
              </div>

              <div className="pt-3">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                  {editingId ? "تحديث بيانات العميل" : "حفظ العميل في النظام"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة (مودال) تأكيد الحذف المخصصة */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-lg font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-sm text-gray-600 mb-6">
              هل أنت متأكد من رغبتك في حذف العميل <span className="font-semibold text-[#1a2c6b]">"{customerToDelete?.name}"</span>؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-sm font-medium text-sm transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-sm font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}