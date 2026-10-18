import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Wallet, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Deposits() {
  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [depositsList, setDepositsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipient: "",
    person: "",
    amount: "",
    method: "كاش",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  // دالة استخراج التوكن الذكية
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

  // جلب البيانات من الـ Backend
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/api/deposits`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع بيانات JSON صحيحة (تأكد من صحة مسار الـ API أو تسجيل الدخول)");
      }

      const data = await response.json();
      if (data.success) {
        setDepositsList(data.data);
      } else {
        console.error("خطأ من السيرفر:", data.message);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const total = depositsList.reduce((s, d) => s + Number(d.amount), 0);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      recipient: "",
      person: "",
      amount: "",
      method: "كاش",
      date: new Date().toISOString().split('T')[0],
      notes: ""
    });
    setShow(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      recipient: item.recipient,
      person: item.person,
      amount: item.amount,
      method: item.method,
      date: item.date ? item.date.split('T')[0] : "",
      notes: item.notes
    });
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.recipient) return;

    try {
      const token = getAuthToken();
      const url = editingId ? `${API_URL}/api/deposits/${editingId}` : `${API_URL}/api/deposits`;
      const methodType = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة أثناء الحفظ.");
      }

      const data = await response.json();
      if (data.success) {
        fetchDeposits();
        setShow(false);
        setEditingId(null);
      } else {
        alert(data.message || "حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      console.error("خطأ أثناء الحفظ:", error);
      alert(error.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/deposits/${deleteConfirmId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("الخادم لم يُرجع استجابة JSON صحيحة أثناء الحذف.");
      }

      const data = await response.json();
      if (data.success) {
        setDepositsList(depositsList.filter(d => d._id !== deleteConfirmId));
        setDeleteConfirmId(null);
      } else {
        alert(data.message || "حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error);
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#1a2c6b]/10 shadow-sm">
        <div>
          <h1 className="font-heading text-xl font-bold flex items-center gap-2 text-[#1a2c6b]">
            <Wallet className="w-6 h-6 text-[#f28c28]" /> إدارة الإيداعات والسحوبات
          </h1>
          <p className="text-sm text-[#1a2c6b]/60 mt-1">
            إجمالي الإيداعات: <span className="font-bold text-[#f28c28] dir-ltr inline-block">{total.toLocaleString()} RWF</span>
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#1a2c6b] text-white px-4 py-2 text-sm font-medium hover:bg-[#2a3fae] transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> إضافة سحب جديد
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#1a2c6b]/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#1a2c6b]/5 border-b border-[#1a2c6b]/10 text-[#1a2c6b]/70 font-heading">
              <tr>
                <th className="p-4">المستلم</th>
                <th className="p-4">الجهة / الشخص</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الطريقة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">ملاحظات</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2c6b]/10 text-[#1a2c6b]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#1a2c6b]/50">جاري تحميل البيانات...</td>
                </tr>
              ) : depositsList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#1a2c6b]/50">لا توجد سجلات إيداع حالياً</td>
                </tr>
              ) : (
                depositsList.map((item) => (
                  <tr key={item._id} className="hover:bg-[#1a2c6b]/[2%] transition-colors">
                    <td className="p-4 font-medium">{item.recipient}</td>
                    <td className="p-4 text-[#1a2c6b]/80">{item.person}</td>
                    <td className="p-4 font-mono font-bold text-[#f28c28] dir-ltr">{Number(item.amount).toLocaleString()} RWF</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs bg-[#1a2c6b]/5 border border-[#1a2c6b]/10 text-[#1a2c6b]/80">
                        {item.method}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#1a2c6b]/60">{item.date ? item.date.split('T')[0] : ""}</td>
                    <td className="p-4 text-[#1a2c6b]/60 text-xs">{item.notes || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#1a2c6b]/50 hover:text-[#2a3fae] transition-colors cursor-pointer"
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item._id)}
                          className="p-1.5 text-[#1a2c6b]/50 hover:text-red-600 transition-colors cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: إضافة أو تعديل */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a2c6b]/40 backdrop-blur-sm" onClick={() => setShow(false)} />
          <div className="relative w-full max-w-md bg-white p-6 border border-[#1a2c6b]/10 shadow-xl space-y-4 z-10">
            <div className="flex items-center justify-between border-b border-[#1a2c6b]/10 pb-3">
              <h3 className="font-heading text-lg font-bold text-[#1a2c6b]">
                {editingId ? "تعديل بيانات السحب" : "إضافة سحب جديد"}
              </h3>
              <button onClick={() => setShow(false)} className="text-[#1a2c6b]/50 hover:text-[#1a2c6b] transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">المستلم</label>
                <input
                  type="text"
                  required
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                  placeholder="اسم المستلم..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">الجهة / الشخص</label>
                <input
                  type="text"
                  value={formData.person}
                  onChange={(e) => setFormData({...formData, person: e.target.value})}
                  className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                  placeholder="الجهة أو الشخص..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">المبلغ (RWF)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">طريقة الدفع</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
                    className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                  >
                    <option value="كاش">كاش</option>
                    <option value="بنكك">بنكك</option>
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1a2c6b]/70 mb-1">ملاحظات</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-white border border-[#1a2c6b]/20 px-3 py-2 text-sm text-[#1a2c6b] focus:outline-none focus:border-[#2a3fae] transition-colors"
                  placeholder="ملاحظات إضافية..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1a2c6b] text-white py-2 text-sm font-medium hover:bg-[#2a3fae] transition-colors cursor-pointer"
                >
                  {editingId ? "تحديث التعديلات" : "حفظ"}
                </button>
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="flex-1 bg-[#1a2c6b]/5 border border-[#1a2c6b]/10 py-2 text-sm font-medium text-[#1a2c6b] hover:bg-[#1a2c6b]/10 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: تأكيد الحذف */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a2c6b]/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-w-sm bg-white p-6 border border-[#1a2c6b]/10 shadow-xl space-y-4 z-10 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1a2c6b]">تأكيد الحذف</h3>
              <p className="text-xs text-[#1a2c6b]/60 mt-1">
                هل أنت متأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                نعم، حذف
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-[#1a2c6b]/5 border border-[#1a2c6b]/10 py-2 text-sm font-medium text-[#1a2c6b] hover:bg-[#1a2c6b]/10 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}