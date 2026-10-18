import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Phone, Clock, Check, X } from "lucide-react";
import { Card, PageHeader, Badge, GoldButton, Field, inputClass } from "@/components/admin/ui";
import { BRANCHES } from "@/lib/mockData";

export default function AdminBranches() {
  const [branchesList, setBranchesList] = useState(BRANCHES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // حقول نموذج الفرع
  const [formName, setFormName] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formHours, setFormHours] = useState("");
  const [formStatus, setFormStatus] = useState("مفتوح");

  // فتح نافذة الإضافة
  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormName("");
    setFormArea("");
    setFormAddress("");
    setFormPhone("");
    setFormHours("");
    setFormStatus("مفتوح");
    setModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setFormName(branch.name || "");
    setFormArea(branch.area || "");
    setFormAddress(branch.address || "");
    setFormPhone(branch.phone || "");
    setFormHours(branch.hours || "");
    setFormStatus(branch.status || "مفتوح");
    setModalOpen(true);
  };

  // حفظ الفرع (إضافة أو تعديل)
  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingBranch !== null) {
      // تعديل
      setBranchesList(branchesList.map(b => b.id === editingBranch.id ? {
        ...b,
        name: formName,
        area: formArea,
        address: formAddress,
        phone: formPhone,
        hours: formHours,
        status: formStatus
      } : b));
    } else {
      // إضافة جديد
      const newBranch = {
        id: Date.now(),
        name: formName,
        area: formArea,
        address: formAddress,
        phone: formPhone,
        hours: formHours,
        status: formStatus
      };
      setBranchesList([...branchesList, newBranch]);
    }
    setModalOpen(false);
  };

  // حذف فرع
  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفرع؟")) {
      setBranchesList(branchesList.filter(b => b.id !== id));
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1a2c6b] p-3 sm:p-6 transition-all">
      <PageHeader 
        title="الفروع" 
        subtitle={`${branchesList.length} فروع`} 
        actions={
          <GoldButton onClick={handleOpenAdd} className="bg-[#f28c28] hover:bg-[#e07b1e] text-white flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> إضافة فرع
          </GoldButton>
        } 
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {branchesList.map((b) => (
          <Card key={b.id} className="p-5 bg-white border border-[#1a2c6b]/10 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1a2c6b]">{b.name}</h3>
                  <span className="text-xs text-[#1a2c6b]/60">{b.area}</span>
                </div>
                <Badge variant={b.status === "مفتوح" ? "green" : "red"} className={b.status === "مفتوح" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}>
                  {b.status}
                </Badge>
              </div>
              <ul className="space-y-2.5 text-sm text-[#1a2c6b]/75 mb-6">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#f28c28] mt-0.5 shrink-0" />
                  <span>{b.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#f28c28] shrink-0" />
                  <span className="font-mono" dir="ltr">{b.phone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#f28c28] shrink-0" />
                  <span>{b.hours}</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1a2c6b]/5">
              <button 
                onClick={() => handleOpenEdit(b)} 
                className="inline-flex items-center gap-1.5 text-sm text-[#f28c28] hover:text-[#e07b1e] font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" /> تعديل الفرع
              </button>
              <button 
                onClick={() => handleDelete(b.id)} 
                className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* مودال إضافة / تعديل فرع */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-[#1a2c6b]/10 text-[#1a2c6b]">
            <button onClick={() => setModalOpen(false)} className="absolute left-4 top-4 text-[#1a2c6b]/60 hover:text-[#f28c28]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading text-lg font-bold mb-4">
              {editingBranch !== null ? "تعديل الفرع" : "إضافة فرع جديد"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="اسم الفرع">
                <input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="مثال: فرع الرياض" 
                  className={inputClass} 
                  required 
                />
              </Field>
              <Field label="المنطقة / الحي">
                <input 
                  value={formArea} 
                  onChange={(e) => setFormArea(e.target.value)} 
                  placeholder="مثال: شارع البراحة" 
                  className={inputClass} 
                />
              </Field>
              <Field label="العنوان بالتفصيل">
                <input 
                  value={formAddress} 
                  onChange={(e) => setFormAddress(e.target.value)} 
                  placeholder="مثال: بجوار السوق المركزي" 
                  className={inputClass} 
                />
              </Field>
              <Field label="رقم الهاتف">
                <input 
                  value={formPhone} 
                  onChange={(e) => setFormPhone(e.target.value)} 
                  placeholder="مثال: +249912345678" 
                  className={inputClass} 
                  dir="ltr" 
                />
              </Field>
              <Field label="ساعات العمل">
                <input 
                  value={formHours} 
                  onChange={(e) => setFormHours(e.target.value)} 
                  placeholder="مثال: 9 صباحاً - 10 مساءً" 
                  className={inputClass} 
                />
              </Field>
              <Field label="الحالة">
                <select 
                  value={formStatus} 
                  onChange={(e) => setFormStatus(e.target.value)} 
                  className={`${inputClass} bg-white`}
                >
                  <option value="مفتوح">مفتوح</option>
                  <option value="مغلق">مغلق</option>
                </select>
              </Field>
              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-[#f28c28] text-white hover:bg-[#e07b1e] transition-colors rounded-sm shadow-sm font-medium text-sm flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> حفظ الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}