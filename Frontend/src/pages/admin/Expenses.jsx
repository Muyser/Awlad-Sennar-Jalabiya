import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { Card, PageHeader, Table, Field, inputClass, GoldButton } from "@/components/admin/ui";
import { EXPENSE_TYPES, money } from "@/lib/mockData";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Expenses() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات المودالات
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // حقول نموذج المصروف
  const [formType, setFormType] = useState(EXPENSE_TYPES[0] || "");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

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

  const fetchExpenses = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/expenses`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل جلب المصروفات");
      
      const expensesArray = Array.isArray(result) ? result : (result.data || []);
      setExpensesList(Array.isArray(expensesArray) ? expensesArray : []);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "تعذر الاتصال بالسيرفر لجلب المصروفات",
        variant: "destructive"
      });
      setExpensesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = Array.isArray(expensesList) 
    ? expensesList.reduce((s, e) => s + (Number(e.amount) || 0), 0)
    : 0;

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormType(EXPENSE_TYPES[0] || "");
    setFormAmount("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormNotes("");
    setModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setFormType(exp.type || EXPENSE_TYPES[0]);
    setFormAmount(String(exp.amount || ""));
    setFormDate(exp.date ? exp.date.split("T")[0] : "");
    setFormNotes(exp.notes || "");
    setModalOpen(true);
  };

  // حفظ المصروف (إضافة POST أو تعديل PUT)
  const handleSave = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (isNaN(amountVal)) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const payload = {
        type: formType,
        amount: amountVal,
        date: formDate || new Date().toISOString().split("T")[0],
        notes: formNotes || ""
      };

      const expenseId = editingExpense?._id || editingExpense?.id;
      const url = expenseId 
        ? `${API_URL}/api/expenses/${expenseId}`
        : `${API_URL}/api/expenses`;
      
      const method = expenseId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل حفظ المصروف");

      const savedExpense = result.data || result;

      if (expenseId) {
        setExpensesList(expensesList.map(ex => ((ex._id === expenseId || ex.id === expenseId) ? savedExpense : ex)));
        toast({ title: "تم التعديل بنجاح", description: "تم تحديث بيانات المصروف." });
      } else {
        setExpensesList([savedExpense, ...expensesList]);
        toast({ title: "تم الحفظ بنجاح", description: "تمت إضافة المصروف للنظام." });
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
  const confirmDelete = (exp) => {
    setExpenseToDelete(exp);
    setDeleteModalOpen(true);
  };

  // تنفيذ الحذف الفعلي
  const handleDeleteExecute = async () => {
    if (!expenseToDelete) return;
    const expenseId = expenseToDelete._id || expenseToDelete.id;

    setDeleting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "فشل حذف المصروف");

      setExpensesList(expensesList.filter(ex => ex._id !== expenseId && ex.id !== expenseId));
      toast({ title: "تم الحذف", description: "تم حذف المصروف بنجاح." });
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      toast({
        title: "خطأ في الحذف",
        description: err.message || "تعذر حذف المصروف",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader
        title="المصروفات"
        subtitle={`الإجمالي: ${money(total)} RWF`}
        actions={
          <GoldButton 
            onClick={handleOpenAdd} 
            className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> إضافة مصروف
          </GoldButton>
        }
      />

      {/* Table Container */}
      <Card className="p-0 overflow-hidden bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#f28c28]" />
            </div>
          ) : (
            <Table
              columns={[
                { key: "type", label: "النوع", render: (r) => <span className="font-medium text-[#1a2c6b]">{r.type}</span> },
                { key: "amount", label: "المبلغ", render: (r) => <span className="font-mono text-[#f28c28] font-bold dir-ltr inline-block">{money(r.amount)} RWF</span> },
                { key: "date", label: "التاريخ", render: (r) => <span className="font-mono text-xs text-[#1a2c6b]/60">{r.date ? r.date.split("T")[0] : ""}</span> },
                { key: "notes", label: "ملاحظات", render: (r) => <span className="text-[#1a2c6b]/70 text-sm">{r.notes}</span> },
                { key: "actions", label: "إجراءات", render: (r) => (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(r)} className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors rounded-sm hover:bg-[#1a2c6b]/5 cursor-pointer" title="تعديل">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(r)} className="p-1.5 text-[#1a2c6b]/60 hover:text-[#f28c28] transition-colors rounded-sm hover:bg-[#1a2c6b]/5 cursor-pointer" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) },
              ]}
              rows={expensesList}
              empty="لا توجد مصروفات مسجلة حالياً."
            />
          )}
        </div>
      </Card>

      {/* مودال إضافة / تعديل مصروف */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
          <Card className="relative w-full max-w-md p-6 space-y-4 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-lg text-[#1a2c6b] z-10">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold">
                {editingExpense !== null ? "تعديل المصروف" : "إضافة مصروف"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#1a2c6b]/60 hover:text-[#f28c28] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="النوع">
                <select 
                  value={formType} 
                  onChange={(e) => setFormType(e.target.value)} 
                  className={`${inputClass} bg-white`}
                >
                  {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="المبلغ (RWF)">
                <input 
                  type="number" 
                  step="any"
                  value={formAmount} 
                  onChange={(e) => setFormAmount(e.target.value)} 
                  placeholder="0" 
                  className={inputClass} 
                  required 
                />
              </Field>

              <Field label="التاريخ">
                <input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className={inputClass} 
                  required 
                />
              </Field>

              <Field label="ملاحظات">
                <textarea 
                  rows={2} 
                  value={formNotes} 
                  onChange={(e) => setFormNotes(e.target.value)} 
                  placeholder="تفاصيل إضافية..." 
                  className={inputClass} 
                />
              </Field>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} حفظ
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="flex-1 py-3 border border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 transition-colors rounded-sm font-medium text-sm cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </Card>
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
              هل أنت متأكد من رغبتك في حذف هذا المصروف بقيمة <span className="font-semibold text-[#1a2c6b] dir-ltr inline-block">{money(expenseToDelete?.amount)} RWF</span>؟ لا يمكن التراجع عن هذا الإجراء.
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